import React, {Component} from 'react';
import '../css/style.css';
import Navbar from './Navbar';
import UserNavbar from './UserNavbar';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

class Myassignedprojects extends Component {

    constructor() {
        super();
        this.state = {
            assignedProjects : []
        }
    }

    componentWillMount() {
        console.log('In my Myassignedprojects');
        axios.get('http://localhost:3001/checksession', { withCredentials: true })
            .then( (response) => {
                console.log("In render userhome myassignedprojects component will mount...", response.data.session.username);

                if(response.data.session !== "ERROR") {
                    var user = {
                        username: response.data.session.username
                    }
                    axios.post('http://localhost:3001/getmyassignedprojects', user, {withCredentials: true})
                        .then((response) => {
                            console.log(response.data);
                            if(response.data.myassignedprojectsArray.length !== 0) {
                                this.setState({
                                    assignedProjects: response.data.myassignedprojectsArray
                                }, () => {
                                    console.log("Printing my assigned projects on react side", this.state.assignedProjects);
                                })
                            }
                        })
                }

            })

    }



    render() {
        let myassignedProjectsToShow = [];
        let redirect = null;
        if(localStorage.getItem("username") === null) {
            redirect = <Redirect to="/login" />
        }

        if(this.state.assignedProjects === []) {
            myassignedProjectsToShow = [];
        } else {
            myassignedProjectsToShow = this.state.assignedProjects.map(p => {
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

                    </tr>
                );

            });
        }


        return(
            <div className="Myassignedprojects">
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
                        </tr>
                        </thead>
                        <tbody>
                        { myassignedProjectsToShow }
                        </tbody>

                    </table>
                </div>
            </div>
        );
    }
}

export default Myassignedprojects;