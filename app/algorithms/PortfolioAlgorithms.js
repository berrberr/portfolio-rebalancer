export function getPortfolioWithNormalizedAllocations( portfolio ) {
  let totalAllocation = 0;
  for (let security of portfolio) {
    totalAllocation += security.allocation;
  }
  if ( totalAllocation !== 100 ) {
    let normalizationScore = 100 / totalAllocation;
    for (let security of portfolio) {
      security.allocation *= normalizationScore;
    }
  }
  return portfolio;
}

function sortValuePerSecurityAscending( security1, security2 ) {
  if ( security1[ 1 ] === security2[ 1 ] ) {
    return 0;
  } else {
    return (security1[ 1 ] > security2[ 1 ]) ? 1 : -1;
  }
}
;

function sortValuePerSecurityDescending( security1, security2 ) {
  if ( security1[ 1 ] === security2[ 1 ] ) {
    return 0;
  } else {
    return (security1[ 1 ] < security2[ 1 ]) ? 1 : -1;
  }
}
;

export function getValuesForInvesting( investmentAmount, valuePerSecurityCurrent, valuePerSecurityTotal ) {
  let valueDifferencePerSecurity = getValueDifferencePerSecurityWithIndex( valuePerSecurityCurrent, valuePerSecurityTotal );
  valueDifferencePerSecurity.sort( sortValuePerSecurityAscending );

  let cashRemainingToSpend = investmentAmount;
  let valueAdditionPerSecurity = [];
  for (let i = 0; i < valueDifferencePerSecurity.length; i++) {
    valueAdditionPerSecurity.push( 0 );
  }
  let additionPerSecurity;
  while (cashRemainingToSpend > 0 && additionPerSecurity != 0) {
    let lastSecurityToAddToIndex = 0;
    let additionPerSecurity = 0;
    while (valueDifferencePerSecurity[ lastSecurityToAddToIndex + 1 ] != null && valueDifferencePerSecurity[ lastSecurityToAddToIndex ][ 1 ] == valueDifferencePerSecurity[ lastSecurityToAddToIndex + 1 ][ 1 ]) {
      lastSecurityToAddToIndex++;
    }
    if ( valueDifferencePerSecurity[ lastSecurityToAddToIndex + 1 ] != null ) {
      let valueDifference = Math.abs( valueDifferencePerSecurity[ lastSecurityToAddToIndex ][ 1 ] - valueDifferencePerSecurity[ lastSecurityToAddToIndex + 1 ][ 1 ] );
      additionPerSecurity = Math.min( cashRemainingToSpend / (lastSecurityToAddToIndex + 1), valueDifference );
    } else {
      additionPerSecurity = cashRemainingToSpend / (lastSecurityToAddToIndex + 1);
    }
    for (let currentSecurityToAddTo = 0; currentSecurityToAddTo <= lastSecurityToAddToIndex; currentSecurityToAddTo++) {
      valueDifferencePerSecurity[ currentSecurityToAddTo ][ 1 ] += additionPerSecurity;
      valueAdditionPerSecurity[ valueDifferencePerSecurity[ currentSecurityToAddTo ][ 0 ] ] += additionPerSecurity;
      cashRemainingToSpend -= additionPerSecurity;
    }
  }
  return valueAdditionPerSecurity;
}
;

