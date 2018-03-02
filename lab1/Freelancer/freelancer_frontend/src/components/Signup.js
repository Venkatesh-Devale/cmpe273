import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import axios from 'axios';

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
    
    createUser = (events) => {
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
        let authRedirect = null;
        if (this.props.signupSuccess === 'SIGNUP_SUCCESS') {
            authRedirect = <Redirect to='/userhome'/>
        }
        return(
            
            <div className="Signup">
            {authRedirect}
            <div id="mainDiv">
            <div className="center">
                    <div>
                        <h1> Freelancer logo here </h1>
                        <h3> SignUp for free today </h3>
                        <hr />
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



function mapStateToProps(state) {
    return {
        username: state.username,
        password: state.password,
        emailid: state.emailid,
        radioHireOrEmployer: state.radioHireOrEmployer,
        signupSuccess: state.signup_success
    }
}

function mapDispatchToProps(dispatch) {
   return {
    insertUser: (newUser) => {
        console.log(newUser);
        axios.post('http://localhost:3001/signup', newUser)
            .then((response) => {
            console.log(response);
            dispatch({type: 'SIGNUP_SUCCESS',payload : response})
        });
    }
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);