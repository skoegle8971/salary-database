// test.js
const  { Sequelize } =require('sequelize');

const sequelize = new Sequelize(
  "postgresql://skoegle_user:06NCIZaTkMFtWWYQf4C4AtFq4aa62CLV@dpg-d08sqvpr0fns73dp1a1g-a.oregon-postgres.render.com/skoegle",
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