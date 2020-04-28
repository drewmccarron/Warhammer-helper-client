import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
// import axios from 'axios'
// import apiUrl from '../../apiConfig'
import Button from 'react-bootstrap/Button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import './Home.css'
import messages from '../AutoDismissAlert/messages'
import { indexCombats, createCombat, showCombat, deleteCombat, patchCombat } from '../../api/combats'
import { hitRolls, woundRolls, saveRolls, damageResult, average } from '../../functions/diceRoll'
import { createDataPoint } from '../../functions/graph'

class Combats extends Component {
  constructor () {
    super()
    this.state = {
      // matches the keys of the saved combat profile objetcs
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
      // used for the damage calculator
      hitSuccesses: undefined,
      woundSuccesses: undefined,
      saveFails: undefined,
      finalDamage: undefined,
      averageDamage: undefined,
      // used to refresh the page (mostly the dropdown) after changes
      updated: false,
      // used to check if the page should display roll results
      roll: false,
      data: undefined
    }
  }
  // updates the state when the form values are updated
  handleChange = (event) => {
    let value = event.target.value
    // Converts all string values from the forms into numbers for the calculator
    if (event.target.name !== 'title') {
      value = parseInt(value)
    }
    const createdField = {
      [event.target.name]: value
    }
    // replaces previous state value with the value input into the form
    const editedCombat = Object.assign(this.state.combat, createdField)
    this.setState({ combat: editedCombat })
  }
  // called by selecting a combat profile from the dropdown menu
  // replaces the previous state values with those of the selected profile
  show = () => {
    showCombat(event.target.value)
      .then(res => {
        this.setState({ combat: res.data.combat })
      })
      .catch(console.error)
  }
  // deletes a combat profile
  delete = id => {
    event.preventDefault()
    deleteCombat(this.state.combat._id, this.props.user)
      .then(res => {
        this.setState({ updated: true })
      })
      .then(this.setState({ combat: this.state.combats[0] }))
      .then(() => this.props.msgAlert({
        heading: 'Delete Success',
        message: messages.deleteSuccess,
        variant: 'success'
      }))
      .catch(error => {
        this.props.msgAlert({
          heading: 'Deletion failed with error: ' + error.message,
          message: messages.deleteFailure,
          variant: 'danger'
        })
      })
  }
  // updates a combat profile
  patch = (event) => {
    event.preventDefault()
    patchCombat(this.state.combat, this.state.combat._id, this.props.user)
      .then(res => {
        this.setState({ updated: true })
      })
      .then(() => this.props.msgAlert({
        heading: 'Update Success',
        message: messages.patchSuccess,
        variant: 'success'
      }))
      .catch(error => {
        this.props.msgAlert({
          heading: 'Save failed with error: ' + error.message,
          message: messages.patchFailure,
          variant: 'danger'
        })
      })
  }
  // creates a new combat profile
  create = (event) => {
    event.preventDefault()
    createCombat(this.state.combat, this.props.user)
      .then((response) => {
        this.setState({ updated: true })
      })
      .then(() => this.props.msgAlert({
        heading: 'Save Success',
        message: messages.postSuccess,
        variant: 'success'
      }))
      .catch(error => {
        this.props.msgAlert({
          heading: 'Save failed with error: ' + error.message,
          message: messages.postFailure,
          variant: 'danger'
        })
      })
  }
  // function used for the damage calculator
  roll = event => {
    const { combat } = this.state
    event.preventDefault()
    // the 'roll' value is checked to display the calculated results
    this.setState({ roll: true })
    // pass the attack and hit characteristics into the hit roll function
    const numHits = hitRolls(combat.numAttacks, combat.hit)
    this.setState({ hitSuccesses: numHits })
    // pass the number of successful hits and the wound characteristic into the wound roll function
    const numWounds = woundRolls(numHits, combat.wound)
    this.setState({ woundSuccesses: numWounds })
    // pass the number of successful wounds, armor characteristic, and rend characteristic into the save roll function
    const numUnsavedWounds = saveRolls(numWounds, combat.armorSave, combat.rend)
    this.setState({ saveFails: numUnsavedWounds })
    // pass the number of failed saves, the damage characteristics, and fnp characteristic into the damage function
    const damageInflicted = damageResult(numUnsavedWounds, combat.damage, combat.fnp)
    this.setState({ finalDamage: damageInflicted })
    const averageDamage = average(this.state.combat)
    this.setState({ averageDamage: averageDamage })
    this.setState({ data: createDataPoint() })
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
  // update the dropdown menu on all changes
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
    // if the user is not signed in, display this message instead of the CRUD buttons
    if (!this.props.user) {
      crudButtons = 'Sign in to manage your own profiles'
      // if the selected combat profile belongs to the user, display all of the relevant crud functions
    } else if (this.props.user._id === this.state.combat.owner) {
      crudButtons = (
        // these buttons patch, post, and delete combat profiles, respectively
        <div>
          <Button className='crudButtons' variant="success" size='sm' onClick={this.patch}>Save</Button>
          <Button className='crudButtons' variant="success" size='sm'type="submit">Save As New</Button>
          <Button className='crudButtons' variant="danger" size='sm' onClick={this.delete}>Delete</Button>
        </div>)
    } else {
      // if the selected combat profile does not belong to the user, only display the Post button and don't display the useless Patch and Delete buttons
      crudButtons = (
        <div>
          <Button className='crudButtons' variant="success" size='sm'type="submit">Save As New</Button>
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
        // the value attribute is used to pass the selected combat profile's id to the show function
        <option key={combat._id} value={combat._id}>{combat.title}</option>
      ))

      combatJSX = (
        // call the show() function and update the state on selecting a combat profile
        <form>
          <label id='dropDownMenu'>
            <select onChange={this.show}>
              {combatsList}
            </select>
          </label>
        </form>
      )
    }
    // click the Roll button to call the relevant functions and display the results
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
          <BarChart
            width={500}
            height={300}
            data={this.state.data}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="frequency" fill="#82ca9d" />
          </BarChart>
        </div>
      )
    }
    return (
      <div>
        <h2>Combat Simulator</h2>
        {combatJSX}
        <form onSubmit={this.create}>
          {/* title */}
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
            {/* number of attacks */}
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
            {/* hit characteristic */}
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
            {/* wound characteristic */}
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
            {/* rend characteristic */}
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
            {/* damage characteristic */}
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
            {/* armor characteristic */}
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
          <div title='Set to 7 to disables FNP rolls' className='statInput'>
            {/* FNP characteristic */}
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
        {/* displayed after clicking the roll button */}
        {rollJSX}
      </div>
    )
  }
}

export default Combats
