function Eva(props) {

    React.useEffect(() => {
        setInterval(() => {
        }, 1000);
    }, []);
    return (
        <React.Fragment>

            <div>
                {from("ProductionLine p").map(data =>
                    <div style={{ overflow: "hidden" }}>
                        <span class="lineLabel"> {data("p.name")} </span>
                        <div class="Line" onDragOver={e=>e.preventDefault()} onDrop={drop()}>
                            {from("Task t").where("t.line=p").map(data =>
                                <div draggable="true" onDragStart={drag("t")} class="task" style={{ left: data("datediff(t.startDate, '2021-01-01')") + 'px', width: data("t.days") + "px" , position:"absolute"}}>
                                    {data("t.customer")}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div style={{ overflow: "hidden" }}>
                <span class="lineLabel"> Park </span>
                <div class="Line" onDragOver={e=>e.preventDefault()} onDrop={drop()}>
                    {from("Task t").where("t.line=nil").map(data =>
                        <div draggable="true" onDragStart={drag("t")} class="task" style={{ width: data("t.days") + "px" }}>
                            {data("t.customer")}
                        </div>
                    )}
                </div>
            </div>




            <table>
                <thead>
                    <tr>
                        <th> Customer </th>
                        <th> Line </th>
                        <th> Start Date </th>
                        <th> Days </th>
                        <th> End Date </th>
                    </tr>
                </thead>

                <tbody> {from("Task t").orderBy("t.customer").map(data =>
                    <tr>
                        <td> <input type ="text" size='10' value= {data("t.customer")} onInput={sync()}/></td>
                        <td> {data("t.line.name")} </td>
                        <td> {dateToString(data("t.startDate"))} </td>
                        <td> <input type ="text" size = '10' value={data("t.days")} onChange={sync()}/></td>
                        <td> {dateToString(data("dateAdd(t.startDate, t.days, 'day')"))} </td>
                    </tr>
                )}
                </tbody>

            </table>

        </React.Fragment>
    );
}

function dateToString(millis) {
    return millis ? new Date(millis).toString().slice(0, 15) : "";
}















/**
   * Step 7: (for us)
   *  <table>
            <thead>
                <tr> <th>Customer</th> </tr>
            </thead> 
              
            <tbody >{from("Task t").orderBy("t.customer").map(data=>
                <tr key={data("t")}>
                    <td> {data("t.customer")}</td>
                </tr>
            )}</tbody>
        </table>
   */

/** Step 7: (for them)
 * <table>
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
          )}</tbody>
      </table>
 */

/**
 * step 9 (for us)
 * <div style={{overflow:"hidden"}}>
          <span class="lineLabel">Park</span>
              <div class="line">
                  {from("Task t").where("t.line=nil").map(data=>
                      <div key={data("t")} class="task" 
                          style={{ width: data("t.days") + "px" }}> 
                          {data("t.customer")} 
                      </div>)} 
              </div>
      </div>
 */

/**
 * step 9 (for them)
 * <div>{
            from("ProductionLine line").map(data=>
                <div key={data("line")} style={{overflow:"hidden"}} >
                    <span  class="lineLabel">{data("line.name")}</span>
                    <div class="line">
                    {from("Task t").where("t.line=line").map(data=>
                        <div key={data("t")} class="task"  
                                style={{left: data("datediff(t.startDate,'2021-01-01')")+"px",
                                    width: data("t.days") + "px", position: "absolute"}}>
                                {data("t.customer")} 
                        </div>
                    )}
                </div>
           </div>
            )
        }</div>
 */

/** step 10: (for them)
 * <tbody >{from("Task t").orderBy("t.customer").map(data=>
                <tr key={data("t")}>
                    <td> <input type="text" style={{font:"inherit"}} size="10" value={data("t.customer")} onInput={sync()}/></td>
                    <td> {data("t.line.name")} </td>
                    <td>{ dateToString(data("t.startDate"))} </td>
                    <td> <input type="text" style={{font:"inherit"}} size="5" value={data("t.days")} onInput={sync()}/> </td>
                    <td>{ dateToString(data("dateAdd(t.startDate, t.days, 'day')"))} </td>
                </tr>
            )}</tbody>
 */

/** step 11 (for us):
 * <div>{
            from("ProductionLine line").map(data=>
                <div key={data("line")} style={{overflow:"hidden"}} >
                    <span  class="lineLabel">{data("line.name")}</span>
                    <div class="line" onDragOver={e=> e.preventDefault()}  onDrop={drop()}>
                    {from("Task t").where("t.line=line").map(data=>
                        <div key={data("t")} class="task" draggable="true"
                                onDragStart={drag("t")} 
                                style={{left: data("datediff(t.startDate,'2021-01-01')")+"px",
                                    width: data("t.days") + "px", 
                                    position: "absolute"}}>
                                {data("t.customer")} 
                        </div>
                    )}
                </div>
           </div>
            )
        }</div>
 */

/**
 * step 11 (for them):
 * 
 * <div style={{overflow:"hidden"}}>
            <span class="lineLabel">Park</span>
                <div class="line" onDragOver={e=> e.preventDefault()} onDrop={drop()}>
                    {from("Task t").where("t.line=nil").map(data=>
                        <div key={data("t")} class="task" 
                            draggable="true" 
                            onDragStart={drag("t")}
                            style={{ width: data("t.days") + "px" }}> 
                            {data("t.customer")} 
                        </div>)} 
                </div>
        </div>
 */