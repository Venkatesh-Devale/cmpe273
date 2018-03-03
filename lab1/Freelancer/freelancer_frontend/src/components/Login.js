import React, {Component} from 'react';
import '../css/style.css';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            username:"",
            password:"",
            error:""
        }
    }

    handleChange = (events) => {
        
            this.setState({
                [events.target.name]: events.target.value
            })
            
            
    }

    handleLogin = (e) => {
        e.preventDefault();
        console.log("In Login page.." + this.state.username + " " + this.state.password);
        const userDetails = {
            username : this.state.username,
            password : this.state.password
        }
        console.log(userDetails);
        this.props.loginUser(userDetails);
    }
   
    render() {
        let redirect = null;
        if(this.props.loginData !== null) {
            redirect = <Redirect to="/userhome" />
        }
        
        return(
            <div className="Login"> 
            {redirect}
            <div id="mainDiv">
            <div className="center">
                    <div>
                         <h1> Login  </h1>
                    </div>
                    <div id="divLoginForm">
                        <form onSubmit={this.handleLogin.bind(this)}>
                            <div className="form-group">
                                <input type="text" value={this.state.username} onChange={this.handleChange} className="form-control" id="txtUserName" placeholder="Email or Username" ref="uname" name="username" />
                            </div>
                            <div className="form-group">
                                <input type="password" value={this.state.password} onChange={this.handleChange} className="form-control" id="txtPassword" placeholder="Enter Password" ref="pass" name="password" />
                            </div>
                            <div className="form-group">
                                <input type="submit" className="form-control btn btn-primary" id="btnSubmitSignUpForm" value="Login" />
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
        loginData: state.login_data
    }
}

function mapDispatchToProps(dispatch) {
    return {
     loginUser: (userDetails) => {
         console.log("In Login dispatch",userDetails);
         axios.post('http://localhost:3001/login', userDetails)
             .then((response) => {
                 console.log(response.data[0]);
             if(response.data === 'ERROR')
                dispatch({type: 'ERROR',payload : response})
             else
               dispatch({type: 'LOGIN_SUCCESS',payload : response})
         });
     }
    }
 }

 export default connect(mapStateToProps, mapDispatchToProps)(Login);