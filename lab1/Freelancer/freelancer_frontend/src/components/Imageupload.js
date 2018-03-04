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
                            <img src= {this.state.fileSelected}/> 
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


/*import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';

const CLOUDINARY_UPLOAD_PRESET = 'te5yw7vd';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/venkatesh-devale-sjsu/image/upload';

class Imageupload extends Component {

    constructor() {
        super();
        this.state = {
            uploadedFileCloudinaryUrl: ''
        }
    }

    onImageDrop(files) {
        this.setState({
          uploadedFile: files[0]
        });
    
        this.handleImageUpload(files[0]);
      }

      handleImageUpload(file) {
        let upload = request.post(CLOUDINARY_UPLOAD_URL)
                            .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                            .field('file', file);
    
        upload.end((err, response) => {
          if (err) {
            console.error(err);
          }
    
          if (response.body.secure_url !== '') {
            this.setState({
              uploadedFileCloudinaryUrl: response.body.secure_url
            });
          }
        });
      }

    render() {
        return(
            <form>
        <div className="FileUpload">
          <Dropzone
            onDrop={this.onImageDrop.bind(this)}
            multiple={false}
            accept="image/*">
            <div>Drop an image or click to select a file to upload.</div>
          </Dropzone>
        </div>

        <div>
          {this.state.uploadedFileCloudinaryUrl === '' ? null :
          <div>
            <p>{this.state.uploadedFile.name}</p>
            <img src={this.state.uploadedFileCloudinaryUrl} />
          </div>}
        </div>
      </form>
        );
    }
}

export default Imageupload;*/