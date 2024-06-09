function parseObjToString(data) {
  data = removeNullObj(data);

  let res = [];
  mapObj(data, function (value, key) {
    res.push(`<b>${key}</b> : <code>${value}</code>\n`);
  });

  return res.toString().replace(/,/g, '');
}

//---------------------------------------------
//---------------------------------------------
const removeNullObj = (obj) => {
  return Object.keys(obj).reduce((acc, current) => {
    if (obj[current] !== null) {
      return { ...acc, [current]: obj[current] };
    }
    return acc;
  }, {});
};

//---------------------------------------------

const mapObj = function (obj, callback) {
  let result = {};

  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof callback === 'function') {
        result[key] = callback.call(obj, obj[key], key, obj);
      }
    }
  }

  return result;
};

//---------------------------------------------

function parseDate(date = null, time = null) {
  const dateInputMentah = 'Date @ 20/05/2024 15:30';
  // const dateInput = '20/05/2022 15:30';
  const dateInput = '20/05/2022';

  let d = new Date();

  if (date) {
    const dateSplit = date.split(' ');

    let alldate = dateSplit[0].split('/');
    d.setDate(alldate[0]);
    d.setMonth(alldate[1] - 1);
    alldate.length >= 3 ? d.setFullYear(alldate[2]) : null;

    let jam = dateSplit[1];

    if (dateSplit.length > 1 && jam !== '') {
      let allTime = dateSplit[1].split(':');
      d.setHours(allTime[0]);
      d.setMinutes(allTime[1]);
    }
  }

  if (time) {
    let allTime = time.split(':');
    d.setHours(allTime[0]);
    d.setMinutes(allTime[1]);
  }

  return d;
}

//============================================
//
function getDateTime(date) {
  const d = new Date(date);
  // const d = d;
  let yyyy = d.getFullYear();
  let mm = d.getMonth() + 1; // month is zero-based
  let dd = d.getDate();
  let HH = d.getHours();
  let m = d.getMinutes();
  let getTime = d.getTime();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  const formatted = dd + '/' + mm + '/' + yyyy + ' ' + HH + ':' + m;
  return formatted;
}

//======================================
function getMail() {
  var email = Session.getActiveUser().getEmail();
  Logger.log(email);
}

// =================================
function parseStringToObject(dataString) {
  // Split the data string into lines
  var lines = dataString.split('\n');

  // Initialize an empty object to store data
  var dataObject = {};

  // Iterate through each line
  for (var line of lines) {
    // Split the line into key-value pair

    let allLine = line.replace(/[@:-\s]+/, '@');
    var parts = allLine.split('@');
    if (parts.length === 2) {
      // Extract key and value
      var key = parts[0].trim(); // Remove leading and trailing spaces
      var value = parts[1].trim(); // Remove leading and trailing spaces

      // Convert key to lowercase for consistency
      key = key.toLowerCase();

      // Handle special cases for numeric values
      if (['entry', 'tp_1', 'tp_2', 'tp_3', 'sl'].includes(key)) {
        value = parseFloat(value); // Convert to number
      } else if (key === 'iswarning') {
        value = value.toLowerCase() === 'true'; // Convert to boolean
      }

      // Add key-value pair to the object
      dataObject[key] = value;
    }
  }

  // Return the parsed data object
  return dataObject;
}
