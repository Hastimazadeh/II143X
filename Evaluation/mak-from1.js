async function hitDatabase(queries){   
    const r= await fetch("http://standup.csc.kth.se:8080/mak-backend/MakumbaQueryServlet", {
        method: "POST",
        credentials: "include",
        body:
        "request=" +
            encodeURIComponent(JSON.stringify({ queries})) +
            "&analyzeOnly=false"
    });
    if(!r.ok)
        throw JSON.stringify(await r.json());
    return await r.json();
}

let queryState={
    cleanup(){
        this.queryFinder={};
        this.queries=[];
        this.parent=-1;
        this.dirty=null;
        this.queryDiscovery=null;
        this.queryDirty=null;
        this.data=null;
        this.metaData=null;
    },
    
    findQuery(q){
        const {queryState, loading, ...props}=q;
        const key=JSON.stringify(props);
        const ret= this.queryFinder[key];
        if(ret)
            return ret;
        this.queryDirty=true;
        this.queries.push({
            projections: [],
            querySections: [q.from,  q.where, q.groupBy, q.orderBy, null, null, null],
            parentIndex: this.parent,
            limit: -1,
            offset: 0
        });
        return this.queryFinder[key]=this.queries.length-1;
    },
    collectProjections(proj, queryIndex){
        if (!this.queries[queryIndex].projections.includes(proj)) {
            this.queries[queryIndex].projections.push(proj);
            this.dirty=true;
        }
    },
};
queryState.cleanup();

function from(from){
    return new Query({from});
}

class Query{
    constructor(props){
        Object.assign(this, props);
        this.loading=()=>"";
    }
    
    where(where){ return new Query({...this, where});}
    orderBy(orderBy){ return new Query({...this, orderBy});}
    groupBy(groupBy){ return new Query({...this, groupBy});}
    loading(loading){ return new Query({...this, loading});}
    
    map(func, qs=queryState){
        this.parent=qs.parent;
        if(Mak.dropDestination){
            Mak.dropDestination.calculate(this);
        }
        let queryIndex= qs.findQuery(this);
        
        if(!queryIndex)
            return this.rootMap(func, qs);
        else 
            return this.childMap(func, qs, queryIndex);
    }
    
    rootMap(func, qs){
        qs.queryDiscovery=true;
        this.dryRun(func, qs, 0);
        qs.queryDiscovery=false;
        this.queryState=Object.assign({},qs);
        
        // leave a clean state after analysis
        qs.cleanup();
        
        const refresh=()=>{
            return this.runQueries(func);
        };
        const prms=refresh();
        
        prms.refresh= ()=> refresh();
        prms.toReact=()=>toReact(prms, this.loading);
        prms.toVue=()=>toVue(prms, this.loading);
        let ret= prms;
        try{
            Vue;
            ret=prms.toVue();
        }catch(e){}
        try{
            ReactDOM;
            ret=Object.assign({},prms.toReact());
        }catch(e){}
        if(ret!=prms){
            ret.then= prms.then.bind(prms);
            ret.catch= prms.catch.bind(prms);
        }
        return ret;
    }

    async runQueries(func){
        let result;
        do{
            this.queryState.dirty=false;
            this.queryState.queryDirty=false;
            const apiResult= await hitDatabase(this.queryState.queries);
            this.queryState.data= apiResult.resultData;
            this.queryState.metaData= apiResult.results;
            // promise is fulfilled, we iterate to completion
            queryState=this.queryState;
            result= this.iterate(func, queryState, 0);
        }while(this.queryState.dirty || this.queryState.queryDirty);
        // leave a clean state after data iteration
        queryState=Object.assign({},this.queryState);
        queryState.cleanup();
        return result;
    }
    
