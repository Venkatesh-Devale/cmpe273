import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import Imageupload from './Imageupload';
import '../css/style.css';
import Navbar from './Navbar';

class Userprofile extends Component {
    constructor() {
        super();
        this.state = {
            username:'Please login first',
            email:'',
            phone:'',
            aboutme:'',
            editing: false,
            file:'',
            image:'',
            skills:'',
            disabled: true
        }
    }
    
    componentWillMount() {
        let usernameFromSession = sessionStorage.getItem('username');
        console.log("Username from userprofile" + usernameFromSession);
        const usernameJSON = {
            username: usernameFromSession
        }
        axios.post('http://localhost:3001/getprofile', usernameJSON)
        .then((response) => {
            console.log('Userdetails retrieved from username in userprofile  ', response.data[0])
            this.setState({
                username: response.data[0].username,
                email: response.data[0].email,
                phone: response.data[0].phone,
                aboutme: response.data[0].aboutme
            })
        })
    }


    edit() {
        this.setState({
            editing: true,
            disabled: false
        })
    }

    cancel() {  
        this.setState({
            editing: false,
            disabled: true
        })
    }

    saveUpdatedUser(e) {
        e.preventDefault();
        
        let newUser = {};
        this.setState({
            username: this.state.username,
            email: this.state.email,
            phone: this.state.phone,
            aboutme: this.state.aboutme,
            editing: false,
            disabled: true
        }, function() {
            newUser.username = this.state.username;
            newUser.email = this.state.email;
            newUser.phone = this.state.phone;
            newUser.aboutme = this.state.aboutme;    
        })
        console.log(newUser);
        this.props.saveUpdatedUser(newUser);
    }


    handleChange = (event) => {
        this.setState({
            [event.target.name] : [event.target.value]
        })
    }

    render() {
        let usernameindiv = '';
        usernameindiv = sessionStorage.getItem('username');
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
                <Navbar />
                <div className='container-fluid'>
                    <h1>Hello on Userprofile</h1>
                    <div className='row'>
                        <Imageupload />
                        <div id='profileDescription'>
                        <form >
                            <div className="form-group">
                                <div id='name'><h1>{usernameindiv}</h1></div>
                            </div>
                            <div className="form-group">
                                <label>About Me:  <span class="glyphicon glyphicon-edit"></span></label>
                                <textarea id="txtaboutme" value={this.state.aboutme} disabled={this.state.disabled} onChange={this.handleChange} className="form-control" rows="5" name="aboutme" ></textarea>
                            </div>
                            <div className="form-group">
                                <label>Email:  <span class="glyphicon glyphicon-edit"></span></label>    
                                <input type="email"  ref="emailid"  value={this.state.email} disabled={this.state.disabled} onChange={this.handleChange} className="form-control" placeholder='Enter your email id'  id="txtEmailId" name="email" />
                            </div>
                            <div className="form-group">
                                <label>Phone:  <span class="glyphicon glyphicon-edit"></span></label>
                                <input type="text" ref="phone"  value={this.state.phone} disabled={this.state.disabled} onChange={this.handleChange} className="form-control" placeholder='Enter your phone number' id="txtPhone" name="phone" />
                            </div>
                            
                        </form>
                        </div>
                        <div id='profileSkillsAndEditButton'>
                            {buttons}
                            <div id = 'profileSkills'>
                                <div className="form-group">
                                    <label>Skills:  <span class="glyphicon glyphicon-edit"></span></label>
                                    <textarea id="txtskills"  className="form-control" rows="5" name='skills' disabled={this.state.disabled}></textarea>
                                </div>
                            </div>
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