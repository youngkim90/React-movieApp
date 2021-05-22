import { combineReducers } from 'redux';
// import comment from './comment_reducer'
import user from './user_reducer';

const rootReducer = combineReducers({
    user
})

export default rootReducer