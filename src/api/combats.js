import apiUrl from '../apiConfig'
import axios from 'axios'

export const indexCombats = user => {
  return axios({
    method: 'GET',
    url: apiUrl + '/combats',
    headers: {
      'Authorization': `Token token=${user.token}`
    }
  })
}
