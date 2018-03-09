import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/style.css';

class ListAllBids extends Component {
    constructor() {
        super();
        this.state = {
            bids : []
        }
    }
    componentWillMount() {
        console.log('In ListAllBids Component:' + this.props.id);
        const pid = {
            projectid : this.props.id
        }
        axios.post('http://localhost:3001/getAllBidsForThisProject', pid)
        .then( (response) => {
            //console.log('In getAllBidsForThis project:',response.data);
            if(response.data === 'ERROR') {
                let tempBids = [];
                tempBids.push('No projects to show');
                this.setState({
                    bids: tempBids
                })
            } else {
                this.setState({
                    bids: response.data
                })
            }
        })
    }
    render() {
        let bidsToShow = [];
        bidsToShow = this.state.bids.map( (b) => {
            return (
                <tr key={b.id}>
                <td>
                    <p>Show Profile Image here</p>
                </td>
                <td>
                    <div>
                    <p><Link to={ `/userprofile/${ b.freelancer }` }> { b.freelancer } </Link></p>
                    </div>
                </td>
                <td>
                    <div>
                        <p>{ b.period }</p>
                    </div>
                </td>
                <td>
                    <div>
                        <p>{ b.bidamount }</p>
                    </div>
                </td>
                
             </tr>
            );
        })
        return(
            <div className = 'ListAllBids'>
                <div className = 'container-fluid'> 
                    <div id='divListHeader'>
                        <h2> List of all bids on this project </h2>
                    </div>
                    <div id='divListAllBidsTable'>
                        
                        <table className = 'table table-hover'>
                            <thead>
                                <tr className = 'table-secondary'>
                                    <th id='freeLancerImage'>Profile Image</th>
                                    <th id='freelancerName'>Freelancer Name</th>
                                    <th id='bidPrice'>Bid Price</th>
                                    <th id='periodInDays'>Period(In Days)</th>
                                </tr>
                            </thead>
                            <tbody>
                                { bidsToShow }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default ListAllBids;