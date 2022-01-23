import React from "react";

// Stateful Component : State (numbers, column)
// React: State -> setState (programmatically) -- automatically updates --> View (render)
//                 View (<input type="text"></input>) -> ✘ automatically updates -> this.state.column
// Two-way Binding: through coding?, it is not automatic!
/*
 {
     this.state.numbers.map( nums =>
         <tr>{
            nums.map( number =>
                <td key={number}>{number}</td>
            )
         }</tr>
     )
  }
 */
// class -> stateful component -> Tag: Lottery
class Lottery extends React.PureComponent { // shallow comparison
    constructor(props,context) {
        super(props,context);
        this.state = {
            numbers: [], // reference
            column: 5,
            circle: { // reference
                x: 0,
                y: 10,
                radius: 100,
                color: { value: "red", width: 10}
            }
        }
        // this.get_lottery_numbers = this.get_lottery_numbers.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextState.numbers !== this.state.numbers;
    }

    exercise(){
        let newCircle = {...this.state.circle}; //clone
        newCircle.x = 100;
        this.setState({
            "circle": newCircle // new reference
        })
        this.setState({
            column: 100
        })
    }
    draw = () => {
        let new_numbers= [...this.state.numbers] // cloning the array
        for (let i=0;i<this.state.column;++i){
            let lottery_numbers = this.get_lottery_numbers() ;
            new_numbers.push(lottery_numbers)
        }
        this.setState({ // async!
            numbers: new_numbers
        },() => {
            console.log("callback: "+this.state.numbers)
        })
        console.log("after setState: "+this.state.numbers)
    }

    reset = () => {
        this.setState({ // asynchronous function
            numbers: []
        }, () => {
            console.log("callback: "+this.state.numbers)
        })

    }

    get_lottery_numbers = () => {
        let numbers = []
        while(numbers.length < 6){
            let number = Math.floor(Math.random()*60)+1
            if(!numbers.includes(number))
                numbers.push(number)
        }
        numbers.sort((x,y) => x-y)
        return numbers
    }

    removeRow = async (rowIndex) => {
        let newNumbers = [...this.state.numbers].filter((nums,index) => index!==rowIndex)
        this.setState({
            numbers: newNumbers
        })
    }

    handleInput = async (event) => {
        this.setState({
            column: Number(event.target.value)
        })
    }

    render = () => { // reactjs -> functional programming
        let numbersCard = "";
        if(this.state.numbers.length > 0) {
            numbersCard =  <div className="card">
                        <div className="card-header">
                            <div className="card-title"><h3>Lottery Numbers: {this.state.numbers.length}</h3></div>
                        </div>
                        <div className="card-body">
                            <table className="table table-responsive table-striped table-hover table-bordered">
                                <thead>
                                <tr>
                                    {
                                        Array.from(Array(6).keys()).map( i =>
                                            <th key={i}>Column #{i+1}</th>
                                        )
                                    }
                                    <th>Operations</th>
                                </tr>
                                </thead>
                                <tbody>{
                                    this.state.numbers.map( (nums,index) =>
                                        <tr>{
                                            nums.map( (number,idx) =>
                                                <td key={number}>{number}</td>
                                            )
                                        }
                                        <td>
                                            <button onClick={ () => this.removeRow(index)}
                                                    className="btn btn-danger">Remove</button>
                                        </td>
                                        </tr>
                                    )
                                }</tbody>
                            </table>
                        </div>
                    </div>;
                }

       return ( // View
          <div className="container">
              <div className="card">
                  <div className="card-header">
                      <div className="card-title"><h3>Lottery Application</h3></div>
                  </div>
                  <div className="card-body">
                       <div className="form-group">
                           <label htmlFor="column">Column:</label>
                           <input type="text"
                                  id="column"
                                  name="column"
                                  value={this.state.column}
                                  onChange={this.handleInput}
                                  className="form-control"></input>
                       </div>
                       <div className="form-group">
                           <button onClick={this.draw}
                               className="btn btn-success">Draw</button>
                           <button onClick={this.reset}
                                   className="btn btn-warning">Reset</button>
                       </div>
                  </div>
              </div>
              <p></p>
              {numbersCard}
          </div>
       ) ;
    }
}

export default Lottery;