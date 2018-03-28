import React, {Component} from 'react';
import '../css/style.css';
import Navbar from './Navbar';
import UserNavbar from './UserNavbar';
import Bidnow from './Bidnow';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

class Myrelevantprojects extends Component {

    constructor() {
        super();
        this.state = {
            relevantProjects : []
        }
    }

    componentWillMount() {
        console.log('In my Myrelevantprojects');
        axios.get('http://localhost:3001/checksession', { withCredentials: true })
            .then( (response) => {
                console.log("In render userhome component will mount...", response.data.session.username);

                if(response.data.session !== "ERROR") {
                    var user = {
                        username: response.data.session.username
                    }
                    axios.post('http://localhost:3001/getallrelevantopenprojects', user, {withCredentials: true})
                        .then((response) => {
                            console.log(response.data);
                            if(response.data.finalRelevantProjectsArray.length !== 0) {
                                this.setState({
                                    relevantProjects: response.data.finalRelevantProjectsArray
                                }, () => {
                                    console.log("Printing relevant projects on react side", this.state.relevantProjects);
                                })
                            }
                        })
                }

            })

    }



    render() {
        let relevantProjectsToShow = [];
        let redirect = null;
        if(localStorage.getItem("username") === null) {
            redirect = <Redirect to="/login" />
        }

        if(this.state.relevantProjects === []) {
            relevantProjectsToShow = [];
        } else {
            relevantProjectsToShow = this.state.relevantProjects.map(p => {
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


        return(
            <div className="Myrelevantprojects">
                { redirect }
                <Navbar />
                <UserNavbar />
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
                        { relevantProjectsToShow }
                        </tbody>

                    </table>
                </div>
            </div>
        );
    }
}

export default Myrelevantprojects;