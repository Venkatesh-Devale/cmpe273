import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Imageupload from './Imageupload';
import '../css/style.css';
import Navbar from './Navbar';
import UserNavbar from './UserNavbar';
import swal from 'sweetalert';

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
            skills_required:'',
            disabled: true,
        }
    }
    
    componentWillMount() {
        let usernameFromSession = this.props.match.params.value;
        console.log("Username from userprofile" + usernameFromSession);
        const usernameJSON = {
            username: usernameFromSession
        }
        axios.post('http://localhost:3001/user/getprofile', usernameJSON, {withCredentials: true})
        .then((response) => {
            console.log('Userdetails retrieved from username in userprofile  ', response.data[0])
            this.setState({
                username: response.data[0].username,
                email: response.data[0].email,
                phone: response.data[0].phone,
                aboutme: response.data[0].aboutme,
                skills_required: response.data[0].skills_required
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

       var newUser = {
           username : this.state.username,
           email : this.state.email,
           phone : this.state.phone,
           aboutme : this.state.aboutme,
           skills_required : this.state.skills_required
       };
        console.log(newUser);
        axios.post('http://localhost:3001/user/updateprofile', newUser, {withCredentials: true})
            .then((response) => {
                console.log("After updating the user profile",response.data);
                if(response.data === "success") {
                    this.setState({
                        editing: false,
                        disabled: true
                    }, () => {
                        swal("User profile updated successfully","","success");
                    })
                }
                else {
                    swal("Error in updating profile, please check later","","warning");
                }
            })
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

            <div className = 'Userprofile'>
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
                                    <textarea id="txtskills"  className="form-control" rows="5" value={this.state.skills_required} name='skills_required' disabled={this.state.disabled}  onChange={this.handleChange}></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}



export default Userprofile;