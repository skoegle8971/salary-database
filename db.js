const  { Sequelize } =require('sequelize');

const sequelize = new Sequelize(
  "postgresql://skoegle_y5bj_user:Ea9kRVMY3eq5PDlgD9p03wlf6muF86eg@dpg-d0slt0c9c44c73f9v500-a.virginia-postgres.render.com/skoegle_y5bj",
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