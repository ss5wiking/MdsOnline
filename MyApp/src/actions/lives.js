import api from '@/api'
import { createAction } from 'redux-actions'
import axios from 'axios'

export const loadLivesHome = createAction('HOME_SUCCESS', (items) => items)

export const fetchLivesHome = () => (dispatch, getState) => {
  axios.get(api.streamHomePath).then((response) =>{
    const result = response.data
    if(result.status == "success"){
      return dispatch(loadLivesHome(result.data))
    }else {
      return createAction('HOME_FAILURE')
    }
  })
}
