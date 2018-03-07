import React, {Component} from 'react';
import '../css/style.css';
import Navbar from './Navbar';
import UserNavbar from './UserNavbar';
import axios from 'axios';

class Dashboardfreelancer extends Component {

    constructor() {
        super();
        this.state = {
            projects : [],
            employerButtonClicked: false
        }
    }

    componentWillMount() {
            console.log('In my Dashboardfreelancer...');
            const userDetails = {
                username: sessionStorage.getItem('username')
            }
            axios.post('http://localhost:3001/getmybiddedprojects', userDetails)
            .then((response) => {
                console.log(response.data);
                /*if(response.data === 'ERROR') {
                    let emptyProject = [];
                    emptyProject.push('No projects to show');
                    this.setState({
                        projects: emptyProject
                    })
                } else {
                    this.setState({
                        projects: response.data
                    })
                }*/
            })
    }

    handleEmployerClicked() {
        this.setState({
            employerButtonClicked: true
        })
    }

    render() {
        if(this.state.employerButtonClicked === true)
            this.props.history.push('/dashboard');
        /*let projectsToShow = [];
        projectsToShow = this.state.projects.map(p => {
            return (
                
                <tr key={p.id}>
                <td>
                    <p><a href=''> {p.title} </a></p>
                    <p> {p.description} </p>
                    <span> {p.skills_required} </span>
                </td>
                <td>
                    <div>
                        <p></p>
                    </div>
                </td>
                <td>
                    <div>
                        <p>{p.worker}</p>
                    </div>
                </td>
                <td>
                    <div>
                    <p></p>
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
            
        });*/
        return(
            <div className="Dashboardfreelancer">
                <Navbar />
                <UserNavbar />
                <div className='divBtnEmployerOrFreelancer'>
                    <div className="btn-group" role="group" aria-label="Basic example">
                        <button onClick = {()=> this.handleEmployerClicked()} type="button" className="btn btn-secondary">Employer</button>
                        <button type="button" className="btn btn-secondary">Freelancer</button>
                    </div>
                </div>
                <div className='divDashboardProjectTable'>
                    <table className='table table-hover'>
                       <thead>
                        <tr className='table-secondary'>
                            <th id='projectNameColomn'>Project Name</th>
                            <th id='employerColomn'>Average Bid</th>
                            <th id='numberOfBidsColomn'>Employer Name</th>
                            <th id='numberOfBidsColomn'>Your Bid</th>
                            <th id='budgetRangeColomn'>Status</th>     
                        </tr>
                       </thead>
                       <tbody>
                            
                       </tbody>
                       
                    </table>
               </div>
            </div>
        );
    }
}

export default Dashboardfreelancer;