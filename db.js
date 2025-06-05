const  { Sequelize } =require('sequelize');
require("dotenv").config()
const sequelize = new Sequelize(
  process.env.DB_URL,
  {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  }
);

function connectToDatabase() {
  sequelize.authenticate()
    .then(() => {
      console.log('Connection to the database has been established successfully.');
      return sequelize.sync(); // Sync the models with the database
    })
    .then(() => {
      console.log('All models were synchronized successfully.');
    })
    .then(() => {
      console.log('Connected to the database successfully!');
    })
    .catch((error) => {
      console.error('Unable to connect to the database:', error);
    });
}



module.exports = {sequelize,connectToDatabase};