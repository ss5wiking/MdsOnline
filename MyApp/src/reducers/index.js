import {combineReducers} from 'redux';
import Auth from './auth'
import Lives from './lives'
import tabBar from './tabBar';

const rootReducer = combineReducers({
  Auth,
	tabBar,
  Lives
});

export default rootReducer;
