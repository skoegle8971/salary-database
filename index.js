const express = require('express');
const bodyParser = require('body-parser');
const {sequelize,connectToDatabase} = require('./db');
const cors = require('cors');
const morgan = require('morgan');
const Employee = require('./module');
const SalarySlip = require('./salarry');
const app = express();
const moment = require('moment');
const PORT = 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
connectToDatabase()
app.use(bodyParser.json());

app.post('/employee', async (req, res) => {
  try {
    const {
      name, designation, department, employeeNumber, companyName,
      baseSalary, increment, da, hra, specialAllowance,
      address, phoneNumber, email,dateOfBirth, dateOfJoining
    } = req.body;

    const existingEmployee = await Employee.findOne({ where: { employeeNumber } });
    if (existingEmployee) {
      return res.status(400).json({ error: 'Employee with this employee number already exists' });
    }


    const totalEarnings = parseFloat(baseSalary) + parseFloat(increment) + parseFloat(da) + parseFloat(hra) + parseFloat(specialAllowance);

    const newEmployee = await Employee.create({
      name,
      designation,
      department,
      employeeNumber,
      companyName,
      baseSalary,
      increment,
      da,
      hra,
      specialAllowance,
      totalEarnings,
      address,
      phoneNumber,
      email,
        dateOfBirth,
        dateOfJoining
    });

    res.status(201).json({ message: 'Employee added successfully', employee: newEmployee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding employee' });
  }
});

app.get('/', async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

app.get('/:employeeNumber', async (req, res) => {
  try {
    const { employeeNumber } = req.params;
    const employee = await Employee.findOne({ where: { employeeNumber } });

    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

// UPDATE: Update employee by employeeNumber
app.put('/:employeeNumber', async (req, res) => {
  try {
    const { employeeNumber } = req.params;
    const updates = req.body;

    const employee = await Employee.findOne({ where: { employeeNumber } });
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    // Recalculate total earnings if relevant fields are updated
    const { baseSalary, increment, da, hra, specialAllowance } = updates;
    if (baseSalary || increment || da || hra || specialAllowance) {
      const totalEarnings =
        parseFloat(updates.baseSalary ?? employee.baseSalary) +
        parseFloat(updates.increment ?? employee.increment) +
        parseFloat(updates.da ?? employee.da) +
        parseFloat(updates.hra ?? employee.hra) +
        parseFloat(updates.specialAllowance ?? employee.specialAllowance);

      updates.totalEarnings = totalEarnings;
    }

    await employee.update(updates);
    res.json({ message: 'Employee updated successfully', employee });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// DELETE: Delete employee by employeeNumber
app.delete('/:employeeNumber', async (req, res) => {
  try {
    const { employeeNumber } = req.params;
    const deleted = await Employee.destroy({ where: { employeeNumber } });

    if (deleted) {
      res.json({ message: 'Employee deleted successfully' });
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});










app.post('/generate', async (req, res) => {
  try {
    const data = req.body;

    // Calculate total earnings
    const totalEarnings =
      (parseFloat(data.baseSalary || 0) +
      parseFloat(data.increment || 0) +
      parseFloat(data.da || 0) +
      parseFloat(data.hra || 0) +
      parseFloat(data.specialAllowance || 0));

    // Calculate net payable salary
    const totalDeductions =
      (parseFloat(data.lopAmount || 0) +
      parseFloat(data.professionalTax || 0) +
      parseFloat(data.tds || 0));

    const netPayable = totalEarnings - totalDeductions;

    const slip = await SalarySlip.create({
      ...data,
      totalEarnings,
      netPayable
    });

    res.status(201).json({ message: 'Salary slip generated', slip });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate salary slip' });
  }
});


app.get('/:employeeNumber', async (req, res) => {
  try {
    const slip = await SalarySlip.findOne({
      where: { employeeNumber: req.params.employeeNumber }
    });

    if (!slip) return res.status(404).json({ error: 'Salary slip not found' });

    res.json(slip);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching salary slip' });
  }
});


app.put('/:employeeNumber', async (req, res) => {
  try {
    const { employeeNumber } = req.params;
    const [updated] = await SalarySlip.update(req.body, {
      where: { employeeNumber }
    });

    if (!updated) return res.status(404).json({ error: 'Salary slip not found' });

    const updatedSlip = await SalarySlip.findOne({ where: { employeeNumber } });
    res.json({ message: 'Salary slip updated', updatedSlip });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update salary slip' });
  }
});
app.delete('/:employeeNumber', async (req, res) => {
  try {
    const deleted = await SalarySlip.destroy({
      where: { employeeNumber: req.params.employeeNumber }
    });

    if (!deleted) return res.status(404).json({ error: 'Salary slip not found' });

    res.json({ message: 'Salary slip deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete salary slip' });
  }
});

app.post('/generate-experience-letter', async (req, res) => {
  const { employeeNumber, lastWorkingDay } = req.body;

  try {
    const employee = await Employee.findOne({ where: { employeeNumber } });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const doj = moment(employee.dateOfJoining, 'DD-MM-YYYY');
    const lwd = moment(lastWorkingDay, 'DD-MM-YYYY');
    const monthsWorked = lwd.diff(doj, 'months');

    const experienceLetter = {
      employeeName: employee.name,
      designation: employee.designation,
      department: employee.department,
      employeeNumber: employee.employeeNumber,
      companyName: employee.companyName,
      dateOfJoining: employee.dateOfJoining,
      lastWorkingDay,
      monthsWorked,
      letter: `
To Whom It May Concern,

This is to certify that Mr./Ms. ${employee.name} was employed with ${employee.companyName} as a ${employee.designation} in the ${employee.department} department from ${employee.dateOfJoining} to ${lastWorkingDay}. 

During their tenure of ${monthsWorked} month(s), they demonstrated professionalism, dedication, and were an asset to the organization.

We wish them all the best in their future endeavors.

Sincerely,  
HR Department  
${employee.companyName}
      `.trim()
    };

    res.json(experienceLetter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error generating experience letter' });
  }
});

app.post('/generate-relieving-letter', async (req, res) => {
  const { employeeNumber, lastWorkingDay } = req.body;

  try {
    const employee = await Employee.findOne({ where: { employeeNumber } });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const doj = moment(employee.dateOfJoining, 'DD-MM-YYYY');
    const lwd = moment(lastWorkingDay, 'DD-MM-YYYY');
    const monthsWorked = lwd.diff(doj, 'months');

    const relievingLetter = {
      employeeName: employee.name,
      designation: employee.designation,
      department: employee.department,
      employeeNumber: employee.employeeNumber,
      companyName: employee.companyName,
      dateOfJoining: employee.dateOfJoining,
      lastWorkingDay,
      monthsWorked,
      letter: `
To Whom It May Concern,

This is to formally acknowledge that Mr./Ms. ${employee.name} has been relieved from their duties at ${employee.companyName}, where they served as a ${employee.designation} in the ${employee.department} department.

Their employment commenced on ${employee.dateOfJoining} and concluded on ${lastWorkingDay}. During their ${monthsWorked} month(s) of tenure, they have fulfilled their responsibilities to our satisfaction.

We wish them all the best in their future endeavors.

Sincerely,  
HR Department  
${employee.companyName}
      `.trim()
    };

    res.json(relievingLetter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error generating relieving letter' });
  }
});



sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
