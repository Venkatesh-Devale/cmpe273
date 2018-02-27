import React, {Component} from 'react';

import '../css/style.css';

class Navbar extends Component {
    render() {
        return (
            <div id="nav">
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="/">Freelancer</a>
                        </div>
                        <ul className="nav navbar-nav navbar-right">
                            <li className="mr-2"><a href="/login">Log In</a></li>
                            <li className="mr-2"><a href="/Signup">Signup</a></li>
                            <li className="mr-4"><button className=" navbar-btn btn btn-warning">Post a Project</button></li>
                        </ul>
                    </div>
                </nav>
            </div>
        );
    }
}

export default Navbar;