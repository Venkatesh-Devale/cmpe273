import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import Userhome from './Userhome';
import Dashboard from './Dashboard';

const Main = () => (
    <div> 
        
        <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/login' component={Login} />
            <Route path='/signup' component={Signup} />
            <Route path='/dashboard' component={Dashboard} />
            <Route path='/userhome' component={Userhome} />
            
        </Switch>
    
    </div>
    
)

export default Main;
