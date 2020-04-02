import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
// import axios from 'axios'
// import apiUrl from '../../apiConfig'
import Button from 'react-bootstrap/Button'
import './Home.css'
import messages from '../AutoDismissAlert/messages'
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
    let value = event.target.value
    if (event.target.name !== 'title') {
      value = parseInt(value)
    }
    const createdField = {
      [event.target.name]: value
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
    deleteCombat(this.state.combat._id, this.props.user)
      .then(res => {
        console.log(res)
        this.setState({ updated: true })
      })
      .then(this.setState({ combat: this.state.combats[0] }))
      .then(() => this.props.msgAlert({
        heading: 'Delete Success',
        message: messages.deleteSuccess,
        variant: 'success'
      }))
      .catch(console.error)
  }

  patch = (event) => {
    event.preventDefault()
    patchCombat(this.state.combat, this.state.combat._id, this.props.user)
      .then(res => {
        console.log(res)
        this.setState({ updated: true })
      })
      .then(() => this.props.msgAlert({
        heading: 'Update Success',
        message: messages.patchSuccess,
        variant: 'success'
      }))
      .catch(console.error)
  }

  create = (event) => {
    event.preventDefault()
    createCombat(this.state.combat, this.props.user)
      .then((response) => {
        console.log(response)
        this.setState({ updated: true })
      })
      .then(() => this.props.msgAlert({
        heading: 'Save Success',
        message: messages.postSuccess,
        variant: 'success'
      }))
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
    let crudButtons
    if (!this.props.user) {
      crudButtons = 'Sign in to manage your own profiles'
    } else {
      crudButtons = (
        <div>
          <Button className='crudButtons' variant="success" size='sm' onClick={this.patch}>Save</Button>
          <Button className='crudButtons' variant="success" size='sm'type="submit">Save As New</Button>
          <Button className='crudButtons' variant="danger" size='sm' onClick={this.delete}>Delete</Button>
        </div>)
    }

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
          <label id='dropDownMenu'>
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
        <div id='rollBox'>
          <div className='rollResult'>
            <h4>Hits</h4>
            {hitSuccesses}
          </div>
          <div className='rollResult'>
            <h4>Wounds</h4>
            {woundSuccesses}
          </div>
          <div className='rollResult'>
            <h4>Unsaved</h4>
            {saveFails}
          </div>
          <div className='rollResult'>
            <h4>Damage</h4>
            {finalDamage}
          </div>
          <div className='rollResult'>
            <h4>Average</h4>
            {averageDamage}
          </div>
        </div>
      )
    }
    return (
      <div>
        <h2>Combat Simulator</h2>
        {combatJSX}
        <form onSubmit={this.create}>
          <div id='titleInput'>
            <input
              placeholder="title"
              name="title"
              type='text'
              value={this.state.combat.title || ''}
              onChange={this.handleChange}
            />
            {crudButtons}
          </div>
          <div id='firstStatInput' className='statInput'>
            <label>Attacks</label>
            <br></br>
            <input
              placeholder="numAttacks"
              name="numAttacks"
              type='number'
              min='1'
              max='200'
              value={this.state.combat.numAttacks || ''}
              onChange={this.handleChange}
            />
          </div>
          <div className='statInput'>
            <label>Hit</label>
            <br></br>
            <input
              placeholder="hit"
              name="hit"
              type='number'
              min='2'
              max='6'
              value={this.state.combat.hit || ''}
              onChange={this.handleChange}
            />
          </div>
          <div className='statInput'>
            <label>Wound</label>
            <br></br>
            <input
              placeholder="wound"
              name="wound"
              type='number'
              min='2'
              max='6'
              value={this.state.combat.wound || ''}
              onChange={this.handleChange}
            />
          </div>
          <div className='statInput'>
            <label>Rend</label>
            <br></br>
            <input
              placeholder="n/a"
              name="rend"
              type='number'
              min='0'
              max='6'
              value={this.state.combat.rend || ''}
              onChange={this.handleChange}
            />
          </div>
          <div className='statInput'>
            <label>Damage</label>
            <br></br>
            <input
              placeholder="damage"
              name="damage"
              type='number'
              min='1'
              max='6'
              value={this.state.combat.damage || ''}
              onChange={this.handleChange}
            />
          </div>
          <div className='statInput'>
            <label>Armor</label>
            <br></br>
            <input
              placeholder="armorSave"
              name="armorSave"
              type='number'
              min='2'
              max='7'
              value={this.state.combat.armorSave || ''}
              onChange={this.handleChange}
            />
          </div>
          <div className='statInput'>
            <label>FNP</label>
            <br></br>
            <input
              placeholder="fnp"
              name="fnp"
              type='number'
              min='2'
              max='7'
              value={this.state.combat.fnp || ''}
              onChange={this.handleChange}
            />
          </div>
        </form>
        <Button id='rollButton' onClick={this.roll}>Roll</Button>
        {rollJSX}
      </div>
    )
  }
}

export default Combats
