const rollDie = function () {
  return Math.floor(Math.random() * 6) + 1
}

const hitRolls = function (numAttacks, hitChar) {
  let numHitSuccesses = 0
  for (let i = 0; i < numAttacks; i++) {
    if (rollDie() >= hitChar) {
      numHitSuccesses++
    }
  }
  return numHitSuccesses
}

const woundRolls = function (numHits, woundChar) {
  let numWoundSuccesses = 0
  for (let i = 0; i < numHits; i++) {
    if (rollDie() >= woundChar) {
      numWoundSuccesses++
    }
  }
  return numWoundSuccesses
}

const saveRolls = function (numWounds, saveChar, rendChar) {
  let numSaveFails = 0
  for (let i = 0; i < numWounds; i++) {
    if (rollDie() < (saveChar + rendChar)) {
      numSaveFails++
    }
  }
  return numSaveFails
}

const damageResult = function (numUnsaved, damageChar, fnpChar) {
  const startingDamage = numUnsaved * damageChar
  let finalDamage = startingDamage
  if (fnpChar < 7) {
    for (let i = 0; i < startingDamage; i++) {
      if (rollDie() >= fnpChar) {
        finalDamage--
      }
    }
  }
  return finalDamage
}

const rollCombat = function (combat) {
  const numHits = hitRolls(combat.numAttacks, combat.hit)
  const numWounds = woundRolls(numHits, combat.wound)
  const numUnsavedWounds = saveRolls(numWounds, combat.armorSave, combat.rend)
  const damageInflicted = damageResult(numUnsavedWounds, combat.damage, combat.fnp)
  return damageInflicted
}

// const testCombat = {
//   numAttacks: 20,
//   hit: 3,
//   wound: 3,
//   rend: 1,
//   damage: 2,
//   armorSave: 4,
//   fnp: 7
// }

// const data = []

export const createDataPoint = function (combat) {
  const data = []
  for (let i = 0; i < 100; i++) {
    const combatResult = rollCombat(combat)
    const dataPointExists = data.some(dataPoint => dataPoint.name === combatResult.toString())
    if (dataPointExists) {
      const dataPointIndex = data.findIndex(dataPoint => dataPoint.name === combatResult.toString())
      data[dataPointIndex].frequency++
    } else {
      const newDataPoint = {
        name: combatResult.toString(),
        frequency: 1
      }
      data.push(newDataPoint)
    }
  }
  data.sort((a, b) => (parseInt(a.name) > parseInt(b.name)) ? 1 : -1)
  console.log(data)
  return data
}

createDataPoint()

// console.log(data)