import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import '../css/style.css';

class Userprofile extends Component {
    constructor() {
        super();
        this.state = {
            username:'Please login first',
            email:'',
            phone:'',
            aboutme:'',
            editing: false
        }
    }
    
    componentDidMount() {
        if(this.props.logindata) {
            document.getElementById('txtEmailId').value = this.props.logindata.email;
            document.getElementById('txtPhone').value = this.props.logindata.phone;
            document.getElementById('txtaboutme').value = this.props.logindata.aboutme;
        } else {
            document.getElementById('txtEmailId').value = this.state.email;
            document.getElementById('txtPhone').value = this.state.phone;
            document.getElementById('txtaboutme').value = this.state.aboutme;
        }
        
        this.disableAll()
    }

    enableAll() {
        document.getElementById('txtEmailId').disabled = false;
        document.getElementById('txtPhone').disabled = false;
        document.getElementById('txtaboutme').disabled = false;
    }

    disableAll() {
        document.getElementById('txtEmailId').disabled = true;
        document.getElementById('txtPhone').disabled = true;
        document.getElementById('txtaboutme').disabled = true;
    }

    edit() {
        this.enableAll();
        this.setState({
            editing: true
        })
    }

    cancel() {
        document.getElementById('txtEmailId').value = this.state.email;
        document.getElementById('txtPhone').value = this.state.phone;
        document.getElementById('txtaboutme').value = this.state.aboutme;

        this.disableAll();
        this.setState({
            editing: false
        })
    }

    saveUpdatedUser(e) {
        e.preventDefault();
        this.disableAll();
        let newUser = {};
        this.setState({
            email: document.getElementById('txtEmailId').value,
            phone: document.getElementById('txtPhone').value,
            aboutme: document.getElementById('txtaboutme').value,
            editing: false
        }, function() {
            newUser.username = this.state.username;
            newUser.email = this.state.email;
            newUser.phone = this.state.phone;
            newUser.aboutme = this.state.aboutme;    
        })
        console.log(newUser);
        this.props.saveUpdatedUser(newUser);
    }

    /*handleChange(event) {
        this.setState({
            [event.target.name] : [event.target.value]
        })
    }*/

    render() {
        let usernameindiv = '';
        if(this.props.logindata)
            usernameindiv = this.props.logindata.username;
        else 
            usernameindiv = this.state.username;
        let buttons = null;
        if(this.state.editing === false) {
            buttons = (
                <div className="form-group">
                                <div className="btn-group btn-group-justified">
                                    <div className="btn-group">
                                        <button type="button" onClick={this.edit.bind(this)} className="btn btn-primary form-control"><label> Edit your profile </label></button>
                                    </div>
                                </div>
                                
                            </div>
            )
        } else {
            buttons = (
                <div className="form-group">
                                <div className="btn-group btn-group-justified">
                                    <div className="btn-group">
                                        <button type="button" onClick={this.saveUpdatedUser.bind(this)} className="btn btn-primary form-control"><label>Save</label></button>
                                    </div>
                                    <div className="btn-group">
                                        <button type="button" onClick={this.cancel.bind(this)} className="btn btn-primary form-control"><label>Cancel</label></button>
                                    </div>
                                </div>
                                
                            </div> 
            )
        }
        return (
            <div className = 'Userprofile'>
                <div className='container-fluid'>
                    <h1>Hello on Userprofile</h1>
                    <div className='row'>
                        <div id='profileImage'>
                            <img src='' alt='my profile pic'/>
                        </div>
                        <div id='profileDescription'>
                        <form >
                            <div className="form-group">
                                <div id='name'><h1>{usernameindiv}</h1></div>
                            </div>
                            <div className="form-group">
                                <label>Email: </label>    
                                <input type="email"  ref="emailid" className="form-control" placeholder='Enter your email id'  id="txtEmailId" name="emailid" />
                            </div>
                            <div className="form-group">
                                <label>Phone: </label>
                                <input type="text" ref="phone"  className="form-control" placeholder='Enter your phone number' id="txtPhone" name="phone" />
                            </div>  
                            <div className="form-group">
                                <label for="comment">About Me:</label>
                                <textarea id="txtaboutme"  className="form-control" rows="5" ></textarea>
                            </div> 
                            {buttons}
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
        success: state.userprofileupdate_success,
        logindata: state.login_data
    }
}

function mapDispatchToProps(dispatch) {
    return {
        saveUpdatedUser: (user) => {
            console.log("In saveUpdatedUser:",user);
            axios.post('http://localhost:3001/updateprofile', user)
            .then((response) => {
                console.log(response);
                dispatch({
                    type:'UPDATE_PROFILE_SUCCESS',
                    payload: response
                })
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Userprofile);