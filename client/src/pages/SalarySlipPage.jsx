import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Typography, Button, Paper, Box, Table, TableHead,
  TableRow, TableCell, TableBody, TableContainer, Stack, Modal, Divider
} from '@mui/material';
import { jsPDF } from 'jspdf';

export default function SalarySlipPage() {
  const { employeeNumber } = useParams();
  const { state } = useLocation();
  const [employee, setEmployee] = useState(state?.employeeData || null);
  const [slips, setSlips] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState(null);

  // Fetch salary slips for the employee
  const fetchSalarySlips = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/${employeeNumber}/all`);
      setSlips(res.data);
    } catch (err) {
      console.error("Error fetching slips:", err);
    }
  };

  // Initial fetch employee and slips
  useEffect(() => {
    if (!employee) {
      axios.get(`http://localhost:3000/${employeeNumber}`)
        .then(res => setEmployee(res.data))
        .catch(err => console.error("Error fetching employee:", err));
    }
    fetchSalarySlips();
  }, [employeeNumber]);

  // Generate new salary slip and refresh list
  const handleGenerateSlip = async () => {
    try {
      await axios.post('http://localhost:3000/generate', {
        ...employee,
        lopAmount: 0,
        professionalTax: 200,
        tds: 500,
        totalWorkingDays: 30,
        actualPayableDays: 30,
        paidLeave: 0,
        lopDays: 0,
        sickLeave: 0,
        date: new Date().toISOString().split('T')[0],
        month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      });
      fetchSalarySlips();
    } catch (err) {
      console.error("Error generating slip:", err);
    }
  };

  // Open modal to view slip details
  const handleView = (slip) => {
    setSelectedSlip(slip);
    setOpenModal(true);
  };
  // Download slip as PDF with jsPDF
