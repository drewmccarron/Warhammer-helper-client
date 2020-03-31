import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
// import axios from 'axios'
// import apiUrl from '../../apiConfig'
import { indexCombats, createCombat, showCombat, deleteCombat, patchCombat } from '../../api/combats'
import { rollCombat } from '../../functions/diceRoll'

class Combats extends Component {
  constructor () {
    super()
    this.state = {
      combat: {
        title: '',
        numAttacks: undefined,
        hit: undefined,
        wound: undefined,
        rend: undefined,
        damage: undefined,
        armorSave: undefined,
        fnp: undefined
      },
      created: false
    }
  }

  handleChange = (event) => {
    // 1. Create a new object with key of 'name' property on input, value with 'value' property
    const createdField = {
      [event.target.name]: event.target.value
    }
    // 2. Combine the current `movie` with updatedField
    const editedCombat = Object.assign(this.state.combat, createdField)
    // 3. Set the state
    this.setState({ combat: editedCombat })
  }
  show = id => {
    console.log(event.target.id)
    showCombat(event.target.id)
      .then(res => {
        console.log(res)
        this.setState({ combat: res.data.combat })
      })
      .catch(console.error)
  }

  delete = id => {
    event.preventDefault()
    console.log(event.target.id)
    deleteCombat(event.target.id)
      .then(res => console.log(res))
      .catch(console.error)
  }

  patch = (event) => {
    event.preventDefault()
    patchCombat(this.state.combat, event.target.id)
      .then(res => console.log(res))
      .catch(console.error)
  }

  handleSubmit = (event) => {
    event.preventDefault()
    createCombat(this.state.combat, this.props.user)
      .then((response) => {
        console.log(response)
        this.setState({ created: response.data.combat.id })
      })
      .catch(console.error)
  }

  roll = event => {
    event.preventDefault()
    rollCombat(this.state.combat)
  }
  componentDidMount () {
    const { user } = this.props
    indexCombats(user)
      .then(res => {
        console.log(res)
        this.setState({ combats: res.data.combats })
      })
      .catch(console.error)
  }

  render () {
    let combatJSX
    const { combats } = this.state
    if (!combats) {
      combatJSX = 'Loading...'
    } else if (combats.length === 0) {
      combatJSX = 'No combats yet. Make some!'
    } else {
      const combatsList = combats.map(combat => (
        <li key={combat._id}>
          {combat.title}
          <button type='submit' id={combat._id} onClick={this.show}>Get</button>
          <button type='submit' id={combat._id} onClick={this.delete}>Delete</button>
          <button type='submit' id={combat._id} onClick={this.patch}>Patch</button>
        </li>
      ))

      combatJSX = (
        <ul>
          {combatsList}
        </ul>
      )
    }
    return (
      <div>
        <h1>Combats</h1>
        {combatJSX}

        <form onSubmit={this.handleSubmit}>
          <label>Title</label>
          <input
            placeholder="title"
            name="title"
            value={this.state.combat.title || ''}
            onChange={this.handleChange}
          />
          <label>Attacks</label>
          <input
            placeholder="numAttacks"
            name="numAttacks"
            value={this.state.combat.numAttacks || ''}
            onChange={this.handleChange}
          />
          <label>Hit</label>
          <input
            placeholder="hit"
            name="hit"
            value={this.state.combat.hit || ''}
            onChange={this.handleChange}
          />
          <label>Wound</label>
          <input
            placeholder="wound"
            name="wound"
            value={this.state.combat.wound || ''}
            onChange={this.handleChange}
          />
          <label>Rend</label>
          <input
            placeholder="rend"
            name="rend"
            value={this.state.combat.rend || ''}
            onChange={this.handleChange}
          />
          <label>Damage</label>
          <input
            placeholder="damage"
            name="damage"
            value={this.state.combat.damage || ''}
            onChange={this.handleChange}
          />
          <label>Armor</label>
          <input
            placeholder="armorSave"
            name="armorSave"
            value={this.state.combat.armorSave || ''}
            onChange={this.handleChange}
          />
          <label>FNP</label>
          <input
            placeholder="fnp"
            name="fnp"
            value={this.state.combat.fnp || ''}
            onChange={this.handleChange}
          />
          <button type="submit">Submit</button>
        </form>
        <button onClick={this.roll}>Roll</button>
      </div>
    )
  }
}

export default Combats
