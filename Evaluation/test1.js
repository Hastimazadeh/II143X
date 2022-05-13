function Test1 (props){
  
    React.useEffect(() => {
      setInterval(() => {
      }, 1000);
    }, []);
    return (
      <React.Fragment>
        <div>{
            from("ProductionLine line").map(representLine)
        }</div>
        <Park/>
        <Table/>
      </React.Fragment>
    );
  }
//THSI IS DONE BY THEM IN STEP 9:
/// DnD in step 11
function representLine(data){
    return <div key={data("line")} style={{overflow:"hidden"}} >
             <span  class="lineLabel">{data("line.name")}</span>
             <div class="line" onDragOver={e=> e.preventDefault()}  onDrop={drop()}>
               {from("Task t").where("t.line=line").map(Task)}
             </div>
           </div>;
}
  //THSI IS GIVEN IN STEP 9:
  /// DnD in step 11
  function Park(props) {
    return <div style={{overflow:"hidden"}}>
             <span class="lineLabel">Park</span>
             <div class="line" onDragOver={e=> e.preventDefault()} onDrop={drop()}>
               {from("Task t").where("t.line=nil").map(TaskPark)} 
             </div>
           </div>;
}
//THSI IS GIVEN IN STEP 9:
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
//THSI IS GIVEN IN STEP 9:
/// DnD in step 11
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
        <table>
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Line</th>
                        <th>Start Date</th>
                        <th>Days</th>
                        <th>End Date</th>
                      </tr>
                    </thead> 
              
                    <tbody >{from("Task t").orderBy("t.customer").map(data=>
                        <tr key={data("t")}>
                        <td> <input type="text" style={{font:"inherit"}} size="10" value={data("t.customer")} onInput={sync()}/></td>
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
 /*  THIS IS FOR STEP 7:  
                 <table>
                    <thead>
                      <tr>
                        <th>Customer</th>
                      </tr>
                    </thead> 
              
                    <tbody >{from("Task t").orderBy("t.customer").map(data=>
                        <tr key={data("t")}>
                        <td> {data("t.customer")}</td>
                      </tr>
                      )}
                    </tbody>
                  </table>
 */

/*  THIS IS FOR STEP 7:  
                  <table>
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Line</th>
                        <th>Start Date</th>
                        <th>Days</th>
                        <th>End Date</th>
                      </tr>
                    </thead> 
              
                    <tbody >{from("Task t").orderBy("t.customer").map(data=>
                        <tr key={data("t")}>
                        <td> {data("t.customer")}</td>
                        <td> {data("t.line.name")} </td>
                        <td>{ dateToString(data("t.startDate"))} </td>
                        <td> {data("t.days")}</td>
                        <td>{ dateToString(data("dateAdd(t.startDate, t.days, 'day')"))} </td>
                      </tr>
                      )}
                    </tbody>
                  </table>
 */