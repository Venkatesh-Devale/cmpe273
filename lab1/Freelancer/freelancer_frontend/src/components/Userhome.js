import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Navbar from './Navbar';
import '../css/style.css';

class Userhome extends Component {
    render() {
        return (
            <div className="Userhome">
               <Navbar />
            </div>
        );
    }
}

export default Userhome;