import React, {Component} from 'react';
import '../css/style.css';
import Navbar from './Navbar';
import UserNavbar from './UserNavbar';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Pagination from './Pagination';


class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
            projects: [],
            freelancerButtonClicked: false,
            searchText:'',
            pageOfItems: [],
            username: ''
        };

        this.getAllPublishedProjects = this.getAllPublishedProjects.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
    }

    componentWillMount() {
        axios.get('http://localhost:3001/checksession', { withCredentials: true })
            .then( (response) => {
                console.log("In render dashboard component will mount...", response.data.session.username);
                if(response.data.session === "ERROR") {
                    this.props.history.push('/login');
                } else {
                    this.setState({
                        username: response.data.session.username
                    }, () => {
                        this.getAllPublishedProjects();
                    })

                }
            })

    }

    onChangePage(pageOfItems) {
        // update state with new page of items
        this.setState({ pageOfItems: pageOfItems});
    }

    getAllPublishedProjects() {
        console.log('In my Dashboard');
        const userDetails = {
            username: this.state.username
        }
        axios.post('http://localhost:3001/getmypublishedprojects', userDetails, {withCredentials: true})
            .then((response) => {
                console.log(response.data);
                if(response.data === 'ERROR') {
                    let emptyProject = [];
                    //emptyProject.push('No projects to show');
                    this.setState({
                        projects: emptyProject
                    })
                } else {
                    this.setState({
                        projects: response.data
                    })
                }
            })
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleFreelancerClicked() {
        this.setState({
            freelancerButtonClicked: true
        })
    }

    handleSearch(e) {
        e.preventDefault();
        console.log("In handleSearch", this.state.searchText);
        const search = {
            search: this.state.searchText,
            username: this.state.username
        }
        axios.post("http://localhost:3001/getSearchCriteriaForDashBoard", search, { withCredentials: true})
            .then((response) => {
                console.log(response.data);
                if(response.data.length !== 0) {
                    this.setState({
                        projects: response.data
                    })
                } else {
                    this.setState({
                        projects: []
                    })
                }

            })

    }


    render() {
        // let redirect = null;
        // if(this.state.username === '') {
        //     redirect = <Redirect to="/login" />
        // }
        if(this.state.freelancerButtonClicked === true)
            this.props.history.push('/dashboardfreelancer');
        let projectsToShow = [];

        if(this.state.projects === []) {

        } else {
            projectsToShow = this.state.pageOfItems.map(p => {
                var finalDate = null
                if( p.estimated_completion_date !== null) {
                    finalDate = p.estimated_completion_date.slice(0,10);
                }
                return (
                    <tr key={p.id}>
                        <td>
                            <p><Link to={`/projectdetails/${ p.id }`}> {p.title} </Link></p>
                            <p> {p.description} </p>
                            <span> {p.skills_required} </span>
                        </td>
                        <td>
                            <div>
                                <p> { p.average } </p>
                            </div>
                        </td>
                        <td>
                            <div>
                                <p><Link to={`/userprofile/${ p.worker }`}>{p.worker}</Link></p>
                            </div>
                        </td>
                        <td>
                            <div>
                                <p> { finalDate } </p>
                            </div>
                        </td>
                        <td>
                            <div>
                                <p>{p.number_of_bids}</p>
                            </div>
                        </td>
                        <td>
                            <div>
                                <p>{p.open}</p>
                            </div>
                        </td>

                    </tr>
                );

            });
        }


        return(
            <div className="Dashboard">

                <Navbar />
                <UserNavbar />
                <div className='divBtnEmployerOrFreelancer'>
                    <div className="btn-group" role="group" aria-label="Basic example">
                        <button onClick={() => this.getAllPublishedProjects()} type="button" className="btn btn-secondary">Employer</button>
                        <button type="button" onClick = {()=> this.handleFreelancerClicked()} className="btn btn-secondary">Freelancer</button>
                    </div>
                </div>

                <div className = "Searchbar">
                    <div className="row">

                        <div className="input-group">
                            <input type="text" id = "idsearchText" name = "searchText" onChange={this.handleChange.bind(this)} className="form-control" placeholder="search by project name"/>
                            <span className="input-group-btn">
                              <button className="btn btn-secondary" onClick={this.handleSearch.bind(this)} type="button">Go!</button>
                            </span>
                        </div>

                    </div>

                </div>

                <div className='divDashboardProjectTable'>
                    <table className='table table-hover'>
                        <thead>
                        <tr className='table-secondary'>
                            <th id='projectNameColomn'>Project Name</th>
                            <th id='employerColomn'>Average Bid</th>
                            <th id='numberOfBidsColomn'>Freelancer Name</th>
                            <th id='numberOfBidsColomn'>Estimated Completion Date</th>
                            <th id='numberOfBidsColomn'>Number of Bids</th>
                            <th id='budgetRangeColomn'>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {projectsToShow}
                        </tbody>

                    </table>
                </div>

                <Pagination items={this.state.projects} onChangePage={this.onChangePage} />

            </div>
        );


    }
}

export default Dashboard;