export const rollDie = function () {
  return Math.floor(Math.random() * 6) + 1
}

export const hitRolls = function (numAttacks, hitChar) {
  let numHitSuccesses = 0
  for (let i = 0; i < numAttacks; i++) {
    if (rollDie() >= hitChar) {
      numHitSuccesses++
    }
  }
  return numHitSuccesses
}

export const woundRolls = function (numHits, woundChar) {
  let numWoundSuccesses = 0
  for (let i = 0; i < numHits; i++) {
    if (rollDie() >= woundChar) {
      numWoundSuccesses++
    }
  }
  return numWoundSuccesses
}

export const saveRolls = function (numWounds, saveChar, rendChar) {
  let numSaveFails = 0
  for (let i = 0; i < numWounds; i++) {
    if (rollDie() <= (saveChar + rendChar)) {
      numSaveFails++
    }
  }
  return numSaveFails
}

export const damageResult = function (numUnsaved, damageChar, fnpChar) {
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

export const average = function (combat) {
  const successChance = function (stat) {
    return 1 - ((stat - 1) / 6)
  }
  let averageDamage = combat.numAttacks * successChance(parseInt(combat.hit)) * successChance(parseInt(combat.wound))
  if (parseInt(combat.armorSave) + parseInt(combat.rend) <= 6) {
    averageDamage = averageDamage * (1 - successChance(parseInt(combat.armorSave) + parseInt(combat.rend)))
  }
  averageDamage = averageDamage * combat.damage
  if (combat.fnp <= 6) {
    averageDamage = averageDamage * (1 - successChance(parseInt(combat.fnp)))
  }
  return averageDamage.toFixed(2)
}

export const rollCombat = function (combat) {
  const numHits = hitRolls(combat.numAttacks, combat.hit)
  const numWounds = woundRolls(numHits, combat.wound)
  const numUnsavedWounds = saveRolls(numWounds, combat.armorSave, combat.rend)
  const damageInflicted = damageResult(numUnsavedWounds, combat.damage, combat.fnp)
  console.log('Final combat damage:' + damageInflicted)
  return damageInflicted
}
