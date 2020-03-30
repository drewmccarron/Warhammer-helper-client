import React, { Component } from 'react'
import { Link } from 'react-router-dom'
// import axios from 'axios'
// import apiUrl from '../../apiConfig'
import { indexCombats } from '../../api/combats'

class Combats extends Component {
  constructor () {
    super()
    this.state = {
      combats: null
    }
  }

  componentDidMount () {
    const { user } = this.props
    indexCombats(user)
    // axios({
    //   url: `${apiUrl}/combats`,
    //   method: 'get',
    //   headers: {
    //     'Authorization': `Bearer ${this.props.user.token}`
    //   }
    // })
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
        <li key={combat.id}>
          <Link to={`/combats/${combat.id}`}>
            {combat.title}
          </Link>
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
      </div>
    )
  }
}

export default Combats
