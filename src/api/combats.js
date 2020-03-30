import apiUrl from '../apiConfig'
import axios from 'axios'

export const indexCombats = user => {
  return axios({
    method: 'GET',
    url: apiUrl + '/combats'
  })
}

export const createCombat = (data, user) => {
  return axios({
    method: 'POST',
    url: apiUrl + '/combats',
    data: {
      combat: {
        title: data.title,
        numAttacks: data.numAttacks,
        hit: data.hit,
        wound: data.wound,
        rend: data.rend,
        damage: data.damage,
        armorSave: data.armorSave,
        fnp: data.fnp
      }
    },
    headers: {
      'Authorization': `Token token=${user.token}`
    }
  })
}
