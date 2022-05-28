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
             <div class="line" onDragOver={e=> e.preventDefault()}  onDrop={drop()}>
               {from("Task t").where("t.line=line").map(Task)}
             </div>
           </div>;
}

function Park(props) {
    return <div style={{overflow:"hidden"}}>
             <span class="lineLabel">Park</span>
             <div class="line" onDragOver={e=> e.preventDefault()} onDrop={drop()}>
               {from("Task t").where("t.line=nil").map(TaskPark)} 
             </div>
           </div>;
}

function Task(data){
    return <div key={data("t")} class="task" draggable="true" 
                onDragStart={drag("t")}
                style={{left: data("datediff(t.startDate,'2021-01-01')")+"px",
                        width: data("t.days") + "px",
                        position: "absolute"
                       }}>
             {data("t.customer")} 
           </div>;
}

function TaskPark(data){
    return <div key={data("t")} class="task" draggable="true" 
                onDragStart={drag("t")}
                style={{ width: data("t.days") + "px" }}> 
             {data("t.customer")} 
           </div>;
}

function dateToString(millis){
    return millis? new Date(millis).toString().slice(0,15):"";
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

      <tbody >{from("Task t").orderBy("t.startDate").map(data=>
          <tr key={data("t")}>
          <td> <input type="text" /*style={{font:"inherit"}}*/ size="10" value={data("t.customer")} onInput={sync()}/></td>
          <td> {data("t.line.name")} </td>
          <td>{ dateToString(data("t.startDate"))} </td>
          <td> <input type="text" style={{font:"inherit"}} size="5" value={data("t.days")} onInput={sync()}/> </td>
          <td>{ dateToString(data("dateAdd(t.startDate, t.days, 'day')"))} </td>
        </tr>
        )}
      </tbody>
    </table>
  );
}
