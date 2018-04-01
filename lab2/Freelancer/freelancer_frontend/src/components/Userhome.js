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
            pageOfItems: []
        };

        this.onChangePage = this.onChangePage.bind(this);
    }


    componentWillMount() {


        axios.post('http://localhost:3001/getallopenprojects', null, {withCredentials: true})
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