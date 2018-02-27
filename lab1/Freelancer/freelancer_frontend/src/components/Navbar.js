import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Navbar extends Component {
    render() {
        return (
            <div>
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="/">Freelancer</a>
                        </div>
                        <ul className="nav navbar-right navbar-nav">
                            <li><a className="mr-2" href="/">Log In</a></li>
                            <li><a className="mr-2" href="/about">Signup</a></li>
                            <li><button className="btn btn-warning navbar-btn mr-4">Post a Project</button></li>
                        </ul>
                    </div>
                </nav>
            </div>
        );
    }
}

export default Navbar;