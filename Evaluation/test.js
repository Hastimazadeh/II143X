function Test (props){
  
    React.useEffect(() => {
      setInterval(() => {
      }, 1000);
    }, []);
    return (
      <React.Fragment>
         

           <div >
               {from("ProductionLine l").map(d=>
                <div style={{overflow:"hidden"}}>
                    <span class="lineLabel"> {d("l.name")} </span>
                    <div class="line" onDragOver={e=>e.preventDefault()} onDrop={drop()}>
                    {from("Task t").where("t.line=l").map(d=>
                        <div class="task" darggable="true"
                        onDragStart={drag("t")}
                        style={{
                            width: d("t.days")+"px",
                            left: d("datediff(t.startDate, '2021-01-01')")+"px",
                            position:"absolute"
                        }}>
                            {d("t.customer")}
                        </div>
                    )}
                    </div>
                </div>
                )}        
          </div>
          
          <div style={{overflow:"hidden"}}>
              <span class="lineLabel"> Park </span>
              <div class="line" onDragOver={e=>e.preventDefault()}  onDrop={drop()}>
                  {from("Task t").where("t.line=nil").map(d=>
                    <div class="task" style={{width:d("t.days")+"px"}}
                    darggable="true" onDragStart={drag("t")}
                    >
                        {d("t.customer")}
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
              <tbody> {from("Task t").orderBy("t.customer").map(d=>
                  <tr> 
                      <td> <input type="text" size="10" value={d("t.customer")} onInput={sync()}/></td>
                      <td> {d("t.line.name")} </td>
                      <td> {dateToString(d("t.startDate"))} </td>
                      <td> <input type="text" size="10" value={d("t.days")} onInput={sync()}/> </td>
                      <td> {dateToString(d("dateAdd(t.startDate, t.days, 'day')"))} </td>
                  </tr>
                  
              )}</tbody>
          </table>
        
      </React.Fragment>
    );
  }

  function dateToString(millis){
    return millis? new Date(millis).toString().slice(0,15):"";
}
