import React, { Component } from 'react';
import axios from 'axios';
import url from '../serverurl';

class Submissionpanelemployer extends Component {

    constructor() {
        super();
        this.state = {
            comment: ''
        };

    }


    componentWillMount() {
        var projectdetails = {
            projectid: this.props.projectid
        }
        axios.post(url+'/getworkercomment', projectdetails, {withCredentials: true})
            .then((response) => {
                console.log('Worker posted the comment', response.data);
                if(response.data.comment !== null || response.data.comment !== '') {
                    this.setState({
                        comment: response.data
                    })
                }
            })
    }

    render() {
        return(
            <div className='Submissionpanelemployer'>

                <div id = 'divSubmissionPanel'>
                    <form>
                        <div className="form-group">
                            <label htmlFor="workerComments"><h4>Submission Panel - View Freelancer Comments</h4></label>
                            <textarea className="form-control" value={this.state.comment} name='comment' disabled id="workerComments" col="5" rows="3" ></textarea>
                        </div>
                    </form>
                </div>

            </div>
        );
    }
}

export default Submissionpanelemployer;