export function getValuesForDisvesting( investmentAmount, valuePerSecurityCurrent, valuePerSecurityTotal ) {
  let valueDifferencePerSecurity = getValueDifferencePerSecurityWithIndex( valuePerSecurityCurrent, valuePerSecurityTotal );
  valueDifferencePerSecurity.sort( sortValuePerSecurityDescending );

  let cashRemainingToGet = -1 * investmentAmount;
  let valueReductionPerSecurity = [];
  for (let i = 0; i < valueDifferencePerSecurity.length; i++) {
    valueReductionPerSecurity.push( 0 );
  }
  let reductionPerSecurity;
  while (cashRemainingToGet > 0 && reductionPerSecurity != 0) {
    let lastSecurityToRemoveFromIndex = 0;
    let reductionPerSecurity = 0;
    while (valueDifferencePerSecurity[ lastSecurityToRemoveFromIndex + 1 ] != null && valueDifferencePerSecurity[ lastSecurityToRemoveFromIndex ][ 1 ] == valueDifferencePerSecurity[ lastSecurityToRemoveFromIndex + 1 ][ 1 ]) {
      lastSecurityToRemoveFromIndex++;
    }
    if ( valueDifferencePerSecurity[ lastSecurityToRemoveFromIndex + 1 ] != null ) {
      let valueDifference = Math.abs( valueDifferencePerSecurity[ lastSecurityToRemoveFromIndex ][ 1 ] - valueDifferencePerSecurity[ lastSecurityToRemoveFromIndex + 1 ][ 1 ] );
      reductionPerSecurity = Math.min( cashRemainingToGet / (lastSecurityToRemoveFromIndex + 1), valueDifference );
    } else {
      reductionPerSecurity = cashRemainingToGet / (lastSecurityToRemoveFromIndex + 1);
    }
    for (let currentSecurityToAddTo = 0; currentSecurityToAddTo <= lastSecurityToRemoveFromIndex; currentSecurityToAddTo++) {
      valueDifferencePerSecurity[ currentSecurityToAddTo ][ 1 ] -= reductionPerSecurity;
      valueReductionPerSecurity[ valueDifferencePerSecurity[ currentSecurityToAddTo ][ 0 ] ] -= reductionPerSecurity;
      cashRemainingToGet -= reductionPerSecurity;
    }
  }
  return valueReductionPerSecurity;
}
;

export function getUpdatedValuePerSecurityForAdditions( valuePerSecurityCurrent, unitsAdditionPerSecurity, portfolio ) {
  let updatedValuePerSecurityArray = valuePerSecurityCurrent.slice( 0 );
  for (let i = 0; i < updatedValuePerSecurityArray.length; i++) {
    updatedValuePerSecurityArray[ i ] += unitsAdditionPerSecurity[ i ] * portfolio[ i ].price;
  }
  return updatedValuePerSecurityArray;
}
;

export function getUpdatedValuePerSecurityForReductions( valuePerSecurityCurrent, unitsReductionPerSecurity, portfolio ) {
  let updatedValuePerSecurityArray = valuePerSecurityCurrent.slice( 0 );
  for (let i = 0; i < updatedValuePerSecurityArray.length; i++) {
    updatedValuePerSecurityArray[ i ] -= unitsReductionPerSecurity[ i ] * portfolio[ i ].price;
  }
  return updatedValuePerSecurityArray;
}
;

export function getValueDifferencePerSecurity( valuePerSecurityCurrent, valuePerSecurityTotal ) {
  let valueDifferencePerSecurity = [];
  for (let i = 0; i < valuePerSecurityCurrent.length; i++) {
    valueDifferencePerSecurity.push( valuePerSecurityCurrent[ i ] - valuePerSecurityTotal[ i ] );
  }
  return valueDifferencePerSecurity;
}
;

export function getValueAdjustmentsPerSecurity( valuePerSecurityCurrent, valuePerSecurityTotal ) {
  let valueDifferencePerSecurity = [];
  for (let i = 0; i < valuePerSecurityCurrent.length; i++) {
    valueDifferencePerSecurity.push( valuePerSecurityTotal[ i ] - valuePerSecurityCurrent[ i ] );
  }
  return valueDifferencePerSecurity;
}
;

function getValuePerSecurityWithIndex( valuePerSecurity ) {
  let valuePerSecurityWithInde = [];
  for (let i = 0; i < valuePerSecurity.length; i++) {
    valuePerSecurityWithInde.push( [
      i,
      valuePerSecurity[ i ]
    ] );
  }
  return valuePerSecurityWithInde;
}

export function getValueDifferencePerSecurityWithIndex( valuePerSecurityCurrent, valuePerSecurityTotal ) {
  let valueDifferencePerSecurity = [];
  for (let i = 0; i < valuePerSecurityTotal.length; i++) {
    valueDifferencePerSecurity.push( [
      i,
      valuePerSecurityCurrent[ i ] - valuePerSecurityTotal[ i ]
    ] );
  }
  return valueDifferencePerSecurity;
}
;

