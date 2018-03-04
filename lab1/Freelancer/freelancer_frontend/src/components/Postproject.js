import React, {Component} from 'react';
import image from '../images/freelancerlogo.png';
import { connect } from 'react-redux';
import Login from './Login';
import '../css/style.css';

class Postproject extends Component {
    constructor() {
        super();
        this.state = {
            title:'',
            description:'',
            skillsRequired:'',
            budgetrange:'$10 - 30 USD'
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    submitProject(e) {
        e.preventDefault();
        const project = {
            owner: sessionStorage.getItem('username'),
            title: this.state.title,
            description: this.state.description,
            skillsRequired: this.state.skillsRequired,
            budgetrange: this.state.budgetrange
        }
        console.log('In submitProject of Postproject...', project);
        this.props.postProject(project);
    }

    render() {
        return(
            <div className="Postproject">
                <div className='container'>
                    
                    <div id='holdPostProjectData'>
                        <form onSubmit={this.submitProject.bind(this)}>
                            <div className="form-group">
                                <div id='logo'><img src={image} /></div>
                            </div>
                            <div className="form-group">
                                <h1>Tell us what you need done</h1>
                            </div>
                            <div className="form-group">
                                <p>Get free quotes from skilled freelancers within minutes, 
                                    view profiles, ratings and portfolios and chat with them. 
                                    Pay the freelancer only when you are 100% satisfied with their work.
                                </p>
                            </div>
                            <br/>
                            <div className="form-group">
                                <h3>Choose a name for your project</h3>
                            </div>
                            <div className="form-group">
                                <input type="text" ref="title"  onChange={this.handleChange} className="form-control" id="txtTitle" placeholder="e.g. Build me a website" name="title" required/>
                            </div>
                            <br/>
                            <div className="form-group">
                                <h3>Tell us more about your project</h3>
                            </div>
                            <div className="form-group">
                                <p>
                                    Great project descriptions include a little bit about yourself, details of what you are trying to achieve, 
                                    and any decisions that you have already made about your project. 
                                    If there are things you are unsure of, don't worry, a freelancer will be able to help you fill in the blanks.
                                </p>
                            </div>
                            <div className="form-group">
                                <textarea id="txtDesc" className="form-control" ref="description" onChange={this.handleChange} className="form-control" rows="5" name="description" placeholder="Describe your project here..." required></textarea>
                            </div>
                            <br/>
                            <div className="form-group">
                                <h3>What skills are required?</h3>
                            </div>
                            <div className="form-group">
                                <p>
                                    Freelancers will use these skills to find projects they are most interested and experienced in.
                                </p>
                            </div>
                            <div className="form-group">
                                <input type="text" ref="skillsRequired"  onChange={this.handleChange} className="form-control" id="txtskillsRequired" placeholder="What skills are required?" name="skillsRequired" required/>
                            </div>
                            <br/>
                            <div className="form-group">
                                <h3>What is your estimated budget range?</h3>
                            </div>
                            <div className="form-group">
                                <select class="form-control" value={this.state.value} onChange={this.handleChange} name='budgetrange' id="budgetRange">
                                    <option value='$10 - 30 USD'>Micro project($10-30 USD)</option>
                                    <option value='$30 - 250 USD'>Simple project($30-250 USD)</option>
                                    <option value='$250 - 750 USD'>Very small project($250-750 USD)</option>
                                    <option value='$750 - 1500 USD'>Small project($750-1500 USD)</option>
                                    <option value='$1500 - 3000 USD'>Medium project($1500-3000 USD)</option>
                                    <option value='$3000 - 5000 USD'>Medium project($3000-5000 USD)</option>
                                </select> 
                            </div>
                            <br/>
                            <div className="form-group">
                                <button type='submit' className='btn btn-warning'> Post project </button>
                            </div>
                            <br/><br/>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        logindata: state.login_data
    }
}

function mapDispatchToProps() {
    return {
        postProject: (project) => {
            console.log('In postProjectDispatch of Postproject...', project);
        }
    }
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Postproject);