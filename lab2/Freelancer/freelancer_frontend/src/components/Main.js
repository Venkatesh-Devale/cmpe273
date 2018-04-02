import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import Userhome from './Userhome';
import Dashboard from './Dashboard';
import Userprofile from './Userprofile';
import Postproject from './Postproject';
import Projectdetailspage from './Projectdetailspage';
import Dashboardfreelancer from './Dashboardfreelancer';
import Myrelevantprojects from './Myrelevantprojects';
import Myassignedprojects from "./Myassignedprojects";
import Makepayment from "./Makepayment";
import Transactionmanager from './Transactionmanager';
import Myprofile from './Myprofile';

const Main = () => (
    <div> 
        
        <Switch>
            <Route exact path='/' component={ Home } />
            <Route path='/login' component={ Login } />
            <Route path='/signup' component={ Signup } />
            <Route path='/dashboard' component={ Dashboard } />
            <Route path='/userhome' component={ Userhome } />
            <Route path='/myprofile/:value/' component={ Myprofile } />
            <Route path='/userprofile/:value/' component={ Userprofile } />
            {/*<Route path='/userprofile' component={ Userprofile } />*/}
            <Route path='/postproject' component={ Postproject } />
            <Route path='/projectdetails/:value/' component={ Projectdetailspage } />
            <Route path='/dashboardfreelancer' component={ Dashboardfreelancer } />
            {/*<Route path='/projectdetails' component={ Projectdetailspage } />*/}
            <Route path='/myrelevantprojects' component={ Myrelevantprojects } />
            <Route path='/myassignedprojects' component={ Myassignedprojects } />
            <Route path='/makepayment/:value/' component={ Makepayment }/>
            <Route path='/transactionmanager' component={ Transactionmanager } />
        </Switch>
    
    </div>
    
)

export default Main;
