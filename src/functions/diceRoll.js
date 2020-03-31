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
  console.log('Total hits:' + numHitSuccesses)
  return numHitSuccesses
}

export const woundRolls = function (numHits, woundChar) {
  let numWoundSuccesses = 0
  for (let i = 0; i < numHits; i++) {
    if (rollDie() >= woundChar) {
      numWoundSuccesses++
    }
  }
  console.log('Total wounds:' + numWoundSuccesses)
  return numWoundSuccesses
}

export const saveRolls = function (numWounds, saveChar, rendChar) {
  let numSaveFails = 0
  for (let i = 0; i < numWounds; i++) {
    if (rollDie() <= (saveChar + rendChar)) {
      numSaveFails++
    }
  }
  console.log('Total unsaved wounds:' + numSaveFails)
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
  console.log('Damage before FNP:' + startingDamage)
  console.log('Damage after FNP:' + finalDamage)
  return finalDamage
}

export const rollCombat = function (combat) {
  const numHits = hitRolls(combat.numAttacks, combat.hit)
  const numWounds = woundRolls(numHits, combat.wound)
  const numUnsavedWounds = saveRolls(numWounds, combat.armorSave, combat.rend)
  const damageInflicted = damageResult(numUnsavedWounds, combat.damage, combat.fnp)
  console.log('Final combat damage:' + damageInflicted)
  return damageInflicted
}
