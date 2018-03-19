import { handleActions } from 'redux-actions';

let initialState = {
	selectedTab: 0,
}
const cart = handleActions({
	changeSelect: (state, action) => ({
		...state,
		selectedTab: action.payload
	})
}, initialState);


export default cart;
