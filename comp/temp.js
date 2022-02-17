
//import React  from 'react'; 


class Temp extends React.Component {

    constructor() {
      super()
      this.state = {name:''};
      this.change;
    }

change(){
    this.setState({ name: new from("ProductionLine line")})
}

//    this.setState({ name: from("ProductionLine line").map((nam)=>(nam("line.name")))})



    render() {
      return (
        <div>

          { this.state.name.change().map((nam)=>(nam("line.name")))}    

        </div>
      )
    }




  }
  

  /*
  constructor() {
      super()
      this.state = {
        name: data("line.name"),
        tasks: [],
        cust: null,
        days: null
        
      }
    }

  */ 


    /**
     * 
     *  {
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


     */