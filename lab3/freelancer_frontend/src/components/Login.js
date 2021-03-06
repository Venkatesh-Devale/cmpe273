import React, {Component} from 'react';
import '../css/style.css';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import axios from 'axios';
import swal from 'sweetalert';

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

        axios.post('http://localhost:3001/user/login', userDetails, { withCredentials: true })
            .then((response) => {
                console.log("After login dispatch", response.data);
                if(response.data === "") {
                    swal('Error in logging in..check username or password.')
                }
                else {
                    localStorage.setItem('username', response.data[0].username);
                    swal("Login Successfull");
                    this.props.history.push('/userhome');
                }

            });
        
    }
   
    render() {

        return(
            <div className="Login"> 
            
            <div id="mainDiv">
            <div className="center">
                    <div>
                         <h1 id = 'h1LoginandSignup'> Login  </h1>
                    </div>
                    <div id="divLoginForm">
                        <form onSubmit={this.handleLogin.bind(this)}>
                            <div className="form-group">
                                <input type="text" value={this.state.username} onChange={this.handleChange} className="form-control" id="txtUserName" placeholder="Email or Username" ref="uname" name="username" required />
                            </div>
                            <div className="form-group">
                                <input type="password" value={this.state.password} onChange={this.handleChange} className="form-control" id="txtPassword" placeholder="Enter Password" ref="pass" name="password" required/>
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





 export default withRouter(Login);