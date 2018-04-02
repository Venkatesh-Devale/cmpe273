import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/style.css';

class ListAllBids extends Component {
    constructor() {
        super();
        this.state = {
            bids : [],
            display : "none"
        };

        this.sortBidsAscending = this.sortBidsAscending.bind(this);
        this.sortBidsDescending = this.sortBidsDescending.bind(this);
    }


    componentWillMount() {
        console.log('In ListAllBids Component:' + this.props.id);
        const pid = {
            projectid : this.props.id
        }
        axios.post('http://localhost:3001/getAllBidsForThisProject', pid, {withCredentials: true})
        .then( (response) => {
            console.log('In getAllBidsForThis project:',response.data);
            if(response.data.length === 0) {
                let tempBids = [];
                tempBids.push('No projects to show');
                this.setState({
                    bids: []
                })
            } else {
                if(response.data[0].employer === localStorage.getItem('username')) {
                    this.setState({
                        display : "block"
                    })
                }
                this.setState({
                    bids: response.data
                })
            }
        })
    }

    sortBidsAscending() {
        var afterSortAscArray = [];
        afterSortAscArray = this.state.bids;
        afterSortAscArray.sort(function(a, b) {
            return a.bidamount - b.bidamount
        });
        this.setState({
            bids: afterSortAscArray
        }, () => {
            console.log("after ascending sort...", this.state.bids);
        })
    }

    sortBidsDescending() {
        var afterSortDescArray = [];
        afterSortDescArray = this.state.bids;
        afterSortDescArray.sort(function(a, b) {
            return b.bidamount - a.bidamount
        });
        this.setState({
            bids: afterSortDescArray
        }, () => {
            console.log("after descending sort...", this.state.bids);
        })
    }

    handleClick( freelancer ) {
        console.log("Hire button click and freelancer is :" + freelancer, this.props.id);  
        const details = {
            pid : this.props.id,
            freelancer : freelancer
        }
        axios.post('http://localhost:3001/setworkerforproject', details, {withCredentials: true})
        .then( (response) => {
            console.log("In hire button handle click", response.data);
            alert('Freelancer hired...check in your dashboard now...thanks');

        })
    }


    render() {
        
        let bidsToShow = [];
        var k = 0;
        var displayStyle = this.state.display;
        const divStyle = {
            display : displayStyle
        }
        bidsToShow = this.state.bids.map( (b) => {
            return (
                <tr key={k++}>
                <td>
                <img src = { require('/Users/venkateshdevale/Desktop/private git/cmpe273/lab2/Freelancer/freelancer-server/images/' + b.image_name) } alt = "" width= {'100px'} height={'100px'}/>
                </td>
                <td>
                    <div>
                    <p><Link to={ `/userprofile/${ b.freelancer }` }> { b.freelancer } </Link></p>
                    </div>
                </td>
                <td>
                    <div>
                        <p>{ b.bidamount }</p>
                    </div>
                </td>
                <td>
                    <div>
                        <p>{ b.period }</p>
                    </div>
                </td>
                <td>
                    <div style = { divStyle }>
                        <input type = "button" id = "btnHire" className = "btn btn-secondary" value = "Hire" onClick = {this.handleClick.bind(this, b.freelancer)}/>
                    </div>
                </td>
                
             </tr>
            );
        })
        return(
            <div className = 'ListAllBids'>
                <div className = 'container-fluid'> 
                    <div id='divListHeader'>
                        <h2> List of all bids on this project
                            <div id="btnSortAsc" className="btn-group" role="group" aria-label="sort">
                                <button type="button" onClick={ this.sortBidsAscending } className="btn btn-secondary">Sort by Bid Price(Asc)</button>
                                <button type="button" onClick={ this.sortBidsDescending } className="btn btn-secondary">Sort by Bid Price(Desc)</button>
                            </div>
                        </h2>

                    </div>
                    <div id='divListAllBidsTable'>

                        <table className = 'table table-hover'>
                            <thead>
                                <tr className = 'table-secondary'>
                                    <th id='freeLancerImage'>Profile Image</th>
                                    <th id='freelancerName'>Freelancer Name</th>
                                    <th id='bidPrice'>Bid Price</th>
                                    <th id='periodInDays'>Period(In Days)</th>
                                    <th id='btnHire'></th>
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