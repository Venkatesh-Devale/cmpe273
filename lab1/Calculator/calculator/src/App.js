import React, { Component } from 'react';
//import * as API from './api/API';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state= {
      op1: 0,
      op2: 0,
      op:'',
      result:''
    }
  }

  setResult(answer) {
    this.setState({
      result: answer
    });
  }

  handleChange(e) {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value
    });
  }

  handleClick(temp) {
    let fetchString = '/users/operations';
    console.log(temp);
    //const operator = e.target.value;
    this.setState({
      op: temp
    },()=>{
      console.log(this.state.op1+" "+this.state.op+" "+this.state.op2);
    
    fetch(fetchString, {
      method: 'POST',
      body: JSON.stringify({
        op1: this.state.op1,
        op2: this.state.op2,
        op: this.state.op
      }),
      headers: {Accept: 'application/json',
      'Content-Type': 'application/json',}
    }).then((response) => response.json())
    .then((responsejson) => {
      console.log(responsejson);
        this.setResult(responsejson);
    })
    .catch((error) => {
        console.log(error)
        this.setResult('Error')
    });
    });
    
  }

  render() {
    return (
      <div className="App">
        <h1>Calculator</h1>
        <div className="container">
        <form>
        <div className = "form-group">
            <label>Operand 1:</label>
            <input type="text" className="form-control" name="op1" value={this.state.op1} onChange={this.handleChange.bind(this)}/>
          </div>
          <div className = "form-group">
            <label>Operand 2:</label>
            <input type="text" className="form-control" name="op2" value={this.state.op2} onChange={this.handleChange.bind(this)}/>
          </div>
          <div className="btn-group">
            <button type="button" className="btn btn-primary mr-4" onClick={()=>this.handleClick( "+")}> + </button>
            <button type="button" className="btn btn-primary mr-4" onClick={this.handleClick.bind(this, "-")}> - </button>
            <button type="button" className="btn btn-primary mr-4" onClick={this.handleClick.bind(this, "*")}> * </button>
            <button type="button" className="btn btn-primary mr-4" onClick={this.handleClick.bind(this, "/")}> / </button>
          </div> 
          <br />
          <br />
          <div className = "form-group">
            <label>Result:</label>
            <input type="text" className="form-control" name="result" value={this.state.result} onChange={this.handleChange.bind(this)}/>
          </div>
        </form>
          
        </div>
        
      </div>
    );
  }
}

export default App;
