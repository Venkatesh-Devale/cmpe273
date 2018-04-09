import React, {Component} from 'react';
import '../css/style.css';
import axios from 'axios';
import url from '../serverurl';

class Submissionpanelworker extends Component {

    constructor() {
        super();
        this.state = {
            comment:''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log("Project details", this.props.projectid, this.props.employer, this.props.worker, this.state.comment);
        var projectComment = {
            projectid: this.props.projectid,
            comment: this.state.comment
        }
        axios.post(url+'/insertworkercomment', projectComment, {withCredentials: true})
            .then((response) => {
                console.log(response.data);
                if(response.data === 'Comment Updated Successfully') {
                    alert('Comment posted Successfully');
                    document.getElementById('workerComments').value = '';
                }
            })
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })

    }

    render() {

        return(
            <div className="Submissionpanelworker">
                <div id = 'divSubmissionPanel'>
                    <form onSubmit={this.handleSubmit}>

                            <div className="form-group">
                                <label htmlFor="workerComments"><h4>Submission Panel - Submit File and Comments</h4></label>
                                <textarea className="form-control" name='comment' onChange={this.handleChange} id="workerComments" col="5" rows="3" placeholder='Please enter your comments here'></textarea>
                            </div>
                            <div className="input-group">
                                <div className="custom-file">
                                    <input type="file" className="custom-file-input" id="workerFileUpload"/>
                                        <label className="custom-file-label" htmlFor="workerFileUpload">Choose file</label>
                                </div>
                                <div className="input-group-append">
                                    <button className="btn btn-outline-secondary" type="submit">Upload</button>
                                </div>
                            </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Submissionpanelworker;