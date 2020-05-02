// the function used to simulate a six-sided die roll
const rollDie = function () {
  // Return a random number between 0 and 5, then add 1 to get a 1-6 range
  return Math.floor(Math.random() * 6) + 1
}

const rerollDie = function (statChar, rerollChar) {
  let alreadyRerolled = false
  let dieRoll = rollDie()
  if (alreadyRerolled === false && dieRoll < 2 && rerollChar === 1) {
    alreadyRerolled = true
    console.log('rerolling 1')
    dieRoll = rollDie()
    console.log(dieRoll)
  } else if (alreadyRerolled === false && dieRoll < statChar && rerollChar === 2) {
    alreadyRerolled = true
    console.log('roll of ' + dieRoll + ' failed. reroll result =')
    dieRoll = rollDie()
    console.log(dieRoll)
  }
  return dieRoll
}
// The warhammer combat sequence goes likes this:
// 1. For each attack, roll to see if the attack hits. If it does, continue.
// 2. If the attack hits, roll to see if the attack wounds. If it does, continue.
// 3. If the attack wounds, the defending unit rolls to see if they 'save' the attack with their armor. The attacking unit's rend lessens the defender's chance to do an armor save. If the attack is NOT saved, continue.
// 4. If the attack is not saved, the attacker inflicts damage equal to their damage characteristic.
// 5. If the defending unit has an FNP ('Feel no pain') characteristic, for each point of damage inflicted, roll to see if the damage is negated by an FNP save.

// for each attack, check to see if it hits
const hitRolls = function (combat) {
  console.log('at hit function')
  // the final number of attacks that successfully hit
  let numHitSuccesses = 0
  // attack a number of times equal to the unit's attack characteristic
  for (let i = 0; i < combat.numAttacks; i++) {
    // for each attack, compare a die roll to the unit's hit characteristic. If the roll is greater than or equal to the hit characteristic, the attack successfully hits
    if (rerollDie(combat.hit, combat.hitReroll) >= combat.hit) {
      // if the attack hits, add 1 to the number of successful hits
      numHitSuccesses++
    }
  }
  // return the number of successful hits
  return numHitSuccesses
}

// for each attack that successfully hits, roll to see if it successfully wounds
const woundRolls = function (numHits, combat) {
  console.log('at wound function')
  // the final number of attacks that successfully wound
  let numWoundSuccesses = 0
  // attack a number of times equal to the number of successful hits
  for (let i = 0; i < numHits; i++) {
    // for each hit, compare a die roll to the unit's wound characteristic. If the roll is greater than or equal to the wound characteristic, the attack successfully wounds
    if (rerollDie(combat.wound, combat.woundReroll) >= combat.wound) {
      // if the attack wounds, add 1 to the number of successful wounds
      numWoundSuccesses++
    }
  }
  // return the number of successful wounds
  return numWoundSuccesses
}

// for each attack that successfully wounds, roll to see if it is saved (i.e. negated by the defender's armor)
const saveRolls = function (numWounds, combat) {
  console.log('at save function')
  // the final number of attacks that are NOT saved
  let numSaveFails = 0
  // roll a number of times equal to the number of successful wounds
  for (let i = 0; i < numWounds; i++) {
    // for each wound, compare a die roll to the defending unit's save characteristic (i.e. armor value) plus the attacking unit's rend characteristic (i.e. armor-piercing value).
    // If the roll is greater than or equal to the modified save characteristic, the attack is successfully saved by the defender's armor. If it the modified save characteristic is LOWER than the die roll, the save fails.
    if (rerollDie(combat.armorSave, combat.armorSaveReroll) < (combat.armorSave + combat.rend)) {
      // if the wound is NOT saved, add 1 to the number of failed saves
      numSaveFails++
    }
  }
  // return the number of failed saves
  return numSaveFails
}

// for each failed save, inflict damage equal to the attacker's damage characteristic. Then, if applicable, roll to negate the damage with the defender's FNP characteristic
const damageResult = function (numUnsaved, combat) {
  console.log('at damage function')
  // the final damage inflicted before FNP saves
  const startingDamage = numUnsaved * combat.damage
  let finalDamage = startingDamage
  // if the defending unit has an FNP save (i.e. 2 <= fnpChar <= 6)
  if (combat.fnp < 7) {
    // roll for each damage inflicted
    for (let i = 0; i < startingDamage; i++) {
      // for each damage inflicted, compare a die roll to the defending unit's FNP characteristic. If the roll is greater than or equal to the FNP characteristic, lessen the final inflicted damage by 1 (i.e. negate that point of damage)
      if (rerollDie(combat.fnp, combat.fnpReroll) >= combat.fnp) {
        finalDamage--
      }
    }
  }
  // return the final damage after FNP saves
  return finalDamage
}

// this function is used to simulate the total combat sequence and return the resulting final damage
const rollCombat = function (combat) {
  const numHits = hitRolls(combat)
  const numWounds = woundRolls(numHits, combat)
  const numUnsavedWounds = saveRolls(numWounds, combat)
  const damageInflicted = damageResult(numUnsavedWounds, combat)
  return damageInflicted
}

const createDataPoint = function (combat) {
  const data = []
  // the sample size for the data
  const numRepeats = 1
  // for each data points, roll for a combat scenario and check the damage
  for (let i = 0; i < numRepeats; i++) {
    const combatResult = rollCombat(combat)
    // check to see if that damage results has occured
    const dataPointExists = data.some(dataPoint => dataPoint.name === combatResult.toString())
    // if the damage result has already occured...
    if (dataPointExists) {
      // increase the frequency of that result by 1 (i.e. the number of times it has occured)
      const dataPointIndex = data.findIndex(dataPoint => dataPoint.name === combatResult.toString())
      data[dataPointIndex].frequency++
      // if the damage result has not yet occured
    } else {
      // create a new data point for that damage result with frequency 1
      const newDataPoint = {
        name: combatResult.toString(),
        frequency: 1
      }
      // add the new datapoint to the data array
      data.push(newDataPoint)
    }
  }
  // sort the data array by damage (e.g. 0, 1, 2, 3... )
  data.sort((a, b) => (parseInt(a.name) > parseInt(b.name)) ? 1 : -1)
  // for each datapoint, add a new 'percentile' key
  data.forEach(function (dataPoint, index) {
    // the total frequencies of all dataPoints in the data array before this one
    let totalFrequency = 0
    // create a new array of all of the dataPoints before this one
    data.slice(0, index).forEach(item => {
      // add the frequencies together
      totalFrequency += item.frequency
    })
    // calculate the total percentile as 100% - (the sum of frequencies / the sample size)
    data[index].percentile = (100 * (1 - (totalFrequency / numRepeats))).toFixed(2)
  })
  console.log(data)
  return data
}

const testCombat = {
  title: '',
  numAttacks: 20,
  hit: 4,
  hitReroll: 2,
  wound: 4,
  woundReroll: 2,
  rend: 1,
  damage: 2,
  armorSave: 5,
  armorSaveReroll: 2,
  fnp: 7,
  fnpReroll: 0
}

createDataPoint(testCombat)
