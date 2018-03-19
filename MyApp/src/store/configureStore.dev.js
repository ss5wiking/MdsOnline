import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from '../reducers'
import {persistStore, autoRehydrate} from 'redux-persist'
import { composeWithDevTools } from 'remote-redux-devtools'

const logger = createLogger()
const middlewares = [thunk, logger]
//const devtool = devTools({hostname: 'localhost', port: 5678,secure: false});

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : composeWithDevTools({ realtime: true, port: 5678 });


const configureStore = preloadedState => {
  const store = createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(
      applyMiddleware(...middlewares),
		  autoRehydrate()
    )
  )

  /*if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }*/

  return store
}

export default configureStore
