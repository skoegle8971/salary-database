const { DataTypes } = require('sequelize');
const {sequelize }= require('./db');

const SalarySlip = sequelize.define('SalarySlip', {
  id: {type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true,},
  name: { type: DataTypes.STRING, allowNull: false },
  designation: { type: DataTypes.STRING, allowNull: false },
  department: { type: DataTypes.STRING },
  employeeNumber: { type: DataTypes.STRING, allowNull: false },
  companyName: { type: DataTypes.STRING },
  baseSalary: { type: DataTypes.FLOAT },
  increment: { type: DataTypes.FLOAT },
  da: { type: DataTypes.FLOAT },
  hra: { type: DataTypes.FLOAT },
  specialAllowance: { type: DataTypes.FLOAT },
  lopAmount: { type: DataTypes.FLOAT },
  professionalTax: { type: DataTypes.FLOAT },
  tds: { type: DataTypes.FLOAT },
  totalWorkingDays: { type: DataTypes.FLOAT },
  actualPayableDays: { type: DataTypes.FLOAT },
  paidLeave: { type: DataTypes.FLOAT },
  sickLeave:{type:DataTypes.FLOAT},
  lopDays: { type: DataTypes.FLOAT },
  date: { type: DataTypes.STRING }, // e.g., 23-05-2025
  month: { type: DataTypes.STRING }, // e.g., May 2025
  dateOfJoining: { type: DataTypes.STRING },
  dateOfBirth: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  phoneNumber: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  totalEarnings: { type: DataTypes.FLOAT },
  netPayable: { type: DataTypes.FLOAT }
});

module.exports = SalarySlip;
