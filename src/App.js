import React, { Component } from 'react';

import { Jumbotron, Button, Form, Input } from 'reactstrap';

import './App.css';

import Chart from "react-google-charts";


const Data = class {
  constructor(text, value) {
    this.text = text;
    this.value = value;
  }
}

class App extends Component {
  state={
    width: 1000,
    data: [
      ["Date", "Value"],
      ["2018-12-03", 50]
    ],
    defaultDate: new Date().toISOString().substring(0, 10)
  }

  objectToArray = (obj) => {
    let arr = [];
    Object.keys(obj).map((key) => {
      arr.push(obj[key])
      return '';
    })
    return arr;
  }
  componentDidMount= () => {
    window.onresize = () => {
     this.setState({width: this.refs.root.offsetWidth}); 
    };
    if(sessionStorage.getItem('data')){
      this.setState({data: JSON.parse(sessionStorage.getItem('data'))})
    }
    else{
      this.setState(prevState => ({data: [...prevState.data, this.objectToArray(new Data(this.state.defaultDate, 25))]}))
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if(prevState.data !== this.state.data ){
      sessionStorage.setItem('data', JSON.stringify(this.state.data))
      if(this.state.data.length > 1){
        let currentDate = new Date(this.state.data[this.state.data.length-1][0])
        this.setState({defaultDate: new Date(currentDate.setDate(currentDate.getDate() + 1)).toISOString().substring(0, 10)})
      }
      else{
        this.setState({defaultDate: new Date().toISOString().substring(0, 10)})
      }
    }
  }

  setValue= (e, index, key) => {
    let newData = this.state.data;
    if(key===0){
      newData[index][key] = e.target.value
    }
    else if(key===1){
      newData[index][key] = Number.parseInt(e.target.value)
    }
    
    this.setState(() => ({ data : newData}), () => {
      sessionStorage.setItem('data', JSON.stringify(this.state.data))
    })
  }

  onSubmit = (e) => {
    e.preventDefault();
    let newData = new Data(e.target.elements.date.value, Number.parseInt(e.target.elements.value.value));
    this.setState((prevState) => ({data: [...prevState.data, this.objectToArray(newData)]}))
  }

  setDefaultDate = (e)  => {
    this.setState({defaultDate: e.target.value})
  }

  deleteRow = (e ,key) => {
    this.setState({data: this.state.data.filter((obj, index) => index !== key)})
  }

  render() {
    return (
      <div>
        <div className="header"></div>
        <Jumbotron>
          <div ref='root'>
            <div style={{width: '100%'}}> 
              <Chart
                chartType="ColumnChart"
                width="100%"
                height="400px"
                data={this.state.data}
                options={{
                  title: "Statistic Bar Chart"
                }}
              />
            </div>
          </div>
          <div className="container pt-5">
          <table>
            <tbody>
              {
                this.state.data ? this.state.data.map((obj, key) => {
                  if(key !== 0){
                    return (
                      <tr key={key}>
                        <td>
                          <Input type="date" name="text" value={this.state.data[key][0]} onChange={(e) => this.setValue(e, key, 0)}></Input>
                        </td>
                        <td>
                          <Input type="number" name="value" value={this.state.data[key][1]} onChange={(e) => this.setValue(e, key, 1)}></Input>
                        </td>
                        <td>
                          <Button color="danger" onClick={(e) => this.deleteRow(e, key)} className="del-btn">Delete</Button>
                        </td> 
                      </tr>
                    )
                  }
                  else {
                    return <tr key={key}><th>Date</th><th>Value</th><th></th></tr>
                  }
                }) : ''
              }
            </tbody>
          </table>
            <Form onSubmit={this.onSubmit}>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <Input type="date" name="date" value={this.state.defaultDate}  onChange={this.setDefaultDate}></Input>
                    </td>
                    <td>
                      <Input type="number" name="value" defaultValue="2"></Input>
                    </td>
                    <td>
                      <Button color="info" type="submit" className="add-btn">Insert</Button>
                    </td>  
                  </tr>
                </tbody>
              </table>
            </Form>
          </div>
        </Jumbotron>
      </div>
    );
  }
}

export default App;
