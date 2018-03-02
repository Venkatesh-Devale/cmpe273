import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import '../css/style.css';

class Navbar extends Component {
    constructor() {
        super();
        
    }

    render() {
        console.log(this.props.success);
        let changes = null;
        if(this.props.success === null) {
            changes = (
                <ul className="nav navbar-nav navbar-right">
                    <li className="mr-2"><Link to="/login">Log In</Link></li>
                    <li className="mr-2"><Link to="/signup">Signup</Link></li>
                    <li className="mr-4"><button className=" navbar-btn btn btn-warning">Post a Project</button></li>
                </ul>
            )
        } else {
            changes = (
                <ul className="nav navbar-nav navbar-right">
                    <li><Link to="/userprofile"><span className="glyphicon glyphicon-user"></span> My Profile</Link></li>
                    <li><a href="/home"><span className="glyphicon glyphicon-log-out"></span> Logout</a></li>
                    <li className="mr-4"><button className=" navbar-btn btn btn-warning">Post a Project</button></li>
                </ul>
            )
        }
        return (
            <div id="nav">
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="/">Freelancer</a>
                        </div>
                        {changes}
                    </div>
                </nav>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
       success: state.success
    }
}

export default connect(mapStateToProps)(Navbar);