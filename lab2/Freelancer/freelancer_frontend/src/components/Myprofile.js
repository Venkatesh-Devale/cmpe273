import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Imageupload from './Imageupload';
import '../css/style.css';
import Navbar from './Navbar';
import UserNavbar from './UserNavbar';
import url from '../serverurl';

class Myprofile extends Component {
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
            disabled: true,
        }
    }

    componentWillMount() {

        let usernameFromSession = this.props.match.params.value;
        console.log("Username from userprofile" + usernameFromSession);

        const usernameJSON = {
            username: usernameFromSession
        }
        axios.post(url+'/getprofile', usernameJSON, {withCredentials: true})
            .then((response) => {
                console.log('Userdetails retrieved from username in userprofile  ', response.data[0])
                this.setState({
                    username: response.data[0].username,
                    email: response.data[0].email,
                    phone: response.data[0].phone,
                    aboutme: response.data[0].aboutme,
                    skills: response.data[0].skills
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
        var flag = 0;
        const newUser = {
            username: this.state.username,
            email: this.state.email,
            phone: this.state.phone,
            aboutme: this.state.aboutme,
            skills: this.state.skills,
        }
        //final regex for validating if only one skill entered
        var pattern1 = /^([a-zA-Z]+)+[a-zA-Z]+$/g;
        //final regex for validating if comma separated skills entered
        var pattern2 = /^([a-zA-Z]+,)+[a-zA-Z]+$/g;
        if(pattern1.test(this.state.skills)) {
            console.log('Only single word in user skills');
            flag = 1;
        }

        else if(pattern2.test(this.state.skills)) {
            console.log('Comma separated skills');
            flag = 2;
        }

        if(flag === 1 || flag === 2) {
            this.setState({
                editing: false,
                disabled: true
            })

            console.log(newUser);
            this.props.saveUpdatedUser(newUser);

        } else {
            alert('Enter comma separated skills without spaces if you are entering multiple skills')
        }
    }


    handleChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    render() {
        let redirect = null;
        let editButton = null;
        let imageupload1 = null;
        if(localStorage.getItem("username") === null) {
            redirect = <Redirect to="/login" />
        }
        if(localStorage.getItem("username") === this.state.username) {
            editButton = (<button type="button" onClick={this.edit.bind(this)} className="btn btn-primary form-control"><label> Edit your profile </label></button>);
            imageupload1 = <Imageupload />
        }
        let buttons = null;
        if(this.state.editing === false) {
            buttons = (
                <div className="form-group">
                    <div className="btn-group btn-group-justified">

                        { editButton }

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

            <div className = 'Myprofile'>
                { redirect }
                <Navbar />
                <UserNavbar />
                <div className='container-fluid'>
                    <div className='row'>
                        { imageupload1 }
                        <div id='profileDescription'>
                            <form >
                                <div className="form-group">
                                    <div id='name'><h1>{this.state.username}</h1></div>
                                </div>
                                <div className="form-group">
                                    <label>About Me:  <span className="glyphicon glyphicon-edit"></span></label>
                                    <textarea id="txtaboutme" value={this.state.aboutme} disabled={this.state.disabled} onChange={this.handleChange} className="form-control" rows="5" name="aboutme" ></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Email:  <span className="glyphicon glyphicon-edit"></span></label>
                                    <input type="email"  ref="emailid"  value={this.state.email} disabled={this.state.disabled} onChange={this.handleChange} className="form-control" placeholder='Enter your email id'  id="txtEmailId" name="email" />
                                </div>
                                <div className="form-group">
                                    <label>Phone:  <span className="glyphicon glyphicon-edit"></span></label>
                                    <input type="text" ref="phone"  value={this.state.phone} disabled={this.state.disabled} onChange={this.handleChange} className="form-control" placeholder='Enter your phone number' id="txtPhone" name="phone" />
                                </div>

                            </form>
                        </div>
                        <div id='profileSkillsAndEditButton'>
                            {buttons}
                            <div id = 'profileSkills'>
                                <div className="form-group">
                                    <label>Skills:  <span className="glyphicon glyphicon-edit"></span></label>
                                    <textarea id="txtskills" ref="skills" onChange={this.handleChange}  value={this.state.skills} className="form-control" rows="5" name='skills' placeholder="Enter comma separated skills without spaces if you are entering multiple skills" disabled={this.state.disabled}></textarea>
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
        logindata: state.login_data,
        employerNameClicked: state.employerNameClicked
    }
}

function mapDispatchToProps(dispatch) {
    return {
        saveUpdatedUser: (user) => {
            console.log("In saveUpdatedUser:",user);
            axios.post(url+'/updateprofile', user, {withCredentials: true})
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

export default connect(mapStateToProps, mapDispatchToProps)(Myprofile);