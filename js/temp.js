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
      <dl>{
        from("ProductionLine line").map(representLine)
      }</dl>
      <Park />
      <Table/>
    </React.Fragment>
  )
}

function representLine(data){
  return <div style={{overflow:"hidden"}} >
    <dt  class="lineLabel">{data("line.name")}</dt>
    <dd><ul class="line" >{from("Task t").where("t.line=line").map(Task)}
    </ul></dd>
  </div>
}

function Park (props) {
  return(
    <dl style={{overflow:"hidden"}}>
      <dt class="lineLabel">Park:</dt>
      <dd><ul class="line">{from("Task t").where("t.line=nil").map(Task)}
      </ul></dd>
    </dl>
  )
}

function Task(data){
  return <li class="task" >
    {data("t.customer")} : {data("t.days")}
  </li>
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
          <td> {data("t.customer")} </td>
          <td> {data("t.line.name")} </td>
          <td> {<StartDate millis={data("t.startDate")}/>} </td>
          <td> {data("t.days")} </td>
          <td> {<EndDate millis={data("t.startDate")} days={data("t.days")}/>} </td>
        </tr>
        )}
      </tbody>
    </table>
  )

}
//style={{position:"absolute"}}