import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
// import axios from 'axios'
// import apiUrl from '../../apiConfig'
import { indexCombats, createCombat, showCombat } from '../../api/combats'

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
        <li key={combat._id} id={combat._id} onClick={this.show}>
          {combat.title}
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
            defaultValue={''}
            onChange={this.handleChange}
          />
          <label>Attacks</label>
          <input
            placeholder="numAttacks"
            name="numAttacks"
            defaultValue={''}
            onChange={this.handleChange}
          />
          <label>Hit</label>
          <input
            placeholder="hit"
            name="hit"
            defaultValue={''}
            onChange={this.handleChange}
          />
          <label>Wound</label>
          <input
            placeholder="wound"
            name="wound"
            defaultValue={''}
            onChange={this.handleChange}
          />
          <label>Rend</label>
          <input
            placeholder="rend"
            name="rend"
            defaultValue={''}
            onChange={this.handleChange}
          />
          <label>Damage</label>
          <input
            placeholder="damage"
            name="damage"
            defaultValue={''}
            onChange={this.handleChange}
          />
          <label>Armor</label>
          <input
            placeholder="armorSave"
            name="armorSave"
            defaultValue={''}
            onChange={this.handleChange}
          />
          <label>FNP</label>
          <input
            placeholder="fnp"
            name="fnp"
            defaultValue={''}
            onChange={this.handleChange}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    )
  }
}

export default Combats
