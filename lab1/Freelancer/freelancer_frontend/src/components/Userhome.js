import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import '../css/style.css';

class Userhome extends Component {
    render() {
        return (
            <div className="Userhome">
               <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="#">Freelancer logo here</a>
                        </div>
                        <ul className="nav navbar-nav navbar-right">
                            <li><a href="#"><span className="glyphicon glyphicon-user"></span> My Profile</a></li>
                            <li><a href="#"><span className="glyphicon glyphicon-log-out"></span> Logout</a></li>
                        </ul>
                    </div>
                </nav>
                <nav className="navbar navbar-inverse">
                    <div className="container-fluid">
                           <ul className = 'nav navbar-nav'>
                                <li><Link to="/dashboard">Dashboard</Link></li>
                           </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li className="mr-4"><button className=" navbar-btn btn btn-warning">Post a Project</button></li>
                        </ul>
                    </div>
                </nav>
            </div>
        );
    }
}

export default Userhome;