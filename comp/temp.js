
import React, { Component }  from 'react'; 

//import {hitDatabase} from './js/mak-from';

class Temp extends Component {

    constructor() {
      super()
      this.state = {
        name: null,
        tasks: [],
        cust: null,
        days: null
      }
    }







    render() {
      return (
        <div>




           {
                        from("ProductionLine line").map(
                            data =>
                                <span>
                                <dt>{data("line.name")}</dt>
                                <dd><ul>{from("Task t").where("t.line=line").map(
                        data =>
                            <li>
                            {data("t.customer")}:{data("t.days")}
                            </li>
                        )}
                    </ul>
                    </dd>
                    </span>
                )
                }





        </div>
      )
    }




  }
  
  export default Temp;