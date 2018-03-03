import React, {Component} from 'react';
import '../css/style.css';
import image from '../images/freelancerlogo.png';

class Imageuploader extends Component {
    constructor() {
        super();
        this.state = {
            fileSelected: ''
        }
    }

    handleChange = (e) => {
        this.setState({
            fileSelected : e.target.files[0]
        });
    }
    
    

    render() {
        let imagePath = this.state.fileSelected;
        let imagePathString = imagePath.toString();
        return(
            <div className="Imageuploader">
                <div id='profileImage'>
                            <img src= {imagePathString}/> 
                            <div id='imageUploader'> 
                                <input type='file' className='fileInput' onChange={this.handleChange} />
                                <button className="btn btn-primary"><label>Upload</label></button>
                            </div>
                        </div>
            </div>
        );
    }
}

export default Imageuploader;