export function getUnitsForValuePerSecurityAndExtraCash( valuePerSecurity, portfolio ) {
  let unitsForValuePerSecurity = [];
  let units = 0;
  let wholeUnits = 0;
  let extraCash = 0;
  for (let i = 0; i < valuePerSecurity.length; i++) {
    units = valuePerSecurity[ i ] / portfolio[ i ].price;
    if ( units >= 0 ) {
      wholeUnits = Math.floor( valuePerSecurity[ i ] / portfolio[ i ].price );
    } else {
      wholeUnits = Math.ceil( valuePerSecurity[ i ] / portfolio[ i ].price );
    }
    unitsForValuePerSecurity.push( wholeUnits )
    extraCash += (units - wholeUnits) * portfolio[ i ].price;
  }
  return {
    unitsForValuePerSecurity,
    extraCash
  };
}

export function getUnitsForInvesting( valueAdditionPerSecurity, portfolio, investmentAmount ) {
  let unitsAdditionPerSecurity = [];
  let currentCash = investmentAmount;
  let index = 0;
  while (index < valueAdditionPerSecurity.length && currentCash > 0) {
    let wholeUnits = Math.floor( valueAdditionPerSecurity[ index ] / portfolio[ index ].price );
    let maxPurchaseableUnits = Math.floor( currentCash / portfolio[ index ].price );
    let purchasedUnits = Math.min( wholeUnits, maxPurchaseableUnits );
    currentCash -= purchasedUnits * portfolio[ index ].price;
    unitsAdditionPerSecurity[ index ] = purchasedUnits;
    index++;
  }
  return {
    unitsAdditionPerSecurity,
    extraCash: currentCash
  };
}

export function getUnitsForDisvesting( valueReductionPerSecurity, portfolio, disvestmentAmount ) {
  let unitsReductionPerSecurity = [];
  let currentCash = disvestmentAmount;
  let index = 0;
  while (index < valueReductionPerSecurity.length && currentCash < 0) {
    let wholeUnits = Math.abs( Math.floor( valueReductionPerSecurity[ index ] / portfolio[ index ].price ) );
    let maxSellableUnits = Math.abs( Math.floor( currentCash / portfolio[ index ].price ) );
    let soldUnits = Math.min( wholeUnits, maxSellableUnits );
    currentCash += soldUnits * portfolio[ index ].price;
    unitsReductionPerSecurity[ index ] = soldUnits;
    index++;
  }
  return {
    unitsReductionPerSecurity,
    extraCash: currentCash
  };
}


export function getUnitsForAdjusting( valuePerSecurity, portfolio ) {
  let valuePerSecurityWithIndex = getValuePerSecurityWithIndex( valuePerSecurity );
  valuePerSecurityWithIndex.sort( sortValuePerSecurityAscending );

  let unitsAdjustmentsPerSecurity = [];
  let currentCash = 0;
  for (let i = 0; i < valuePerSecurityWithIndex.length; i++) {
    if ( valuePerSecurityWithIndex[ i ][ 1 ] < 0 ) {
      let soldUnits = Math.ceil( valuePerSecurityWithIndex[ i ][ 1 ] / portfolio[ i ].price );
      currentCash += soldUnits * -portfolio[ i ].price;
      unitsAdjustmentsPerSecurity[ valuePerSecurityWithIndex[ i ][ 0 ] ] = soldUnits;
    } else if ( valuePerSecurityWithIndex[ i ][ 1 ] > 0 ) {
      if ( currentCash < 0 ) {
        break;
      }
      let wholeUnits = Math.floor( valuePerSecurityWithIndex[ i ][ 1 ] / portfolio[ i ].price );
      let maxPurchaseableUnits = Math.floor( currentCash / portfolio[ i ].price );
      let purchasedUnits = Math.floor( wholeUnits, maxPurchaseableUnits );
      currentCash -= purchasedUnits * portfolio[ i ].price;
      unitsAdjustmentsPerSecurity[ valuePerSecurityWithIndex[ i ][ 0 ] ] = purchasedUnits;
    }
  }
  return {
    unitsAdjustmentsPerSecurity,
    extraCash: currentCash
  };
}