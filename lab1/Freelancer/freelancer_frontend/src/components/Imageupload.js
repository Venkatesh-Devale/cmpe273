import React, {Component} from 'react';
import '../css/style.css';
//import image from '../images/freelancerlogo.png';

class Imageuploader extends Component {
    constructor() {
        super();
        this.state = {
            fileSelected: ''
        }
    }

    handleChange = event => {
        console.log(event.target.files[0]);
        this.setState({
            fileSelected: event.target.files[0]
        })
    }



    render() {
        
        return(
            <div className="Imageuploader">
                <div id='profileImage'>
                            <img src= {this.state.fileSelected} alt='for users profile'/> 
                            <div id='imageUploader'> 
                                <input type='file' className='fileInput' onChange={this.handleChange} />
                                <button  className="btn btn-primary"><label>Upload</label></button>
                            </div>
                        </div>
            </div>
        );
    }
}

export default Imageuploader;
