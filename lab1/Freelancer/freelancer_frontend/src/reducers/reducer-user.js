const initialState = {
    token : null,
    success : null,
    
    error : null
}

const reducer = (state = initialState, action) => {
    if(action.type === 'SIGNUP_SUCCESS'){

        return{
            token: 'new token value',
            success : action.payload.data
        }
        
    }

    if(action.type === 'LOGIN_SUCCESS'){

        return{
            token: 'new token value',
            success : action.payload.data
        }
        
    }
    

    if(action.type === 'ERROR'){
        return{
            error : 'ERROR'
        }
    }

    return state;
}

export default reducer;