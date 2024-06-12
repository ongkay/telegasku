const dbId = '1fqw7NyUXoW7tAeTjpaGqjnm7c804tW8iBKBeE2MZuE8';
const sheetName = 'allDB';

function statusFilled(pesan) {
  Logger.log('status gagal');
  Logger.log(pesan);

  return {
    status: 'filled',
    pesan,
  };
}

function statusSukses(data) {
  Logger.log('status sukses');
  return {
    status: 'ok',
    data,
  };
}

function generateId(name = '') {
  name = name.toLowerCase();
  if (name.match(/[^a-z]/g)) name = name.split(/[^a-z]/g)[0];

  // Generate random 6-digit number
  var randomNum = Math.floor(Math.random() * 900000) + 100000; // Ensure number starts with 2

  // var uniqueID = name + '-' + randomNum;
  var uniqueID = name + randomNum;

  return uniqueID;
}

function inputData(data, sheet = sheetName, idSheet = dbId) {
  const db = Dbsheet.init(idSheet);

  try {
    const akun = data.Account;

    const columns = [];
    mapObj(data, function (value, key) {
      columns.push(key);
    });

    db.createSheetIfNotExists(sheet, columns);
    let userSheet = db.sheet(sheet);

    let dataInput = {
      _id: generateId(akun),
      ...data,
    };

    // insert satu data
    userSheet.insert(dataInput);

    // users = userSheet.find()
    // Logger.log(users)

    return statusSukses(dataInput);
  } catch (error) {
    return statusFilled(error.message);
  }
}

function getDataById(id, sheet = sheetName, idSheet = dbId) {
  const db = Dbsheet.init(idSheet);

  try {
    let userSheet = db.sheet(sheet);
    let res = userSheet.find({
      _id: {
        equal: id,
      },
    });

    return statusSukses(res);
  } catch (error) {
    return statusFilled(error.message);
  }
}

function deleteDataById(id, sheet = sheetName, idSheet = dbId) {
  const db = Dbsheet.init(idSheet);

  try {
    let userSheet = db.sheet(sheet);

    userSheet['delete']({
      _id: id,
    });

    return statusSukses();
  } catch (error) {
    return statusFilled(error.message);
  }
}

function updateDataById(id, newData = sheetName, sheet, idSheet = dbId) {
  const db = Dbsheet.init(idSheet);

  try {
    let userSheet = db.sheet(sheet);

    userSheet.update(id, newData);

    return statusSukses(newData);
  } catch (error) {
    return statusFilled(error.message);
  }
}
