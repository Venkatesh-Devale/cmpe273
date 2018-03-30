import React, {Component} from 'react';
import '../css/style.css';


class Submissionpanel extends Component {

    render() {

        return(
            <div className="Submissionpanel">
                <div id = 'divSubmissionPanel'>
                    <form>

                            <div className="form-group">
                                <label for="workerComments"><h4>Submit File and Comments</h4></label>
                                <textarea className="form-control" id="workerComments" col="5" rows="3" placeholder='Please enter your comments here'></textarea>
                            </div>
                            <div className="input-group">
                                <div className="custom-file">
                                    <input type="file" className="custom-file-input" id="workerFileUpload"/>
                                        <label className="custom-file-label" for="workerFileUpload">Choose file</label>
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

export default Submissionpanel;