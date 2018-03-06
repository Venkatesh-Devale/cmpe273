import React, {Component} from 'react';
import { connect } from 'react-redux';
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
            projects : []
        }
    }
    
    componentWillMount() {
        axios.post('http://localhost:3001/getallopenprojects')
        .then((response) => {
            //console.log('In allopenprojects',response.data);
            if(response.data === 'ERROR') {
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

    handleGoToUserProfile(employer) {
        console.log('In handleGoToUserProfile', employer);
        this.props.employerNameClicked(employer);
        if(this.props.employerNameClicked)
            this.props.history.push('/userprofile');
    }

    
    render() {
        let projectsToShow = [];
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
                        <p><a id='goToUserProfile' onClick={() => this.handleGoToUserProfile(p.employer)} href=''> {p.employer} </a></p>
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
        
        return (
            <div className="Userhome">
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
                            {projectsToShow}
                       </tbody>
                       
                    </table>
               </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        employerNameClicked: state.employerNameClicked
    }
}

function mapDispatchToProps(dispatch) {
    return {
        employerNameClicked: (employer) => {
            console.log('In employer nameClicked...'+ employer);
            dispatch({
                type: 'EMPLOYER_NAME_CLICKED',
                payload: employer
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Userhome);