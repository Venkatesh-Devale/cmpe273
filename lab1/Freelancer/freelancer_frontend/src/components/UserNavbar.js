import React, {Component} from 'react';

class UserNavbar extends Component {
    render() {
        return (
            <div id="nav">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container-fluid">
                        <ul className="nav navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link" href="/dashboard">Dashboard</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/userhome">Home</a>
                            </li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li className="nav-item mr-4">
                                <button className=" navbar-btn btn btn-warning">
                                    <a className='text-dark' href="/postproject">Post a Project
                                    </a>
                                </button>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        );
    }
} 

export default UserNavbar;