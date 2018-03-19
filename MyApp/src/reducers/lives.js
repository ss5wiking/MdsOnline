import { handleActions } from 'redux-actions'

const defaultState = {
  recommend_keywords: [],
  recommend_lives: [],
  items: []
}

const lives = handleActions({
   HOME_SUCCESS: (state, action) => ({...state,
     recommend_keywords: action.payload.keywords,
     recommend_lives: action.payload.lives
   })
}, defaultState)

export default lives
