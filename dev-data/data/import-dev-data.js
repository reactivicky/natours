const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({
  path: './config.env',
});
const Tour = require('../../models/tourModel');

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);

async function main() {
  try {
    await mongoose.connect(DB);
    console.log('Database connected...');
  } catch (err) {
    console.log(err);
  }
}
main();

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);
tours.forEach((item) => {
  delete item.id;
});

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

switch (process.argv[2]) {
  case '--import':
    importData();
    break;
  case '--delete':
    deleteData();
    break;
  default:
    break;
}
