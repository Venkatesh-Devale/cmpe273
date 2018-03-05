import React, {Component} from 'react';
import '../css/style.css';
import Navbar from './Navbar';
import UserNavbar from './UserNavbar';
import axios from 'axios';

class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
            projects : []
        }
    }

    componentWillMount() {
            console.log('In my Dashboard');
            const userDetails = {
                username: sessionStorage.getItem('username')
            }
            axios.post('http://localhost:3001/getmypublishedprojects', userDetails)
            .then((response) => {
                //console.log(response.data);
                if(response.data == 'ERROR') {
                    let emptyProject = [];
                    emptyProject.push('No projects to show');
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

    render() {
        let projectsToShow = [];
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
            
        });
        return(
            <div className="Dashboard">
                <Navbar />
                <UserNavbar />
                <div className='divBtnEmployerOrFreelancer'>
                    <div class="btn-group" role="group" aria-label="Basic example">
                        <button onClick={() => this.componentWillMount()} type="button" class="btn btn-secondary">Employer</button>
                        <button type="button" class="btn btn-secondary">Freelancer</button>
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
            </div>
        );
    }
}

export default Dashboard;