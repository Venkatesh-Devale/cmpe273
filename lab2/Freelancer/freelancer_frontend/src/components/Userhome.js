import React, {Component} from 'react';
import Navbar from './Navbar';
import UserNavbar from './UserNavbar';
import Bidnow from './Bidnow';
import axios from 'axios';
import Pagination from './Pagination';
import { Link } from 'react-router-dom';
import '../css/style.css';


class Userhome extends Component {

    constructor() {
        super();
        this.state = {
            projects : [],
            searchText:'',
            pageOfItems: [],
            allprojects:[]
        };

        this.onChangePage = this.onChangePage.bind(this);
        this.getFilterProject = this.getFilterProject.bind(this);
        this.getAllProjects = this.getAllProjects.bind(this);
        this.setProjectsAfterFiltering = this.setProjectsAfterFiltering.bind(this);
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

    getAllProjects() {
        axios.post('http://localhost:3001/getallprojects', null, {withCredentials: true})
            .then((response) => {
                //console.log('In allopenprojects',response.data);
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
                        allprojects: response.data,
                    }, () => {
                        this.setProjectsAfterFiltering(this.state.allprojects, 'open');
                    })
                }
            })
    }


    componentWillMount() {
        this.getAllProjects();

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
            this.setProjectsAfterFiltering(tempProjects, 'open');
        }

    }

    onChangePage(pageOfItems) {
        // update state with new page of items
        this.setState({ pageOfItems: pageOfItems});
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSearch(e) {
        e.preventDefault();
        console.log("In handleSearch", this.state.searchText);
        const search = {
            search: this.state.searchText
        }
        axios.post("http://localhost:3001/getSearchCriteria", search, { withCredentials: true})
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

        let projectsToShow = [];
        if(this.state.pageOfItems === []) {
            projectsToShow = [];
        } else {
            projectsToShow = this.state.pageOfItems.map(p => {
                return (
                    <tr key={p.id}>
                    <td>
                        <p><Link to={`/projectdetails/${ p.id }`}> {p.title} </Link></p>
                        <p> {p.description} </p>
                        <span> {p.skills_required} </span>
                    </td>
                    <td>
                        <div>
                            <p><Link to={`/userprofile/${p.employer}`}> {p.employer} </Link></p>
                        </div>
                    </td>
                    <td>
                        <div>
                            <p>{p.number_of_bids}</p>
                        </div>
                    </td>
                    <td>
                        <div>
                            <p>{p.budgetrange}</p>
                        </div>
                    </td>
                    <td>
                        <div>
                            <Bidnow id={p.id} employer={p.employer}/>
                        </div>
                        <div data-id = {p.id}></div>
                    </td>
                 </tr>
                );
                
            });


        
        }
        return (

            <div className="Userhome">
             
               <Navbar />
               <UserNavbar />


                <div className = "Searchbar">
                    <div className="row">

                            <div className="input-group">
                                <input type="text" id = "idsearchText" name = "searchText" onChange={this.handleChange.bind(this)} className="form-control" placeholder="search by project name or technology skillset"/>
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



               <div className='divProjectTable'>

                    <table className='table table-hover'>
                       <thead>
                        <tr className='table-secondary'>
                            <th id='projectNameColomn'>Project Name</th>
                            <th id='employerColomn'>Employer</th>
                            <th id='numberOfBidsColomn'>Number of Bids</th>
                            <th id='budgetRangeColomn'>Budget Range</th>
                            <th id='bidNowColomn'>Bid Now</th>       
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


export default Userhome;