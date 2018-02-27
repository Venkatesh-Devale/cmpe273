import React, {Component} from 'react';
import Navbar from './Navbar';
import '../css/style.css';

class Home extends Component {
    render() {
        return(
            <div className="Home">
                <Navbar />
            </div>
        );
    }
}

export default Home;