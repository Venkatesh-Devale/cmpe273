import React, {Component} from 'react';
import { connect } from 'react-redux';
import '../css/style.css';


class Signup extends Component {
    constructor() {
        super();
        this.state = {
            username:"",
            password:"",
            emailid:"",
            radioHireOrEmployer:""
        }
    }

    handleChange = (events) => {
        
            this.setState({
                [events.target.name]: events.target.value
            })
            
            
    }

    createUser(events) {
        events.preventDefault();
        console.log(this.state.username + " " + this.state.password);
        const userDetails = {
            username: this.state.username,
            password: this.state.password,
            emailid: this.state.emailid,
            radioHireOrEmployer: this.state.radioHireOrEmployer
        }
        this.props.insertUser(userDetails);
    }

    render() {
        return(
            <div className="Signup"> 
            <div id="mainDiv">
            <div className="center">
                    <div>
                         <h1> Register </h1>
                    </div>
                    <div id="divSignupForm">
                        <form onSubmit={this.createUser.bind(this)}>
                            <div className="form-group">
                                <input type="email" ref="emailid"  onChange={this.handleChange} className="form-control" id="txtEmailId" placeholder="Enter Email" name="emailid" />
                            </div>
                            <div className="form-group">
                                <input type="text" ref="username" onChange={this.handleChange} className="form-control" id="txtUserName" placeholder="Enter Username" name="username" />
                            </div>
                            <div className="form-group">
                                <input type="password" ref="password" onChange={this.handleChange} className="form-control" id="txtPassword" placeholder="Enter Password" name="password" />
                            </div>
                            <div className="form-group">
                                <div className="btn-group btn-group-justified">
                                    <div class="btn-group">
                                        <button type="button" className="btn btn-default form-control"><label><input type="radio" onClick={this.handleChange} name="radioHireOrEmployer" value="employer"/>   Hire</label></button>
                                    </div>
                                    <div class="btn-group">
                                        <button type="button" className="btn btn-default form-control"><label><input type="radio" onClick={this.handleChange} name="radioHireOrEmployer" value="worker"/>     Work</label></button>
                                    </div>
                                </div>
                                
                            </div>
                            <div className="form-group">
                                <input type="submit" className="form-control btn btn-primary" id="btnSubmitSignUpForm" value="Create Account" />
                            </div>
                            
                        </form>
                    </div>
                </div>
            </div>
       
            </div>
        );
    }
}



function matchDispatchToProps(dispatch) {
    return {

        insertUser: (user) => {
            console.log(user.username);
            fetch('http://localhost:3001/signup/',{
                method: 'POST',
                body: JSON.stringify(user),
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                dispatch({
                    type: 'SUCCESS',
                    payload: result
                })
            })
        }
    }
    
}

export default connect(null, matchDispatchToProps)(Signup);