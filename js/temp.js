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
      <div>{
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
    <div class="line" >{from("Task t").where("t.line=line").map(Task)}
    </div>
  </div>
}

function Park (props) {
  return <div style={{overflow:"hidden"}}>
      <span class="lineLabel">Park:</span>
      <div class="line">
        {/* <div style={{float:"left"}}> */}
          {from("Task t").where("t.line=nil").map(Task)}
        {/* </div> */}
      </div>
    </div>
  
}

function Task(data){
  console.log(data("t.customer"));
  let left = "100" + "px";
  return <div class="task" style={{left: left}} >
    {data("t.customer")} : {data("t.days")}
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
          <td> <input type="text" onkeyup="synch()" value={data("t.customer")}/></td>
          <td> {data("t.line.name")} </td>
          <td> {<StartDate millis={data("t.startDate")}/>} </td>
          <td> <input type="text" onkeyup="synch()" value={data("t.days")}/> </td>
          <td> {<EndDate millis={data("t.startDate")} days={data("t.days")}/>} </td>
        </tr>
        )}
      </tbody>
    </table>
  )

}
//style={{position:"absolute"}}