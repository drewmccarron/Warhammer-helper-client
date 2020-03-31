import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
// import axios from 'axios'
// import apiUrl from '../../apiConfig'
import { indexCombats, createCombat, showCombat, deleteCombat, patchCombat } from '../../api/combats'
import { hitRolls, woundRolls, saveRolls, damageResult } from '../../functions/diceRoll'

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
      hitSuccesses: undefined,
      woundSuccesses: undefined,
      saveFails: undefined,
      finalDamage: undefined,
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
    console.log(this.state.combat)
  }
  show = () => {
    console.log(event.target.value)
    showCombat(event.target.value)
      .then(res => {
        console.log(res)
        console.log(this.state.combat)
        this.setState({ combat: res.data.combat })
        console.log(this.state.combat)
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

  create = (event) => {
    event.preventDefault()
    createCombat(this.state.combat, this.props.user)
      .then((response) => {
        console.log(response)
        this.setState({ created: response.data.combat.id })
      })
      .catch(console.error)
  }

  roll = event => {
    const { combat } = this.state
    event.preventDefault()
    const numHits = hitRolls(combat.numAttacks, combat.hit)
    this.setState({ hitSuccesses: numHits })
    const numWounds = woundRolls(numHits, combat.wound)
    this.setState({ woundSuccesses: numWounds })
    const numUnsavedWounds = saveRolls(numWounds, combat.armorSave, combat.rend)
    this.setState({ saveFails: numUnsavedWounds })
    const damageInflicted = damageResult(numUnsavedWounds, combat.damage, combat.fnp)
    this.setState({ finalDamage: damageInflicted })
    console.log(this.state)
  }
  componentDidMount () {
    const { user } = this.props
    indexCombats(user)
      .then(res => {
        this.setState({ combats: res.data.combats })
      })
      .catch(console.error)
  }

  render () {
    let combatJSX
    const { combats, hitSuccesses, woundSuccesses, saveFails, finalDamage } = this.state
    if (!combats) {
      combatJSX = 'Loading...'
    } else if (combats.length === 0) {
      combatJSX = 'No combats yet. Make some!'
    } else {
      const combatsList = combats.map(combat => (
        <option key={combat._id} value={combat._id}>{combat.title}</option>
      ))

      combatJSX = (
        <form>
          <label>
            <select onChange={this.show}>
              {combatsList}
            </select>
          </label>
        </form>
      )
    }
    const rollJSX = (
      <div>
        <h3>Hits</h3>
        {hitSuccesses}
        <h3>Wounds</h3>
        {woundSuccesses}
        <h3>Unsaved Wounds</h3>
        {saveFails}
        <h3>Damage Inflicted</h3>
        {finalDamage}
      </div>
    )
    return (
      <div>
        <h1>Combats</h1>
        {combatJSX}

        <form onSubmit={this.create}>
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
        {rollJSX}
      </div>
    )
  }
}

export default Combats
