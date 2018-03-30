import React, {Component} from 'react';
import Navbar from './Navbar';
import UserNavbar from './UserNavbar';
import axios from 'axios';
import '../css/style.css';
import Bidnow from './Bidnow';
import ListAllBids from './ListAllBids';
import Submissionpanel from "./Submissionpanel";



class Projectdetailspage extends Component {
    constructor() {
        super();
        this.state = {
            projectId: '',
            title: '',
            description: '',
            skills_required: '',
            employer: '',
            worker: '',
            budgetrange: '',
            number_of_bids: '',
            average: '',
            username: '',
            open: 'open'
        };

        this.handlePayment = this.handlePayment.bind(this);
    }

    checkSession() {
        axios.get('http://localhost:3001/checksession', { withCredentials: true })
            .then( (response) => {
                console.log("In projectdetails Component will mount checksession...", response.data.session.username);
                if(response.data.session !== "ERROR") {
                    this.setState({
                        username: response.data.session.username
                    })
                } else {
                    this.props.history.push('/login');
                }
            })
    }

    componentWillMount() {
        // if(localStorage.getItem('username') === null) {
        //     this.props.history.push('/login');
        // } else {
            
        // }
        this.checkSession();
        console.log(this.props.match.params.value);
        this.setState({
            projectId: this.props.match.params.value
        }, () => {
            const projectId = {
                projectid: this.state.projectId
            }
            axios.post('http://localhost:3001/getproject', projectId, {withCredentials: true})
            .then( (response) => {
                console.log('In projectdetails Component will mount', response.data);
                this.setState({
                    title: response.data[0].title,
                    description: response.data[0].description,
                    skills_required: response.data[0].skills_required,
                    employer: response.data[0].employer,
                    worker: response.data[0].worker,
                    budgetrange: response.data[0].budgetrange,
                    number_of_bids: response.data[0].number_of_bids,
                    average : response.data[0].average,
                    open: response.data[0].open
                }, () => {
                    console.log('In projectdetails Component will mount showing state of employer',this.state.employer);
                    console.log('In projectdetails Component will mount showing state of worker',this.state.worker);

                })
            })

        })
        
        
    }

    handlePayment() {
        console.log("Payment button clicked");
        this.props.history.push(`/makepayment/${ this.state.projectId }`);
    }

    renderEmployer() {
        let redirect = null;
        var changes = null;
        if(localStorage.getItem("username") !== null) {
            //redirect = <Redirect to="/login" />
            redirect = <UserNavbar />;
        }

        if(this.state.open === 'open') {
            changes = (
                <div id = 'div1' >

                    <button type="submit" class="btn btn-secondary" onClick={this.handlePayment} >Make Payment</button>

                </div>
            );
        }


        return(
            <div className="Projectdetailspage">
                <Navbar />
                { redirect }
                <div className='container-fluid'>

                    <div id='divProjectDetails'>

                        <h2> { this.state.title } </h2>
                        <hr />
                        <div id = 'div1' >
                            <h4>Project Description</h4>
                            <p>
                                {this.state.description}
                            </p>
                        </div>
                        <div id = 'div1' >
                            <h4>Skills Required</h4>
                            <p>
                                {this.state.skills_required}
                            </p>
                        </div>
                        <div id = 'div1' >
                            <h4>Budget Range</h4>
                            <p>
                                {this.state.budgetrange}
                            </p>
                        </div>
                        <div id = 'div1' >
                            <h4>Bids</h4>
                            <p>
                                {this.state.number_of_bids}
                            </p>
                        </div>
                        <div id = 'div1' >
                            <h4>Average Bid</h4>
                            <p>
                                {this.state.average}
                            </p>
                        </div>
                        {/*<div id = 'div1' >*/}

                                {/*<button type="submit" class="btn btn-secondary" onClick={this.handlePayment} >Make Payment</button>*/}

                        {/*</div>*/}
                        { changes }
                    </div>
                </div>

            </div>
        );
    }

    renderWorker() {
        let redirect = null;
        if(localStorage.getItem("username") !== null) {
            //redirect = <Redirect to="/login" />
            redirect = <UserNavbar />;
        }
        return(
            <div className="Projectdetailspage">
                <Navbar />
                { redirect }
                <div className='container-fluid'>

                    <div id='divProjectDetails'>

                        <h2> { this.state.title } </h2>
                        <hr />
                        <div id = 'div1' >
                            <h4>Project Description</h4>
                            <p>
                                {this.state.description}
                            </p>
                        </div>
                        <div id = 'div1' >
                            <h4>Skills Required</h4>
                            <p>
                                {this.state.skills_required}
                            </p>
                        </div>
                        <div id = 'div1' >
                            <h4>Budget Range</h4>
                            <p>
                                {this.state.budgetrange}
                            </p>
                        </div>
                        <div id = 'div1' >
                            <h4>Bids</h4>
                            <p>
                                {this.state.number_of_bids}
                            </p>
                        </div>
                        <div id = 'div1' >
                            <h4>Average Bid</h4>
                            <p>
                                {this.state.average}
                            </p>
                        </div>
                    </div>
                    <Submissionpanel />
                </div>

            </div>
        );
    }

    renderNormal() {
        let redirect = null;
        if(localStorage.getItem("username") !== null) {
            //redirect = <Redirect to="/login" />
            redirect = <UserNavbar />;
        }
        return(
            <div className="Projectdetailspage">
                <Navbar />
                { redirect }
                <div className='container-fluid'>

                    <div id='divProjectDetails'>

                        <h2> { this.state.title } </h2>
                        <hr />
                        <div id = 'div1' >
                            <h4>Project Description</h4>
                            <p>
                                {this.state.description}
                            </p>
                        </div>
                        <div id = 'div1' >
                            <h4>Skills Required</h4>
                            <p>
                                {this.state.skills_required}
                            </p>
                        </div>
                        <div id = 'div1' >
                            <h4>Budget Range</h4>
                            <p>
                                {this.state.budgetrange}
                            </p>
                        </div>
                        <div id = 'div1' >
                            <h4>Bids</h4>
                            <p>
                                {this.state.number_of_bids}
                            </p>
                        </div>
                        <div id = 'div1' >
                            <h4>Average Bid</h4>
                            <p>
                                {this.state.average}
                            </p>
                        </div>
                        <div id = 'div1' >
                            <Bidnow id={this.state.projectId} employer={this.state.employer}/>
                        </div>

                    </div>

                    <ListAllBids id = { this.state.projectId } owner = { this.state.employer } />
                </div>

            </div>
        );
    }

    render() {
        if(this.state.worker === '')
            return this.renderNormal();
        else if(this.state.worker === this.state.username) {
            return this.renderWorker();
        }
        else if(this.state.employer === this.state.username) {
            return this.renderEmployer();
        }
        else if(this.state.worker !== this.state.username)
            return this.renderNormal();

    }
}

export default Projectdetailspage;