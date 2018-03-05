import React, {Component} from 'react';
import { connect } from 'react-redux';
import '../css/style.css';

class Navbar extends Component {
    
    handleLogout() {
        //alert(sessionStorage.getItem('username'));
        sessionStorage.removeItem('username');
        this.props.history.push('/');
    }

    render() {
        //console.log(this.props.success);
        let changes = null;
        if(sessionStorage.getItem('username') === null) {
            changes = (
                <ul className="nav navbar-nav navbar-right">
                    <li className="nav-item mr-4 "><a className='text-dark' href="/login">Log In</a></li>
                    <li className="nav-item mr-4"><a className='text-dark' href="/signup">Signup</a></li>
                    <li className="nav-item mr-4"><button className=" navbar-btn btn btn-warning"><a className='text-dark' href="/postproject">Post a Project</a></button></li>
                </ul>
            )
        } else {
            changes = (
                <ul className="nav navbar-nav navbar-right">
                    <li className='nav-item mr-4'><a className='text-dark' href="/userprofile"><span className="glyphicon glyphicon-user"></span> My Profile</a></li>
                    <li className='nav-item mr-4'><a className='text-dark' onClick={this.handleLogout} href="/"><span className="glyphicon glyphicon-log-out"></span> Logout</a></li>
                    
                </ul>
            )
        }
        return (
            <div id="nav">
                <nav className="navbar navbar-expand-lg navbar-light bg-white">
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
       success: state.login_data
    }
}

export default connect(mapStateToProps)(Navbar);