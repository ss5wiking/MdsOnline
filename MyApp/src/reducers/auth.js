import { handleActions } from 'redux-actions'

const defaultStatus = { tokens: {} }

const Auth = handleActions({
    AUTH_LOAD: (state, action) => ({
    tokens: action.playload.tokens
  })
}, defaultStatus)

export default Auth
