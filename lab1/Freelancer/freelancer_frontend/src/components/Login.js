import React, {Component} from 'react';
import '../css/style.css';

class Login extends Component {
    render() {
        return(
            <div className="Login"> 
            <div id="mainDiv">
            <div className="center">
                    <div>
                         <h1> Login </h1>
                    </div>
                    <div id="divLoginForm">
                        <form>
                            <div className="form-group">
                                <input type="text" className="form-control" id="txtUserName" placeholder="Email or Username" name="username" />
                            </div>
                            <div className="form-group">
                                <input type="password" className="form-control" id="txtPassword" placeholder="Enter Password" name="password" />
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

export default Login;