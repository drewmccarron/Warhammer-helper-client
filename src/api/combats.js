import apiUrl from '../apiConfig'
import axios from 'axios'

export const indexCombats = user => {
  return axios({
    method: 'GET',
    url: apiUrl + '/combats'
  })
}

export const showCombat = id => {
  return axios({
    method: 'GET',
    url: apiUrl + '/combats/' + id
  })
}

export const deleteCombat = (id, user) => {
  return axios({
    method: 'DELETE',
    url: apiUrl + '/combats/' + id,
    headers: {
      'Authorization': `Token token=${user.token}`
    }
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
        hitReroll: data.hitReroll,
        wound: data.wound,
        woundReroll: data.woundReroll,
        rend: data.rend,
        damage: data.damage,
        armorSave: data.armorSave,
        armorSaveReroll: data.armorSaveReroll,
        fnp: data.fnp,
        fnpReroll: data.fnpReroll
      }
    },
    headers: {
      'Authorization': `Token token=${user.token}`
    }
  })
}

export const patchCombat = (data, id, user) => {
  return axios({
    method: 'PATCH',
    url: apiUrl + '/combats/' + id,
    data: {
      combat: {
        title: data.title,
        numAttacks: data.numAttacks,
        hit: data.hit,
        hitReroll: data.hitReroll,
        wound: data.wound,
        woundReroll: data.woundReroll,
        rend: data.rend,
        damage: data.damage,
        armorSave: data.armorSave,
        armorSaveReroll: data.armorSaveReroll,
        fnp: data.fnp,
        fnpReroll: data.fnpReroll
      }
    },
    headers: {
      'Authorization': `Token token=${user.token}`
    }
  })
}
