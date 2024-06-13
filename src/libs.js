function parseObjToString(data) {
  data = removeNullObj(data);

  let res = [];
  mapObj(data, function (value, key) {
    res.push(`<b>${key}</b> : <code>${value}</code>\n`);
  });

  return res.toString().replace(/,/g, '');
}

function formatSendMessage(data) {
  let date = data.Date;
  let dateClose = data.Date_close;
  let direction = data.Direction;
  let isWarning = data.isWarning;
  let id = data._id;
  let pair = data.Pair;
  let entry = data.Entry;
  let entry2 = data.Entry_2;
  let tp1 = data.TP_1;
  let tp2 = data.TP_2;
  let tp3 = data.TP_3;
  let tp4 = data.TP_4;
  let tp5 = data.TP_5;
  let sl = data.SL;
  let sl2 = data.SL_2;

  const removeData = [
    'Date',
    'Time',
    'Date_close',
    'Direction',
    'isWarning',
    '_id',
    'Pair',
    'Entry',
    'Entry_2',
    'TP_1',
    'TP_2',
    'TP_3',
    'TP_4',
    'TP_5',
    'SL',
    'SL_2',
  ];
  const otherData = removePropertiesObj(data, removeData);

  const pl = getAlltWinLose({
    entry,
    sl,
    sl2,
    tp1,
    tp2,
    tp3,
    pair,
  });

  function dataEntry(e) {
    const slsatu = `SL: <code>${sl}</code> 👉 <code>${pl.pipsSl.toFixed()}P</code>, <code>${
      pl.rrTp1.split(':')[0]
    }R</code>, <code>$${Math.round(pl.dollarSl * 10) / 10}</code> \n`;

    const data =
      `Entry: <code>${e}</code> ${isWarning ? '⚠️' : ''}\n` +
      `${tp2 ? 'TP1' : 'TP'}: <code>${tp1}</code> 👉 <code>${pl.pipsTp1.toFixed()}P</code>, <code>${
        pl.rrTp1.split(':')[1]
      }R</code>, <code>$${Math.round(pl.dollarTp1 * 10) / 10}</code>\n` +
      `${
        tp2
          ? `TP2: <code>${tp2}</code> 👉 <code>${pl.pipsTp2.toFixed()}P</code>, <code>${
              pl.rrTp2.split(':')[1]
            }R</code>, <code>$${Math.round(pl.dollarTp2 * 10) / 10}</code>\n`
          : ''
      }` +
      `${
        tp3
          ? `TP3: <code>${tp3}</code> 👉 <code>${pl.pipsTp3.toFixed()}P</code>, <code>${
              pl.rrTp3.split(':')[1]
            }R</code>, <code>$${Math.round(pl.dollarTp3 * 10) / 10}</code>\n`
          : ''
      }` +
      `${
        tp4
          ? `TP4: <code>${tp4}</code> 👉 <code>${pl.pipsTp4.toFixed()}P</code>, <code>${
              pl.rrTp4.split(':')[1]
            }R</code>, <code>$${Math.round(pl.dollarTp4 * 10) / 10}</code>\n`
          : ''
      }` +
      `${
        tp5
          ? `TP5: <code>${tp5}</code> 👉 <code>${pl.pipsTp5.toFixed()}P</code>, <code>${
              pl.rrTp5.split(':')[1]
            }R</code>, <code>$${Math.round(pl.dollarTp5 * 10) / 10}</code>\n`
          : ''
      }` +
      `${
        !sl2
          ? slsatu
          : `<s>${slsatu}</s>` +
            `SL2: <code>${sl2}</code> 👉 <code>${pl.pipsSl2.toFixed()}P</code>, <code>${
              pl.rrTp1.split(':')[0]
            }R</code>, <code>$${Math.round(pl.dollarSl2 * 10) / 10}</code> \n`
      }`;

    return data;
  }

  const otherDataMessage = parseObjToString(otherData);
  const newInput =
    `#<code>${id}</code>\n\n` +
    `${pair} ${direction} \n` +
    `Open: <code>${date}</code>\n` +
    `${dateClose ? `Close: <code>${dateClose}</code>\n` : ''}` +
    `---------------------------------\n` +
    `${dataEntry(entry)}` +
    `${entry2 ? `---------------------------------\nEntry kedua : \n${dataEntry(entry)}` : ''}` +
    `---------------------------------\n` +
    `${otherDataMessage}` +
    `---------------------------------`;

  return newInput;
}

//---------------------------------------------
//---------------------------------------------
const removeNullObj = (obj) => {
  return Object.keys(obj).reduce((acc, current) => {
    if (obj[current] !== null && obj[current] !== '') {
      return { ...acc, [current]: obj[current] };
    }
    return acc;
  }, {});
};

function removePropertiesObj(object, namePropertyArray) {
  // Use a for loop to iterate through the properties to remove
  for (const property of namePropertyArray) {
    if (object.hasOwnProperty(property)) {
      delete object[property];
    }
  }
  return object;
}

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
