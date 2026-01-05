const fs = require('fs');
const convert = require('xml-js');
const protobuf = require('protobufjs');

const root = protobuf.loadSync('employee.proto');
const EmployeeList = root.lookupType('Employees');

const employees = [
  { id: 1, name: 'Hammam', salary: 9000 },
  { id: 2, name: 'Abdellah', salary: 22000 },
  { id: 3, name: 'Zakaria', salary: 23000 }
];

const jsonObject = { employee: employees };
const jsonData = JSON.stringify(jsonObject);
const xmlOptions = {
  compact: true,
  ignoreComment: true,
  spaces: 0
};

const xmlData = "<root>\n" + convert.json2xml(jsonObject, xmlOptions) + "\n</root>";

const errMsg = EmployeeList.verify(jsonObject);
if (errMsg) throw Error(errMsg);

const message = EmployeeList.create(jsonObject);
const buffer = EmployeeList.encode(message).finish();

fs.writeFileSync('data.json', jsonData);
fs.writeFileSync('data.xml', xmlData);
fs.writeFileSync('data.proto', buffer);

console.log("Fichiers générés avec succès.\n");

const jsonSize = fs.statSync('data.json').size;
const xmlSize = fs.statSync('data.xml').size;
const protoSize = fs.statSync('data.proto').size;

console.log("RÉSULTATS DE COMPARAISON");
console.log(`Taille JSON  : ${jsonSize} octets`);
console.log(`Taille XML   : ${xmlSize} octets`);
console.log(`Taille Proto : ${protoSize} octets`);

const gain = ((jsonSize - protoSize) / jsonSize * 100).toFixed(2);
console.log(`\nProtobuf est environ ${gain}% plus léger que JSON sur cet exemple.`);