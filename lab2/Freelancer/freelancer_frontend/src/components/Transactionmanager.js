import React, { Component } from 'react';
import Navbar from './Navbar';
import Usernavbar from './UserNavbar';
import axios from 'axios';
import uuid from 'uuid';
import Pagination from './Pagination';

class Transactionmanager extends Component {

    constructor() {
        super();
        this.state = {
            username: '',
            userbalance: '',
            transactions: [],
            amount:'',
            transactionid: '',
            pageOfItems: []
        };

        this.handleAddMoney = this.handleAddMoney.bind(this);
        this.handleWithdrawMoney = this.handleWithdrawMoney.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
    }

    componentWillMount() {
        axios.get('http://localhost:3001/checksession', { withCredentials: true })
            .then( (response) => {
                console.log("In transactionmanager component will mount...", response.data.session.username);
                if(response.data.session === "ERROR") {
                    this.props.history.push('/login');
                } else {
                    this.setState({
                        username: response.data.session.username
                    },()=> {
                        var user = {
                            user: this.state.username
                        }
                        axios.post('http://localhost:3001/getuseraccountbalance', user, {withCredentials: true})
                            .then((response) => {
                                console.log('In getuseraccountbalance in makepayment axios: ', response.data);
                                this.setState({
                                    userbalance: response.data[0].balance
                                }, () => {
                                    console.log("User balance", this.state.userbalance);
                                    axios.post('http://localhost:3001/gettransactionhistory', user, {withCredentials: true})
                                        .then((response) => {
                                            console.log('Getting all transaction history...', response.data);
                                            if(response.data === 'No transaction history for this user') {
                                                this.setState({
                                                    transactions: []
                                                })
                                            } else {
                                                this.setState({
                                                    transactions: response.data
                                                })
                                            }

                                        })
                                })
                            })
                    })
                }
            })
    }

    onChangePage(pageOfItems) {
        // update state with new page of items
        this.setState({ pageOfItems: pageOfItems});
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleAddMoney(e) {
        e.preventDefault();
        console.log("In handleAddMoney...", this.state.amount);
        var user = {
            username: this.state.username,
            transactedamount: this.state.amount,
            amount: Number(this.state.amount) + this.state.userbalance,
            transactionid: uuid.v4(),
            transactiontype: 'credit',
            projectname: 'Money Added'
        }
        axios.post("http://localhost:3001/updateuserbalance", user, {withCredentials: true})
            .then((response) => {
                console.log(response);
                alert("Amount credited Successfully...");
                window.location.reload(true);
            })


    }

    handleWithdrawMoney(e) {
        e.preventDefault();
        console.log("In handleWithdrawMoney...", this.state.amount);
        var user = {
            username: this.state.username,
            transactedamount: this.state.amount,
            amount: this.state.userbalance - Number(this.state.amount),
            transactionid: uuid.v4(),
            transactiontype: 'debit',
            projectname: 'Money Withdrawn'
        }
        axios.post("http://localhost:3001/updateuserbalance", user, {withCredentials: true})
            .then((response) => {
                console.log(response);
                alert("Amount debited Successfully...");
                window.location.reload(true);
            })
    }


    render() {

        let transactionstoshow = [];

        if(this.state.transactions === []) {
            transactionstoshow = [];
        } else {
            transactionstoshow = this.state.pageOfItems.map(t => {
                var finalDate = '';
                if(t.date !== '' || t.date !== null)
                    finalDate = t.date.slice(0,10);
                return (
                    <tr key={t.transactionid}>
                        <td>
                            <p> { t.transactionid } </p>
                        </td>
                        <td>
                            <p> { t.projectname } </p>
                        </td>
                        <td>
                            <p>{ finalDate }</p>
                        </td>
                        <td>
                            <p> { t.transactiontype } </p>
                        </td>
                        <td>
                            <p> { t.amount } </p>
                        </td>

                    </tr>
                );

            });
        }

        return(
            <div className="Transactionmanager">
                    <Navbar/>
                    <Usernavbar/>
                    <div id="divTransactionManager">
                        <h1>Transaction Manager</h1>
                        <hr/>

                            <div className='form-group'>
                                <label htmlFor='txtbalance'><h4>Balance</h4></label>
                                <input type='text' id='txtbalance' name='balance' className="form-control col-lg-3" value={this.state.userbalance} disabled />
                            </div>
                            <div className='form-group'>
                                <div className="btn-group" role="group" aria-label="Third group">
                                    <button type="button" className="btn btn-secondary mr-4" data-toggle="modal" data-target="#addModal">Add Money</button>
                                </div>
                                <div className="modal fade" id="addModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalLabel">Adding Money</h5>
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                <form onSubmit={this.handleAddMoney}>
                                                    <div className='form-group'>
                                                        <label htmlFor="txtamount">Amount:</label>
                                                        <input type='text' onChange={this.handleChange} className='form-control col-lg-2' id='txtamount' name='amount' required/>
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="nameOnCard">Name on Card</label>
                                                        <input type="text" className="form-control" id="nameOnCard"  />
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="crediCardNum">Credit Card Number</label>
                                                        <input type="text" className="form-control" id="crediCardNum" />
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="cvv">CVV:</label>
                                                        <input type="text" className="form-control col-sm-1" id="cvv" />
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="expiryMonth">Expiry Month:</label>
                                                        <select className="form-control col-lg-2" id="expiryMonth">
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
                                                        <label htmlFor="expiryYear">Expiry Year:</label>

                                                        <select className="form-control col-lg-2" id="expiryYear">
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
                                                    <div className='form-group'>
                                                        <input type='submit' value='Proceed' className='form-control btn btn-secondary' id='btnSubmitAmount' name='SubmitAmount'/>
                                                    </div>

                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="btn-group" role="group" aria-label="Third group">
                                    <button type="button" className="btn btn-secondary mr-4" data-toggle="modal" data-target="#withdrawModal" >Withdraw Money</button>
                                </div>
                                <div className="modal fade" id="withdrawModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalLabel">Withdraw Money</h5>
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                <form onSubmit={this.handleWithdrawMoney}>
                                                    <div className='form-group'>
                                                        <label htmlFor="txtamount">Amount:</label>
                                                        <input type='text' onChange={this.handleChange} className='form-control col-lg-2' id='txtamount' name='amount' required/>
                                                    </div>

                                                    <div className='form-group'>
                                                        <input type='submit' value='Proceed' className='form-control btn btn-secondary' id='btnSubmitAmount' name='SubmitAmount'/>
                                                    </div>

                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                    </div>

                <div id="divTransactionsTable">

                    <table className='table table-hover'>
                        <thead>
                        <tr className='table-secondary'>
                            <th id='transactionid'>Transaction Id</th>
                            <th id='projectname'>Transacted For</th>
                            <th id='dateoftransaction'>Date</th>
                            <th id='transactiontype'>Transaction Type</th>
                            <th id='amount'>Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        { transactionstoshow }
                        </tbody>

                    </table>


                </div>
                <Pagination items={this.state.transactions} onChangePage={this.onChangePage} />


            </div>
        );
    }
}

export default Transactionmanager;
