import React, {Component} from 'react';
import Navbar from './Navbar';
import UserNavbar from './UserNavbar';
import Bidnow from './Bidnow';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/style.css';


class Userhome extends Component {

    constructor() {
        super();
        this.state = {
            projects : [],
            searchText:''

        }
    }
    
    componentWillMount() {

        let param = null;
        axios.post('http://localhost:3001/getallopenprojects', param, {withCredentials: true})
        .then((response) => {
            //console.log('In allopenprojects',response.data);
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

    handleSearch(e) {
        e.preventDefault();
        console.log("In handleSearch", this.state.searchText);
        const search = {
            search: this.state.searchText
        }
        axios.post("http://localhost:3001/getSearchCriteria", search, { withCredentials: true})
            .then((response) => {
                console.log(response.data);
                if(response.data.length !== 0)
                this.setState({
                    projects: response.data
                })
            })

    }



    render() {



        let projectsToShow = [];
        if(this.state.projects === []) {
            projectsToShow = [];
        } else {
            projectsToShow = this.state.projects.map(p => {
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
                            <Bidnow id={p.id}/>
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
                        <div className="col-lg-10">
                            <div className="input-group">
                                <input type="text" name = "searchText" onChange={this.handleChange.bind(this)} className="form-control" placeholder="Search projects or technology..."/>
                                <span className="input-group-btn">
                              <button className="btn btn-default" onClick={this.handleSearch.bind(this)} type="button">Go!</button>
                            </span>
                            </div>
                        </div>
                    </div>

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

            </div>
        );
    }
}


export default Userhome;