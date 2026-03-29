const fs = require('fs');

const csv = fs.readFileSync('../马友名单及水平.csv', 'utf8');
const lines = csv.trim().split('\n').slice(1); // skip header
const data = lines.filter(line => line.trim()).map((line, index) => {
    const [name, level] = line.trim().split(',');
    return { id: index + 1, name, level };
});

fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
console.log('data.json created!');
