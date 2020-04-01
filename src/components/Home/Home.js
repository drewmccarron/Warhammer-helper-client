import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
// import axios from 'axios'
// import apiUrl from '../../apiConfig'
import { indexCombats, createCombat, showCombat, deleteCombat, patchCombat } from '../../api/combats'
import { hitRolls, woundRolls, saveRolls, damageResult, average } from '../../functions/diceRoll'

class Combats extends Component {
  constructor () {
    super()
    this.state = {
      combat: {
        title: '',
        _id: undefined,
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
      averageDamage: undefined,
      updated: false,
      roll: false
    }
  }

  handleChange = (event) => {
    const createdField = {
      [event.target.name]: event.target.value
    }
    const editedCombat = Object.assign(this.state.combat, createdField)
    this.setState({ combat: editedCombat })
  }
  show = () => {
    showCombat(event.target.value)
      .then(res => {
        this.setState({ combat: res.data.combat })
        console.log(this.state)
      })
      .catch(console.error)
  }

  delete = id => {
    event.preventDefault()
    deleteCombat(this.state.combat._id)
      .then(res => {
        console.log(res)
        this.setState({ updated: true })
      })
      .then(this.setState({ combat: this.state.combats[0] }))
      .catch(console.error)
  }

  patch = (event) => {
    event.preventDefault()
    patchCombat(this.state.combat, this.state.combat._id)
      .then(res => {
        console.log(res)
        this.setState({ updated: true })
      })
      .catch(console.error)
  }

  create = (event) => {
    event.preventDefault()
    createCombat(this.state.combat, this.props.user)
      .then((response) => {
        console.log(response)
        this.setState({ updated: true })
      })
      .catch(console.error)
  }

  roll = event => {
    const { combat } = this.state
    event.preventDefault()
    this.setState({ roll: true })
    const numHits = hitRolls(combat.numAttacks, combat.hit)
    this.setState({ hitSuccesses: numHits })
    const numWounds = woundRolls(numHits, combat.wound)
    this.setState({ woundSuccesses: numWounds })
    const numUnsavedWounds = saveRolls(numWounds, combat.armorSave, combat.rend)
    this.setState({ saveFails: numUnsavedWounds })
    const damageInflicted = damageResult(numUnsavedWounds, combat.damage, combat.fnp)
    this.setState({ finalDamage: damageInflicted })
    const averageDamage = average(this.state.combat)
    this.setState({ averageDamage: averageDamage })
  }
  componentDidMount () {
    const { user } = this.props
    indexCombats(user)
      .then(res => {
        this.setState({ combats: res.data.combats })
        this.setState({ combat: this.state.combats[0] })
      })
      .catch(console.error)
  }
  componentDidUpdate () {
    const { user } = this.props
    if (this.state.updated) {
      indexCombats(user)
        .then(res => {
          this.setState({ combats: res.data.combats })
          this.setState({ updated: false })
        })
        .catch(console.error)
    }
  }

  render () {
    let combatJSX
    const { combats, hitSuccesses, woundSuccesses, saveFails, finalDamage, averageDamage } = this.state
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
    let rollJSX
    if (this.state.roll) {
      rollJSX = (
        <div>
          <h3>Hits</h3>
          {hitSuccesses}
          <h3>Wounds</h3>
          {woundSuccesses}
          <h3>Unsaved Wounds</h3>
          {saveFails}
          <h3>Damage Inflicted</h3>
          {finalDamage}
          <h3>Average Damage</h3>
          {averageDamage}
        </div>
      )
    }
    return (
      <div>
        <h1>Combats</h1>
        {combatJSX}
        <button onClick={this.patch}>Patch</button>
        <button onClick={this.delete}>Delete</button>
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
            type='number'
            min='1'
            max='200'
            value={this.state.combat.numAttacks || ''}
            onChange={this.handleChange}
          />
          <label>Hit</label>
          <input
            placeholder="hit"
            name="hit"
            type='number'
            min='2'
            max='6'
            value={this.state.combat.hit || ''}
            onChange={this.handleChange}
          />
          <label>Wound</label>
          <input
            placeholder="wound"
            name="wound"
            type='number'
            min='2'
            max='6'
            value={this.state.combat.wound || ''}
            onChange={this.handleChange}
          />
          <label>Rend</label>
          <input
            placeholder="rend"
            name="rend"
            type='number'
            min='0'
            max='6'
            value={this.state.combat.rend || ''}
            onChange={this.handleChange}
          />
          <label>Damage</label>
          <input
            placeholder="damage"
            name="damage"
            type='number'
            min='1'
            max='6'
            value={this.state.combat.damage || ''}
            onChange={this.handleChange}
          />
          <label>Armor</label>
          <input
            placeholder="armorSave"
            name="armorSave"
            type='number'
            min='2'
            max='7'
            value={this.state.combat.armorSave || ''}
            onChange={this.handleChange}
          />
          <label>FNP</label>
          <input
            placeholder="fnp"
            name="fnp"
            type='number'
            min='2'
            max='7'
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
