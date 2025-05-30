import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent,
  TextField, DialogActions, IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

export default function Home() {
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '', designation: '', department: '', employeeNumber: '',
    companyName: '', baseSalary: '', increment: '', da: '',
    hra: '', specialAllowance: '', address: '', phoneNumber: '',
    email: '', dateOfBirth: '', dateOfJoining: ''
  });

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('https://salary-database.onrender.com');
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddClick = () => {
    setEditing(false);
    setFormData({
      name: '', designation: '', department: '', employeeNumber: '',
      companyName: '', baseSalary: '', increment: '', da: '',
      hra: '', specialAllowance: '', address: '', phoneNumber: '',
      email: '', dateOfBirth: '', dateOfJoining: ''
    });
    setOpen(true);
  };

  const handleEditClick = async (employeeNumber) => {
    try {
      const res = await axios.get(`https://salary-database.onrender.com/${employeeNumber}`);
      setFormData(res.data);
      setEditing(true);
      setOpen(true);
    } catch (err) {
      console.error('Error fetching employee for edit:', err);
    }
  };

  const handleDeleteClick = async (employeeNumber) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`https://salary-database.onrender.com/${employeeNumber}`);
        fetchEmployees();
      } catch (err) {
        console.error('Error deleting employee:', err);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await axios.put(`https://salary-database.onrender.com/${formData.employeeNumber}`, {
          baseSalary: Number(formData.baseSalary),
          increment: Number(formData.increment),
          da: Number(formData.da),
          hra: Number(formData.hra),
          specialAllowance: Number(formData.specialAllowance),
        });
      } else {
        await axios.post('https://salary-database.onrender.com/employee', formData);
      }
      setOpen(false);
      fetchEmployees();
    } catch (err) {
      console.error('Error submitting employee:', err);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Employee Directory</Typography>

      <Button variant="contained" color="primary" onClick={handleAddClick}>
        Add New Employee
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Total Earnings</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map(emp => (
              <TableRow key={emp.id}>
                <TableCell>{emp.name}</TableCell>
                <TableCell>{emp.designation}</TableCell>
                <TableCell>{emp.companyName}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.phoneNumber}</TableCell>
                <TableCell>{emp.totalEarnings}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEditClick(emp.employeeNumber)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteClick(emp.employeeNumber)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Employee Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
        <DialogContent>
          {Object.keys(formData).map((key) => (
            <TextField
              key={key}
              margin="dense"
              label={key.replace(/([A-Z])/g, ' $1')}
              name={key}
              type={['baseSalary', 'increment', 'da', 'hra', 'specialAllowance'].includes(key) ? 'number' : 'text'}
              fullWidth
              variant="outlined"
              value={formData[key]}
              onChange={handleChange}
              disabled={editing && key === 'employeeNumber'} // Prevent changing employeeNumber on edit
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editing ? 'Update' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
