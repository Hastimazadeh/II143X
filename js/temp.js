function Temp (props){

  //const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    setInterval(() => {
      //setCount(prevCount => prevCount + 1);
//      Mak.sync();
    }, 1000);
  }, []);
  return (
    <React.Fragment>
      <div >{
        from("ProductionLine line").map(representLine)
      }</div>
      <Park />
      <Table/>
    </React.Fragment>
  );
}

function representLine(data){
    return <div key={data("line")} style={{overflow:"hidden"}} >
    <span  class="lineLabel">{data("line.name")}</span>
    <div class="line"  
        onDragOver={(e)=> {e.preventDefault() }} 
        onDrop={(e)=>{
          e.preventDefault();
          //if(e.nativeEvent) e= e.nativeEvent;
          DnD( data("line"), e.dataTransfer.getData("task") , e.nativeEvent.offsetX-e.dataTransfer.getData("dx") )
        }}>
        {from("Task t").where("t.line=line").map(Task)}
    </div>
   </div>;
}

function Park(props) {
  return <div style={{overflow:"hidden"}}>
      <span class="lineLabel">Park</span>
      <div class="line" onDragOver={e=> e.preventDefault()} 
                        onDrop={e=>{DnDPark( e.dataTransfer.getData("task"))}}>
        {from("Task t").where("t.line=nil").map(TaskPark)} 
      </div>
   </div>;
  
}

function Task(data){
  const startDateMillis = data("t.startDate");//
  const firstDate = new Date("01/01/2021 00:00:00");
  const firstDateMillis =  firstDate.getTime(); //
  const differenceMillis = startDateMillis - firstDateMillis;
  const differenceDays = Math.round((differenceMillis)/(1000*60*60*24));

  const width = data("t.days") + "px";
  const left = differenceDays.toString() + "px";
   
    return <div key={data("t")} class="task" draggable="true" 
  onDragStart={(e)=>{ 
    //if(e.nativeEvent) e= e.nativeEvent;
    e.dataTransfer.setData("task", data("t").toString());
    e.dataTransfer.setData("dx", e.nativeEvent.offsetX);
  }}
    style={{left: left, width: width ,display:"inline"}}>
    {data("t.customer")} 
   </div>;
}

function TaskPark(data){
  let parkWidth = data("t.days") + "px";
    return <div key={data("t")} class="task" draggable="true" 
  onDragStart={(e)=>{ 
    //if(e.nativeEvent) e= e.nativeEvent;
    e.dataTransfer.setData("task", data("t").toString());
    e.dataTransfer.setData("dx", e.nativeEvent.offsetX);
}}
   style={{ width: parkWidth , position:"relative" }}> 
    {data("t.customer")} 
  </div>;
}

function StartDate(props){
  const date = new Date(props.millis);
  if(date.toString().slice(0,15)=="Invalid Date") 
    return <span> </span>;
  else
    return(
      <span>
        {date.toString().slice(0,15)}
      </span>
    )
}

function EndDate(props){
  const date = new Date(props.millis+ (props.days)*86400000) ;
  if(date.toString().slice(0,15)=="Invalid Date") 
    return <span> </span>;
  else
    return(
      <span>
        {date.toString().slice(0,15)}
      </span>
    );
}

function Table(props){
  return(
    <table class="table" >
      <thead>
        <tr>
          <th>Customer</th>
          <th>Line</th>
          <th>Start Date</th>
          <th>Days</th>
          <th>End Date</th>
        </tr>
      </thead> 

      <tbody > {from("Task t").orderBy("t.startDate").map(data=>
          <tr key={data("t")}>  
          <td> <input type="text" style={{font:"inherit"}} size="10" value={data("t.customer")} onInput={sync()}/></td>
          <td> {data("t.line.name")} </td>
          <td> {<StartDate millis={data("t.startDate")}/>} </td>
          <td> <input type="text" style={{font:"inherit"}} size="5" value={data("t.days")} onInput={sync()}/> </td>
          <td> {<EndDate millis={data("t.startDate")} days={data("t.days")}/>} </td>
        </tr>
        )}
      </tbody>
    </table>
  );
}

function DnD(line,t,x){
  const response = fetch("http://standup.csc.kth.se:8080/mak-backend/MakumbaQueryServlet", {
    method: "POST",
    body: 
      new URLSearchParams({
        updateFrom:"Task t, ProductionLine line",
        updateSet: "t.line=line, t.startDate=dateAdd('2021-01-01', :x, 'day')",
        updateWhere:'t=:t AND line=:line',
        param:JSON.stringify({t,line,x})
      })
  }).then(()=>{Mak.sync();});
  return response;
}

/* for moving tasks TO the park line */
function DnDPark(t){
  const response = fetch("http://standup.csc.kth.se:8080/mak-backend/MakumbaQueryServlet", {
    method: "POST",
    body: "updateFrom=Task%20t&updateSet=t.line%3Dnil%2C%20t.startDate%3Dnil&updateWhere=t%3D%3At&param=%7B%22t%22%3A%22"+t+"%22%7D"
  }).then(()=>{Mak.sync();});  
  return response;
}
