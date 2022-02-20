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
      <dl  >{
        from("ProductionLine line").map(
          data => 
            <span>
                <dt class="lineLabel">{data("line.name")}</dt>
                <dd><ul class="line" >{from("Task t").where("t.line=line").map(
                    data =>
                      <Task customer={data("t.customer")} days={data("t.days")}/>
                  )}
                </ul></dd>
            </span>
        )
      }</dl>
      <Park/>
    </React.Fragment>
  )


}


function Park (props) {
  return(
    <dl>
      <dt class="lineLabel">Park:</dt>
      <dd><ul class="line">{from("Task t").where("t.line=nil").map(
          data =>
            <Task customer={data("t.customer")} days={data("t.days")}/>
        )}
      </ul></dd>
    </dl>
  )
}

function Task(props){
  return <li class="task">
    {props.customer}:{props.days}
  </li>
}
  
function Table(props){
}
  