import React, { Component } from 'react';
import Navbar from './Navbar';
import axios from 'axios';

class Makepayment extends Component {

    constructor() {
        super();
        this.state = {
            projectid: '',
            employer: '',
            worker: '',
            bidamount: '',
            bidperiod: '',
            workerbalance: '',
            employerbalance: ''
        };

        this.handlePaymentSubmission = this.handlePaymentSubmission.bind(this);
        this.setProjectId = this.setProjectId.bind(this);
    }

    setProjectId() {
        const project = {
            projectid: this.props.match.params.value
        }
        axios.post('http://localhost:3001/getspecificbidforproject', project, {withCredentials: true})
            .then((response) => {
                console.log('In getspecificbidforproject in makepayment axios: ', response.data);
                this.setState({
                    projectid: response.data[0].projectid,
                    employer: response.data[0].employer,
                    worker: response.data[0].worker,
                    bidamount: response.data[0].bidamount,
                    bidperiod: response.data[0].bidperiod
                }, () => {
                    //getting worker balance
                    var user = {
                        user: this.state.worker
                    }
                    axios.post('http://localhost:3001/getuseraccountbalance', user, {withCredentials: true})
                        .then((response) => {
                            console.log('In getworkeraccountbalance in makepayment axios: ', response.data);
                            this.setState({
                                workerbalance: response.data[0].balance
                            }, () => {
                                console.log("Worker balance", this.state.workerbalance);
                            })
                        })
                    //getting employer balance
                     user = {
                        user: this.state.employer
                    }
                    axios.post('http://localhost:3001/getuseraccountbalance', user, {withCredentials: true})
                        .then((response) => {
                            console.log('In getemployeraccountbalance in makepayment axios: ', response.data);
                            this.setState({
                                employerbalance: response.data[0].balance
                            }, () => {
                                console.log("Employer balance", this.state.employerbalance);
                            })
                        })
                })
            })




        // console.log("In setProjectId Makepayment project id is:", this.props.match.params.value)
        // this.setState({
        //     projectid: this.props.match.params.value
        // }, () => {
        //     console.log("In component will mount Makepayment project id is:", this.state.projectid);

        //
        // })
    }

    componentWillMount() {
        this.setProjectId();
    }

    handlePaymentSubmission(e) {
        e.preventDefault();
        console.log("In payment submission...");
    }



    render() {


        return(

            <div className="Makepayment">
                <Navbar />
                <div id="divPaymentForm" >
                    <h1>Make Payment</h1>
                    <hr/>
                    <form onSubmit={ this.handlePaymentSubmission }>

                        <div className="form-group">
                            <label for="nameOnCard">Name on Card</label>
                            <input type="text" className="form-control col-lg-5" id="nameOnCard" required />
                        </div>

                        <div className="form-group">
                            <label for="crediCardNum">Credit Card Number</label>
                            <input type="text" className="form-control col-lg-5" id="crediCardNum" required/>
                        </div>

                        <div className="form-group">
                            <label for="cvv">CVV:</label>
                            <input type="text" className="form-control col-sm-1" id="cvv" required/>
                        </div>

                        <div className="form-group">
                            <label for="expiryMonth">Expiry Month:</label>
                            <select className="form-control col-sm-1" id="expiryMonth">
                                <option>01</option>
                                <option>02</option>
                                <option>03</option>
                                <option>04</option>
                                <option>05</option>
                                <option>06</option>
                                <option>07</option>
                                <option>08</option>
                                <option>09</option>
                                <option>10</option>
                                <option>11</option>
                                <option>12</option>
                            </select>

                        </div>

                        <div className="form-group">
                            <label for="expiryYear">Expiry Year:</label>

                            <select className="form-control col-sm-1" id="expiryYear">
                                <option>2019</option>
                                <option>2020</option>
                                <option>2021</option>
                                <option>2022</option>
                                <option>2023</option>
                                <option>2024</option>
                                <option>2025</option>
                                <option>2026</option>
                                <option>2027</option>
                                <option>2028</option>
                                <option>2029</option>
                                <option>2030</option>

                            </select>
                        </div>

                        <div className="form-group">
                            <label for="bidamount">Amount to Pay:</label>
                            <input type="text" className="form-control col-sm-1" id="bidamount" disabled value={this.state.bidamount}/>
                        </div>

                        <button type="submit" className="btn btn-primary col-lg-5">Pay</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Makepayment;