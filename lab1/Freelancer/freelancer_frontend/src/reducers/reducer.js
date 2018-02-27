import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Login from '../components/Login';


const reducer = (state, action) => {
    switch(action.type) {
        case "SUCCESS": 
            console.log("In Reducer's SUCCESS case...");
            <Switch>
                <Route exact path='/login'> component={Login}</Route>
            </Switch>
            break;
    }
}

export default reducer;