// models/Employee.js
const { DataTypes } = require('sequelize');
const {sequelize }= require('./db');

const Employee = sequelize.define('Employee', {
  name: DataTypes.STRING,
  designation: DataTypes.STRING,
  department: DataTypes.STRING,
  employeeNumber: { type: DataTypes.STRING, unique: true },
  companyName: DataTypes.STRING,
  baseSalary: DataTypes.FLOAT,
  increment: DataTypes.FLOAT,
  da: DataTypes.FLOAT,
  hra: DataTypes.FLOAT,
  specialAllowance: DataTypes.FLOAT,
  totalEarnings: DataTypes.FLOAT,
  address: DataTypes.STRING,
  phoneNumber: DataTypes.STRING,
  dateOfJoining: DataTypes.STRING,
  dateOfBirth: DataTypes.STRING,
  email: { type: DataTypes.STRING, validate: { isEmail: true } },
});

module.exports = Employee;
