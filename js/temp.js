function Temp (props){

  const [count, setCount] = React.useState(0);

  

  React.useEffect(() => {
    setInterval(() => {
      //setCount(prevCount => prevCount + 1);
      Mak.sync();
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
  )
}

function representLine(data){
  return <div style={{overflow:"hidden"}} >
    <span  class="lineLabel">{data("line.name")}</span>
    <div class="line"  onDragOver={e=> e.preventDefault()} onDrop={e=>{DnD(data("line"), e.dataTransfer.getData("text"))}}>
        {from("Task t").where("t.line=line").map(Task)}
    </div>
  </div>
}

function Park(props) {
  return <div style={{overflow:"hidden"}}>
      <span class="lineLabel">Park</span>
      <div class="line" onDragOver={e=> e.preventDefault()} onDrop={e=>{DnDPark( e.dataTransfer.getData("text"))}}>
          {from("Task t").where("t.line=nil").map(TaskPark)} 
      </div>
    </div>
  
}

function Task(data){
  const startDateMillis = data("t.startDate");
  const firstDate = new Date("01/01/2021 00:00:00");
  const firstDateMillis =  firstDate.getTime(); 
  const differenceMillis = startDateMillis - firstDateMillis;
  const differenceDays = Math.round((differenceMillis)/(1000*60*60*24));

  const width = data("t.days") + "px";
  const left = differenceDays.toString() + "px";
   
  return <div class="task" draggable="true" onDragStart={e=>{e.dataTransfer.setData("text", data("t").toString())}}  style={{left: left, width: width ,display:"inline"}}>
    {data("t.customer")} 
  </div>
}

function TaskPark(data){
  let parkWidth = data("t.days") + "px";
  return <div class="task" draggable="true" onDragStart={e=>{e.dataTransfer.setData("text", data("t").toString())}} style={{  width: parkWidth , position:"relative" }}> 
    {data("t.customer")} 
  </div>
}

function StartDate(props){
  const date = new Date(props.millis)
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
  const date = new Date(props.millis+ (props.days)*86400000)  
  if(date.toString().slice(0,15)=="Invalid Date") 
    return <span> </span>;
  else
    return(
      <span>
        {date.toString().slice(0,15)}
      </span>
    )
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
        <tr>  
          <td> <input type="text" style={{font:"inherit"}} size="10" value={data("t.customer")} onInput={e=>sync(e.target.value, data("t"),"customer","String")}/></td>
          <td> {data("t.line.name")} </td>
          <td> {<StartDate millis={data("t.startDate")}/>} </td>
          <td> <input type="text" style={{font:"inherit"}} size="5" value={data("t.days")} onInput={e=>sync(e.target.value, data("t"),"days","Integer")}/> </td>
          <td> {<EndDate millis={data("t.startDate")} days={data("t.days")}/>} </td>
        </tr>
        )}
      </tbody>
    </table>
  )
}

function sync(e,d,s,p) {
  const response = fetch("http://standup.csc.kth.se:8080/mak-backend/MakumbaQueryServlet", {
    method: 'POST',
    body: "object="+d+"&type=Task&path="+s+"&value="+e+"&exprType=java.lang."+p
  });
  return response; 
}

function DnD(line,t){
  const response = fetch("http://standup.csc.kth.se:8080/mak-backend/MakumbaQueryServlet", {
    method: "POST",
    body: 
    "updateFrom=Task%20t%2C%20ProductionLine%20line&updateSet=t.line%3Dline%2C%20t.startDate%3DdateAdd('2021-01-01'%2C%20%3Ax%2C%20'day')&updateWhere=t%3D%3At%20AND%20line%3D%3Aline&param=%7B%22t%22%3A%22"+t+"%22%2C%22line%22%3A%22"+line+"%22%2C%22x%22%3A284%7D"
  });
  return response;
}

function DnDPark(t){
  const response = fetch("http://standup.csc.kth.se:8080/mak-backend/MakumbaQueryServlet", {
    method: "POST",
    body: "updateFrom=Task%20t&updateSet=t.line%3Dnil%2C%20t.startDate%3Dnil&updateWhere=t%3D%3At&param=%7B%22t%22%3A%22"+t+"%22%7D"
  });  
  return response;
}