const handleDownload = (slip) => {
  const doc = new jsPDF("p", "pt", "a4");
  const leftMargin = 40;
  let y = 40;

  // Header
  doc.setFont("Times", "bold");
  doc.setFontSize(14);
  doc.text("SKOEGLE IOT INNOVATIONS PRIVATE LIMITED", 300, y, { align: "center" });
  y += 18;
  doc.setFontSize(10);
  doc.setFont("Times", "normal");
  doc.text(
    "52/2, 2nd main road. Vyalikaval, Lower Palace Orchards, Malleshwaram, Bangalore-560003 PH No: 99024 95354",
    300,
    y,
    { align: "center" }
  );
  y += 20;

  doc.setFontSize(12);
  doc.setFont("Times", "bold");
  doc.text(`PAYSLIP FOR THE MONTH OF ${slip.month.toUpperCase()}, ${slip.year}`, 300, y, { align: "center" });
  y += 25;

  // Table rows
  const data = [
    ["Name", slip.name, "Total Working Days", slip.totalWorkingDays],
    ["Designation", slip.designation, "Actual Payable Days", slip.actualPayableDays],
    ["Department", slip.department, "Paid Leave", slip.paidLeave],
    ["Employee No.", slip.employeeNumber, "Sick Leave", slip.sickLeave],
    ["LOP", slip.lopDays, "", ""],
  
    ["Earnings", "Amount (Rs.)", "Deductions", "Amount (Rs.)"],
    ["Basic", slip.baseSalary + slip.increment, "LOP", slip.lopAmount],
    ["DA", slip.da, "Professional Tax", slip.professionalTax],
    ["HRA", slip.hra, "TDS", slip.tds],
    ["Conveyance Allowance", slip.specialAllowance, "", ""],
    ["Total Earnings (A)", slip.totalEarnings, "Total Deduction (B)", slip.professionalTax + slip.tds + slip.lopAmount],
  ];

  // Draw Table
  const colWidths = [130, 100, 130, 130];
  data.forEach((row) => {
    let x = leftMargin;
    row.forEach((text, index) => {
      doc.rect(x, y, colWidths[index], 20);
      doc.setFont("Times", index === 0 || index === 2 ? "bold" : "normal");
      if (text) {
        doc.text(String(text), x + 5, y + 14);
      }
      x += colWidths[index];
    });
    y += 20;
  });

  // Net Pay in Rs. and Words (separate section)
  y += 15;
  doc.setFont("Times", "bold");
  doc.setFontSize(11);
  doc.text(`Net Pay in Rs. : ${slip.netPayable}`, leftMargin, y);
  y += 20;
  doc.text(`Net Pay in words: ${slip.netPayableWords || "Twenty Four Thousand Only"}`, leftMargin, y);

  // Footer note
  y += 25;
  doc.setFontSize(9);
  doc.setFont("Times", "italic");
  doc.text("This is a system-generated payslip and does not require a signature.", leftMargin, y);

  doc.save(`${slip.name}-${slip.month}-salary-slip.pdf`);
};

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Salary Slips - {employee?.name || employeeNumber}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Employee #: {employee?.employeeNumber || employeeNumber}
      </Typography>

      <Box sx={{ my: 2 }}>
        <Button variant="contained" color="primary" onClick={handleGenerateSlip}>
          + Create Salary Slip
        </Button>
      </Box>

      <Typography variant="h6" sx={{ mt: 3 }}>
        Salary Slip History
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Month</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total Earnings</TableCell>
              <TableCell>Net Payable</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slips.map((slip, idx) => (
              <TableRow key={idx}>
                <TableCell>{slip.name}</TableCell>
                <TableCell>{slip.department}</TableCell>
                <TableCell>{slip.month}</TableCell>
                <TableCell>{slip.date}</TableCell>
                <TableCell>{slip.totalEarnings}</TableCell>
                <TableCell>{slip.netPayable}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button size="small" variant="outlined" onClick={() => handleView(slip)}>
                      View
                    </Button>
                    <Button size="small" variant="outlined" onClick={() => handleDownload(slip)}>
                      Download
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 700,
            maxHeight: '90vh',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            border: '1px solid #ccc',
            boxShadow: 24,
            p: 4,
            fontFamily: 'monospace',
          }}
        >
          {selectedSlip && (
            <>
              <Typography variant="h6" align="center" gutterBottom>
                <strong>SKOEGLE IOT INNOVATIONS PRIVATE LIMITED</strong>
              </Typography>
              <Typography align="center" gutterBottom>
                52/2, 2nd main road, Vyalikaval, Lower Palace Orchards, Malleshwaram, Bangalore-560003 PH No: 99024 95354
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography><strong>Name:</strong> {selectedSlip.name}</Typography>
              <Typography><strong>Employee #:</strong> {selectedSlip.employeeNumber}</Typography>
              <Typography><strong>Designation:</strong> {selectedSlip.designation}</Typography>
              <Typography><strong>Department:</strong> {selectedSlip.department}</Typography>

              <Divider sx={{ my: 2 }} />

              <Typography><strong>Month:</strong> {selectedSlip.month}</Typography>
              <Typography><strong>Date:</strong> {selectedSlip.date}</Typography>
              <Typography><strong>Total Working Days:</strong> {selectedSlip.totalWorkingDays}</Typography>
              <Typography><strong>Actual Payable Days:</strong> {selectedSlip.actualPayableDays}</Typography>
              <Typography><strong>Paid Leave:</strong> {selectedSlip.paidLeave}</Typography>
              <Typography><strong>LOP Days:</strong> {selectedSlip.lopDays}</Typography>
              <Typography><strong>Sick Leave:</strong> {selectedSlip.sickLeave}</Typography>

              <Divider sx={{ my: 2 }} />

              <Typography><strong>Base Salary:</strong> {selectedSlip.baseSalary + selectedSlip.increment}</Typography>
              <Typography><strong>DA:</strong> {selectedSlip.da}</Typography>
              <Typography><strong>HRA:</strong> {selectedSlip.hra}</Typography>
              <Typography><strong>Conveyance Allowance:</strong> {selectedSlip.specialAllowance}</Typography>
              <Typography><strong>Total Earnings:</strong> {selectedSlip.totalEarnings}</Typography>

              <Divider sx={{ my: 2 }} />

              <Typography><strong>Professional Tax:</strong> {selectedSlip.professionalTax}</Typography>
              <Typography><strong>TDS:</strong> {selectedSlip.tds}</Typography>
              <Typography><strong>LOP Amount:</strong> {selectedSlip.lopAmount}</Typography>
              <Typography><strong>Net Payable:</strong> {selectedSlip.netPayable}</Typography>
              <Typography><strong>Total Deduction:</strong> {selectedSlip.professionalTax + selectedSlip.tds + selectedSlip.lopAmount}</Typography>

              <Divider sx={{ my: 3 }} />

              <Typography align="center" variant="body2" color="textSecondary">
                This is a system-generated payslip and does not require a signature.
              </Typography>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
}
