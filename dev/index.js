function csvToObject(csv) {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',');
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentLine = lines[i].split(',');

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j].trim()] = currentLine[j].trim();
    }

    result.push(obj);
  }

  return result;
}

// Contoh penggunaan:
const csvData = `time,open,high,low,close
1710108000,2179.105,2179.905,2179.105,2179.905
1710108300,2179.905,2181.090,2179.635,2180.975
1710108600,2180.975,2181.045,2179.725,2179.740
1710108900,2179.740,2180.250,2179.445,2180.090
1710109200,2180.090,2180.150,2179.730,2179.730`;

const jsonObject = csvToObject(csvData);
console.log(jsonObject);
