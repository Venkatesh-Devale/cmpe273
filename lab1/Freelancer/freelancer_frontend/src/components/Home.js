import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import Navbar from './Navbar';
import '../css/style.css';

class Home extends Component {
    render() {
        let redirect = null;
        if(localStorage.getItem("username") !== null) {
            redirect = <Redirect to="/userhome" />
        }
        return(
            <div className="Home">
                { redirect }
                <Navbar />
                
            </div>
        );
    }
}

export default Home;