const removeNullObj = (obj) => {
  return Object.keys(obj).reduce((acc, current) => {
    if (obj[current] !== null) {
      return { ...acc, [current]: obj[current] }
    }
    return acc
  }, {})
}

//---------------------------------------------

const mapObj = function (obj, callback) {
  let result = {}

  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof callback === 'function') {
        result[key] = callback.call(obj, obj[key], key, obj)
      }
    }
  }

  return result
}

//---------------------------------------------

function parseDate(date = null, time = null) {
  const dateInputMentah = 'Date @ 20/05/2024 15:30'
  const dateInput = '20/05/2022 15:30'

  let d = new Date()

  if (date) {
    const dateSplit = date.split(' ')
    let alldate = dateSplit[0].split('/')
    d.setDate(alldate[0])
    d.setMonth(alldate[1] - 1)
    alldate.length >= 3 ? d.setFullYear(alldate[2]) : null

    if (dateSplit.length > 1) {
      let allTime = dateSplit[1].split(':')
      d.setHours(allTime[0])
      d.setMinutes(allTime[1])
    }
  }

  if (time) {
    let allTime = time.split(':')
    d.setHours(allTime[0])
    d.setMinutes(allTime[1])
  }

  return d
}

//============================================
//
function getDateTime(date) {
  const d = new Date(date)
  // const d = d;
  let yyyy = d.getFullYear()
  let mm = d.getMonth() + 1 // month is zero-based
  let dd = d.getDate()
  let HH = d.getHours()
  let m = d.getMinutes()
  let getTime = d.getTime()

  if (dd < 10) dd = '0' + dd
  if (mm < 10) mm = '0' + mm

  const formatted = dd + '/' + mm + '/' + yyyy + ' ' + HH + ':' + m
  return formatted
}
