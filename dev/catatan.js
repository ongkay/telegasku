{
  // =============================
  // cara menambahkan atau replace isi objek
  // =============================
  let obj = { name: 'Mayank', id: '035', gender: 'Male' }
  console.log(obj)
  obj = { ...obj, nationality: 'Indian', gender: 'wanits' }
  console.log(obj)
}

{
  // =============================
  // cara menghitung lenght obj
  // =============================
  objectLength = Object.keys(obj).length
  console.log(objectLength)
}

{
  // =============================
  // buat map object seperti map pada array dengan value dan key(properties)
  // =============================
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

  // contoh cara pakainya
  {
    const myObject = { a: 1, b: 2, c: 3 }

    const newObject = mapObj(myObject, function (value, key) {
      return value * value
    })

    console.log(newObject) //{ a: 1, b: 4, c: 9 }
  }
}