    iterate(func, qs, queryIndex){
        const dt=qs.data;
        try{
            return dt[queryIndex].map(function(d, i, arr){
                qs.data=d;
                qs.parent=queryIndex;
                return func(Mak.variableExpr=function(proj){
                    Mak.lastProj= proj;
                    Mak.lastType= qs.metaData[queryIndex].columnType[qs.metaData[queryIndex].columnIndex[proj]];
                    const dot= proj.indexOf(".");
                    if(dot!=-1){
                        Mak.lastObjLabel= proj.slice(0, dot);
                        Mak.lastObj= d[Mak.lastObjLabel];
                        Mak.lastObjType= qs.metaData[queryIndex].columnType[qs.metaData[queryIndex].columnIndex[Mak.lastObjLabel]];
                        Mak.lastPath= proj.slice(dot+1);
                    }
                    // TODO: dirty
                    return d[proj];
                }, i, arr);           
            });
        }finally{
            qs.data=dt;
            qs.parent=this.parent;
            Mak.variableExpr=null;
        }
    }
    dryRun(func, qs, queryIndex){
        qs.parent=queryIndex;
        try{        
            func(Mak.variableExpr= function(proj){ return qs.collectProjections(proj, queryIndex);}, -1, []);
        }finally{ qs.parent=this.parent; Mak.variableExpr=null;}
    }
    childMap(func, qs, queryIndex){
        if(qs.queryDiscovery){
            this.dryRun(func, qs, queryIndex);
            return [];
        }
        else return this.iterate(func, qs, queryIndex);
    }
    
}


const Mak={
    addObserver(o){ this.subscribers= this.subscribers?[...this.subscribers, o]:[o]; return ()=>this.removeObserver(o); },
    removeObserver(o){ this.subscribers= this.subscribers.filter(x=>x!=o);},
    sync(){ this.subscribers && this.subscribers.forEach(o=>o());},
    expr(expr){return this.variableExpr(expr);},
};


function sync(){
    const expr= Mak.lastProj;
    const type= Mak.lastType;
    const obj= Mak.lastObj;
    const path= Mak.lastPath;
    const objType= Mak.lastObjType&&  Mak.lastObjType.slice(4);
    return function(e){
        return fetch("http://standup.csc.kth.se:8080/mak-backend/MakumbaQueryServlet", {
            method: 'POST',
            body: "object="+obj+"&type="+objType+"&path="+path+"&value="+e.target.value+"&exprType="+type
        }).then(()=>{Mak.sync();});
        
    };
}

function drag(label){
    const obj= Mak.expr(label);
    return function(e){ 
        //if(e.nativeEvent) e= e.nativeEvent;
        e.dataTransfer.setData("object", obj.toString());
        e.dataTransfer.setData("dx", e.nativeEvent.offsetX);
    };
}

function RenderPromiseReact({promise, loading}){
    const [data, setData]=React.useState();
    const [error, setError]=React.useState();
    React.useEffect(()=> {promise.then(d=> setData(d)).catch(e=>setError(e));}, []);
    React.useEffect(()=> Mak.addObserver(()=> promise.refresh().then(d=> setData(d)).catch(e=>setError(e))), []);
    
    return error || data || loading();
}

const RenderPromiseVue={
    props:["promise", "loading"],
    data(){
        return { data:null, error:null};
    },
    created(){
        this.promise.then(d=>this.data=d).catch(e=>this.error=e);
        this.unsubscribe=Mak.addObserver(()=> this.promise.refresh().then(d=> this.data=d).catch(e=>this.error=e));
    },
    render(){
        return this.error || this.data || this.loading();
    },
    unmounted(){
        this.unsubscribe();
    }
};

function toReact(promise, loading){
    return React.createElement(RenderPromiseReact, {promise, loading});
}
function toVue(promise, loading){
    return Vue.h(RenderPromiseVue, {promise, loading});
}


// ---------- mock-up drop

function drop(){
    let line=null;
    const box= {
        calculate(query){
            if(query.where!= "t.line=nil")
                line= Mak.lastObj;
        }
    };
    Mak.dropDestination=box;
    return function(e){
        e.preventDefault();
        //if(e.nativeEvent) e= e.nativeEvent;
        dropMock( line, e.dataTransfer.getData("object") , e.nativeEvent.offsetX-e.dataTransfer.getData("dx") );
    };  
}
function dropMock(line,t,x){
    const ln= line? ":line": "nil";
    const startDate= line? "dateAdd('2021-01-01', :x, 'day')" : "nil";
    
    const response = fetch("http://standup.csc.kth.se:8080/mak-backend/MakumbaQueryServlet", {
        method: "POST",
        body: 
        new URLSearchParams({
            updateFrom: "Task t",
            updateSet: "t.line="+ln+", t.startDate="+ startDate,
            updateWhere:'t=:t',
            param: JSON.stringify(line?{t,line,x}:{t})
        })
    }).then(()=>{Mak.sync();});
    return response;
}
