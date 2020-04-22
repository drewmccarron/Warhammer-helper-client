// the function used to simulate a six-sided die roll
export const rollDie = function () {
  // Return a random number between 0 and 5, then add 1 to get a 1-6 range
  return Math.floor(Math.random() * 6) + 1
}

// The warhammer combat sequence goes likes this:
// 1. For each attack, roll to see if the attack hits. If it does, continue.
// 2. If the attack hits, roll to see if the attack wounds. If it does, continue.
// 3. If the attack wounds, the defending unit rolls to see if they 'save' the attack with their armor. The attacking unit's rend lessens the defender's chance to do an armor save. If the attack is NOT saved, continue.
// 4. If the attack is not saved, the attacker inflicts damage equal to their damage characteristic.
// 5. If the defending unit has an FNP ('Feel no pain') characteristic, for each point of damage inflicted, roll to see if the damage is negated by an FNP save.

// for each attack, check to see if it hits
export const hitRolls = function (numAttacks, hitChar) {
  // the final number of attacks that successfully hit
  let numHitSuccesses = 0
  // attack a number of times equal to the unit's attack characteristic
  for (let i = 0; i < numAttacks; i++) {
    // for each attack, compare a die roll to the unit's hit characteristic. If the roll is greater than or equal to the hit characteristic, the attack successfully hits
    if (rollDie() >= hitChar) {
      // if the attack hits, add 1 to the number of successful hits
      numHitSuccesses++
    }
  }
  // return the number of successful hits
  return numHitSuccesses
}

// for each attack that successfully hits, roll to see if it successfully wounds
export const woundRolls = function (numHits, woundChar) {
  // the final number of attacks that successfully wound
  let numWoundSuccesses = 0
  // attack a number of times equal to the number of successful hits
  for (let i = 0; i < numHits; i++) {
    // for each hit, compare a die roll to the unit's wound characteristic. If the roll is greater than or equal to the wound characteristic, the attack successfully wounds
    if (rollDie() >= woundChar) {
      // if the attack wounds, add 1 to the number of successful wounds
      numWoundSuccesses++
    }
  }
  // return the number of successful wounds
  return numWoundSuccesses
}

// for each attack that successfully wounds, roll to see if it is saved (i.e. negated by the defender's armor)
export const saveRolls = function (numWounds, saveChar, rendChar) {
  // the final number of attacks that are NOT saved
  let numSaveFails = 0
  // roll a number of times equal to the number of successful wounds
  for (let i = 0; i < numWounds; i++) {
    // for each wound, compare a die roll to the defending unit's save characteristic (i.e. armor value) plus the attacking unit's rend characteristic (i.e. armor-piercing value).
    // If the roll is greater than or equal to the modified save characteristic, the attack is successfully saved by the defender's armor. If it the modified save characteristic is LOWER than the die roll, the save fails.
    if (rollDie() < (saveChar + rendChar)) {
      // if the wound is NOT saved, add 1 to the number of failed saves
      numSaveFails++
    }
  }
  // return the number of failed saves
  return numSaveFails
}

// for each failed save, inflict damage equal to the attacker's damage characteristic. Then, if applicable, roll to negate the damage with the defender's FNP characteristic
export const damageResult = function (numUnsaved, damageChar, fnpChar) {
  // the final final damage inflicted before FNP saves
  const startingDamage = numUnsaved * damageChar
  let finalDamage = startingDamage
  // if the defending unit has an FNP save (i.e. 2 <= fnpChar <= 6)
  if (fnpChar < 7) {
    // roll for each damage inflicted
    for (let i = 0; i < startingDamage; i++) {
      // for each damage inflicted, compare a die roll to the defending unit's FNP characteristic. If the roll is greater than or equal to the FNP characteristic, lessen the final inflicted damage by 1 (i.e. negate that point of damage)
      if (rollDie() >= fnpChar) {
        finalDamage--
      }
    }
  }
  // return the final damage after FNP saves
  return finalDamage
}

export const average = function (combat) {
  const successChance = function (stat) {
    return 1 - ((stat - 1) / 6)
  }
  let averageDamage = combat.numAttacks * successChance(combat.hit) * successChance(combat.wound)
  if ((combat.armorSave + combat.rend) <= 6) {
    averageDamage = averageDamage * (1 - successChance(combat.armorSave + combat.rend))
  }
  averageDamage = averageDamage * combat.damage
  if (combat.fnp <= 6) {
    averageDamage = averageDamage * (1 - successChance(combat.fnp))
  }
  return averageDamage.toFixed(2)
}

export const rollCombat = function (combat) {
  const numHits = hitRolls(combat.numAttacks, combat.hit)
  const numWounds = woundRolls(numHits, combat.wound)
  const numUnsavedWounds = saveRolls(numWounds, combat.armorSave, combat.rend)
  const damageInflicted = numUnsavedWounds(numUnsavedWounds, combat.damage, combat.fnp)
  return damageInflicted
}
