import React, {Component} from 'react';
import '../css/style.css';
import Navbar from './Navbar';
import UserNavbar from './UserNavbar';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Pagination from './Pagination';
import url from '../serverurl';


class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
            projects: [],
            freelancerButtonClicked: false,
            searchText:'',
            pageOfItems: [],
            username: '',
            allprojects:[]
        };

        this.getAllPublishedProjects = this.getAllPublishedProjects.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.getFilterProject = this.getFilterProject.bind(this);
        this.setProjectsAfterFiltering = this.setProjectsAfterFiltering.bind(this);
    }

    componentWillMount() {
        axios.get(url + '/checksession', { withCredentials: true })
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
        axios.post(url + '/getmypublishedprojects', userDetails, {withCredentials: true})
            .then((response) => {
                console.log("After getting my published projects",response.data);
                if(response.data === 'ERROR') {
                    let emptyProject = [];
                    //emptyProject.push('No projects to show');
                    this.setState({
                        projects: emptyProject,
                        allprojects: []
                    })
                } else {
                    this.setState({
                        projects: response.data,
                        allprojects: response.data
                    })
                }
            })
    }

    setProjectsAfterFiltering(tempProjects, filter) {
        var finalArrayToShow = [];
        for(var i = 0; i < tempProjects.length; i++) {
            if(tempProjects[i].open === filter) {
                finalArrayToShow.push(tempProjects[i]);
            }
        }
        this.setState({
            projects: finalArrayToShow
        })
    }

    getFilterProject() {

        var tempProjects = this.state.allprojects;

        if(document.getElementById("checkboxOpen").checked && document.getElementById("checkboxClosed").checked) {
            console.log("Both checkbox checked");
            this.setState({
                projects: this.state.allprojects
            })
        }
        else if(document.getElementById("checkboxClosed").checked) {
            console.log("Closed checkbox checked");
            this.setProjectsAfterFiltering(tempProjects, 'closed');
        }
        else if(document.getElementById("checkboxOpen").checked) {
            console.log("Open checkbox checked");
            this.setProjectsAfterFiltering(tempProjects, 'open');
        } else {
            console.log("No checkbox checked");
            this.setState({
                projects: this.state.allprojects
            })
        }

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
        axios.post(url + "/getSearchCriteriaForDashBoard", search, { withCredentials: true})
            .then((response) => {
                console.log(response.data);
                if(response.data.length !== 0) {
                    this.setState({
                        projects: response.data,
                        allprojects: response.data
                    })
                } else {
                    this.setState({
                        projects: [],
                        allprojects: []
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

                <div id="divFilterOnStatus" className="row">
                    <form>
                        <label className="checkbox-inline mr-4">
                            <input type="checkbox" id="checkboxOpen" onClick={ this.getFilterProject } value="open"/>  Open Projects
                        </label>
                        <label className="checkbox-inline">
                            <input type="checkbox" id="checkboxClosed" onClick={ this.getFilterProject } value="closed" />  Closed Projects
                        </label>
                    </form>
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