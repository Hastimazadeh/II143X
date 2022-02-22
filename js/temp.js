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
      <Park/>
      <Table/>
    </React.Fragment>
  )


}

function representLine(data){
  return <span>
    <dt class="lineLabel">{data("line.name")}</dt>
    <dd><ul class="line" >{from("Task t").where("t.line=line").map(Task)}
    </ul></dd>
  </span>
}

function Park (props) {
  return(
    <dl>
      <dt class="lineLabel">Park:</dt>
      <dd><ul class="line">{from("Task t").where("t.line=nil").map(Task)}
      </ul></dd>
    </dl>
  )
}

function Task(data){
  return <li class="task">
    {data("t.customer")} : {data("t.days")}
  </li>
}
  
function Table(props){
  return(
    <table class="table">
      <thead>
        <tr>
          <th>customer</th>
          <th>line</th>
          <th>start date</th>
          <th>days</th>
          <th>end date</th>
        </tr>
      </thead> 

      <tbody > {from("Task t").orderBy("t.startDate").map(data=>
        <tr>  
          <td> {data("t.customer")} </td>
          <td> </td>
        </tr>
        )}
      </tbody>
    </table>
  )

}
  