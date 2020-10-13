// =======================
// |      Sum Total     |
// \====================|
export function countSum(array) {
  if (!array || !Array.isArray(array)) return

  return (array.length === 0)
    ? 0
    : array[0] + countSum(array.slice(1))
}

// ======================================
// |      Create thousand Separator     |
// \====================================|
function thousandSeparator (num) {
  if (!num || typeof num !== 'number') return

  let numpad = num.toString().split('.')
  numpad[0] = numpad[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")

  return numpad.join('.')
}

// ===================================
// |      Get List All Countries     |
// \=================================|
export function getCountryList (rawData) {
  const tmpCountries = Object.keys(rawData)
  return tmpCountries
}

// ===============================
// |      Get List All Sites     |
// \=============================|
export function getAllSites (rawData) {
  let tmpSites = new Set()
  Object.entries(rawData).map(element => {
    Object.entries(element[1]).map(elem => {
      tmpSites.add(elem[0])
    })
  })

  return [...tmpSites]
}

// ===========================================
// |      Get Total Econsent Vs Uploaded     |
// \=========================================|
// getTotalEconcentVsUploaded
export function getTotalEconsent (rawData) { /* get total consent value */
  let tmpConsentValue = []

  Object.entries(rawData).map(element => {
    Object.entries(element[1]).map(elem => tmpConsentValue.push(elem[1].econsent))
  })

  tmpConsentValue = countSum(tmpConsentValue)

  return thousandSeparator(tmpConsentValue)
}

// =====================================
// |      Get Econsent Vs Uploaded     |
// \===================================|
export function getEconsentVsUploaded (rawData) { /* get eConsent and uploaded for doughnut chart */
  let tmpEconsentVsUploaded = {}
  let tmpResponse = {}

  const prefixKey = {
    econsent: 'eConsent',
    uploaded: 'Uploaded'
  }

  Object.entries(rawData).map(element => {
    Object.entries(element[1]).map(elem => {
      for (const el in elem[1]) {
        if (el === 'econsent' || el === 'uploaded') {
          tmpEconsentVsUploaded[el] = tmpEconsentVsUploaded[el]
            ? [...tmpEconsentVsUploaded[el], elem[1][el]]
            : [elem[1][el]]
        }
      }
    })
  })

  for (const element in tmpEconsentVsUploaded) {
    tmpResponse[prefixKey[element]] = countSum(tmpEconsentVsUploaded[element])
  }

  return tmpResponse
}

// ====================================
// |      Get The average by type     |
// \==================================|
export function getAverage (rawData, type) {
  const tempAverages = {}

  Object.entries(rawData).map(countries => {
    Object.entries(countries[1]).map(sites => {
      let tempValue = (sites[1][type] / sites[1].total) * 100
      tempAverages[type] = tempAverages[type] ? [...tempAverages[type], tempValue] : [tempValue]
    })
  })

  let finalNumber = tempAverages[type].map(num => (isNaN(num) ? 0 : num))

  const sumTotalType = countSum(finalNumber)
  const lengthOfData = tempAverages[type].length
  const averages = parseFloat(sumTotalType / lengthOfData).toFixed(2)

  return averages
}

// =======================================================
// |      Get The average participant status by type     |
// \=====================================================|
export function getAverageParticipantStatus (rawData, type) {
  const tmpAverages = {}

  Object.entries(rawData).map(countries => {
    Object.entries(countries[1]).map(sites => {
      let tmpTotal = sites[1].quiz_completed + sites[1].quiz_incomplete
      let tmpValue = (sites[1][type] / tmpTotal) * 100

      tmpAverages[type] = tmpAverages[type] ? [...tmpAverages[type], tmpValue] : [tmpValue]
    })
  })

  let finalNumber = tmpAverages[type].map(num => (isNaN(num) ? 0 : num))

  const sumtotal = countSum(finalNumber)
  const lengthOfData = tmpAverages[type].length
  const averages = parseFloat(sumtotal / lengthOfData).toFixed(2)

  return averages
}

// ==========================================
// |      Get Most Econsent and Uploaded    |
// \========================================|
export function getMostEconsent (rawData) {
  let mostData = {}
  let tmpArray = []
  let tmpMostEconsent = {}

  Object.entries(rawData).map(countries => {
    const countryName = countries[0]

    Object.entries(countries[1]).map(sites => {
      for (const item in sites[1]) { // eslint-disable-line
        tmpMostEconsent['countries'] = countryName
        tmpMostEconsent['site'] = sites[0]
        tmpMostEconsent['value'] = sites[1]
      }

      tmpArray.push({...tmpMostEconsent})
    })
  })

  let percentageCurrentEconsent = 0
  let percentageLastEconsent = 0
  let mostCurrentEconsent = 0
  let mostLastEconsent = 0
  let percentageCurrentUploaded = 0
  let percentageLastUploaded = 0
  let mostCurrentUploaded = 0
  let mostLastUploaded = 0

  for (let index = 0; index < tmpArray.length; index++) {
    if (index < 1) {
      mostLastEconsent = 0
      mostLastUploaded = 0
      percentageLastEconsent = 0
      percentageLastUploaded = 0
    }

    mostCurrentEconsent = tmpArray[index].value.econsent
    mostCurrentUploaded = tmpArray[index].value.uploaded

    percentageCurrentEconsent = parseFloat((tmpArray[index].value.econsent / tmpArray[index].value.total) * 100)
    percentageCurrentUploaded = parseFloat((tmpArray[index].value.uploaded / tmpArray[index].value.total) * 100)

    if (mostLastEconsent < mostCurrentEconsent) {
      mostData['econsentValue'] = { ...tmpArray[index], value: mostCurrentEconsent }
      mostLastEconsent = mostCurrentEconsent
    }

    if (mostLastUploaded < mostCurrentUploaded) {
      mostData['uploadedValue'] = { ...tmpArray[index], value: mostCurrentUploaded }
      mostLastUploaded = mostCurrentUploaded
    }

    if (percentageLastEconsent < percentageCurrentEconsent) {
      mostData['percentageEconsent'] = { ...tmpArray[index], value: percentageCurrentEconsent }
      percentageLastEconsent = percentageCurrentEconsent
    }

    if (percentageLastUploaded < percentageCurrentUploaded) {
      mostData['percentageUploaded'] = { ...tmpArray[index], value: percentageCurrentUploaded }
      percentageLastUploaded = percentageCurrentUploaded
    }
  }

  return mostData
}
