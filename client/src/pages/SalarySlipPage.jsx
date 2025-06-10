import React, { useEffect, useState } from 'react';
import { useLocation, useParams ,Link} from 'react-router-dom';
import axios from 'axios';
import {
  Container, Typography, Button, Paper, Box, Table, TableHead,
  TableRow, TableCell, TableBody, TableContainer, Stack, Modal, Divider, TextField
} from '@mui/material';
import { jsPDF } from 'jspdf';
import { apiUrl } from "../Config";

export default function SalarySlipPage() {
  const { employeeNumber } = useParams();
  const { state } = useLocation();
  const [employee, setEmployee] = useState(state?.employeeData || null);
  const [slips, setSlips] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const [form, setForm] = useState({
    lopAmount: '',
    professionalTax: '',
    tds: '',
    totalWorkingDays: '',
    actualPayableDays: '',
    paidLeave: '',
    lopDays: '',
    sickLeave: '',
    date: '',
    month: '',
  });

  const fetchSalarySlips = async () => {
    try {
      const res = await axios.get(`${apiUrl}/${employeeNumber}/all`);
      setSlips(res.data);
    } catch (err) {
      console.error("Error fetching slips:", err);
    }
  };

  useEffect(() => {
    if (!employee) {
      axios.get(`${apiUrl}/${employeeNumber}`)
        .then(res => setEmployee(res.data))
        .catch(err => console.error("Error fetching employee:", err));
    }
    fetchSalarySlips();
    // eslint-disable-next-line
  }, [employeeNumber]);

  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
    setForm({
      lopAmount: '',
      professionalTax: '',
      tds: '',
      totalWorkingDays: '',
      actualPayableDays: '',
      paidLeave: '',
      lopDays: '',
      sickLeave: '',
      date: '',
      month: '',
    });
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmitCreateSlip = async () => {
    try {
      // Don't send id to API (e.g. id: employee.id or id in employee object)
      const { id, ...employeeDataWithoutId } = employee || {};
      await axios.post(`${apiUrl}/generate`, {
        ...employeeDataWithoutId,
        ...form
      });
      handleCloseCreateModal();
      fetchSalarySlips();
    } catch (err) {
      console.error("Error generating slip:", err);
    }
  };

  const handleView = (slip) => {
    setSelectedSlip(slip);
    setOpenModal(true);
  };

  // Helper: Convert number to words
  const numberToWords = (num) => {
    const a = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen',
      'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const b = [
      '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
    ];

    const inWords = (n) => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
      if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + inWords(n % 100) : '');
      if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
      if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '');
      return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + inWords(n % 10000000) : '');
    };

    return inWords(Number(num)) + ' Only';
  };

  const img = new window.Image();
  img.src = "/LOGO.png";

 const handleDownload = (slip) => {
  const doc = new jsPDF("p", "pt", "a4");
  const leftMargin = 40;
  let y = 40;

  const colWidths = [130, 160, 130, 80]; // Adjust widths as needed
  const padding = 5;

  // Header
  doc.setFont("Times", "bold");
  doc.setFontSize(14);
  doc.addImage(img, "PNG", 40, 20, 50, 50);
  doc.text("SKOEGLE IOT INNOVATIONS PRIVATE LIMITED", 300, y, { align: "center" });
  y += 18;

  doc.setFontSize(10);
  doc.setFont("Times", "normal");
  doc.text("52/2, 2nd main road. Vyalikaval, Lower Palace Orchards, Malleshwaram, Bangalore-560003", 300, y, { align: "center" });
  y += 20;

  doc.setFontSize(12);
  doc.setFont("Times", "bold");
  doc.text(`PAYSLIP FOR THE MONTH OF ${slip.month?.toUpperCase()}`, 300, y, { align: "center" });
  y += 25;

  // Updated drawRow function supporting text wrap and dynamic height
  const drawRow = (row, fontStyles = ["bold", "normal", "bold", "normal"], baseRowHeight = 20, widths = colWidths) => {
    let x = leftMargin;
    let maxLines = 1;
    const linesPerCell = [];

    // Calculate line-wrapped text for each cell
    row.forEach((text, i) => {
      const width = widths[i] - 2 * padding;
      doc.setFont("Times", fontStyles[i] || "normal");

      if (text !== undefined && text !== null) {
        const lines = doc.splitTextToSize(String(text), width);
        linesPerCell.push(lines);
        maxLines = Math.max(maxLines, lines.length);
      } else {
        linesPerCell.push([""]);
      }
    });

    const rowHeight = baseRowHeight * maxLines;

    // Draw cells and insert wrapped text lines
    row.forEach((_, i) => {
      const width = widths[i];
      doc.rect(x, y, width, rowHeight);

      const lines = linesPerCell[i];
      lines.forEach((line, j) => {
        doc.text(line, x + padding, y + 14 + (j * baseRowHeight));
      });

      x += width;
    });

    y += rowHeight;
  };

  // Employee Info Rows
  drawRow(["Name", slip.name, "Total Working Days", slip.totalWorkingDays]);
  drawRow(["Designation", slip.designation, "Actual Payable Days", slip.actualPayableDays]);
  drawRow(["Department", slip.department, "Paid Leave", slip.paidLeave]);
  drawRow(["Employee No.", slip.employeeNumber, "Sick Leave", slip.sickLeave]);
  drawRow(["LOP", slip.lopDays,  "DOJ", slip.dateOfJoining]);

  // Earnings/Deductions Header
  drawRow(["Earnings", "Amount (Rs.)", "Deductions", "Amount (Rs.)"], ["bold", "bold", "bold", "bold"]);

  // Salary Breakdown
  drawRow(["Basic", Number(slip.baseSalary) + Number(slip.increment), "LOP", slip.lopAmount]);
  drawRow(["DA", slip.da, "Professional Tax", slip.professionalTax]);
  drawRow(["HRA", slip.hra, "TDS", slip.tds]);
  drawRow(["Conveyance Allowance", slip.specialAllowance, "", ""]);
  drawRow(
    [
      "Total Earnings (A)",
      slip.totalEarnings,
      "Total Deduction (B)",
      Number(slip.professionalTax) + Number(slip.tds) + Number(slip.lopAmount),
    ],
    ["bold", "bold", "bold", "bold"]
  );

  // Net Pay Section
  y += 15;
  doc.setFont("Times", "bold");
  doc.setFontSize(11);
  doc.text(`Net Pay in Rs.: ${slip.netPayable}`, leftMargin, y);
  y += 20;
  doc.text(`Net Pay in words: ${numberToWords(slip.netPayable)}`, leftMargin, y);

  // Footer
  y += 25;
  doc.setFontSize(9);
  doc.setFont("Times", "italic");
  doc.text("This is a system-generated payslip and does not require a signature.", leftMargin, y);

  // Save PDF
  doc.save(`${slip.name}-${slip.month}-salary-slip.pdf`);
};

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Salary Slips - {employee?.name || employeeNumber}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Employee: {employee?.employeeNumber || employeeNumber}
      </Typography>

      <Box sx={{ my: 2 }}>
        <Button variant="contained" color="primary" onClick={handleOpenCreateModal}>
          Create Salary Slip
        </Button>
      </Box>
       <Link to="/" style={{ textDecoration: 'none' }}>
        <Button variant="contained" color="secondary" style={{ marginLeft: 10 }}>
       Home
        </Button>
      </Link>


      {/* Create Slip Modal */}
      <Modal open={openCreateModal} onClose={handleCloseCreateModal}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500, bgcolor: 'background.paper',
          border: '1px solid #ccc', boxShadow: 24, p: 4,
        }}>
          <Typography variant="h6" gutterBottom>Create Salary Slip</Typography>
          {Object.keys(form).map((field, idx) => (
            <TextField
              key={idx}
              fullWidth
              name={field}
              label={field}
              value={form[field]}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
          ))}
          <Button variant="contained" onClick={handleSubmitCreateSlip}>Submit</Button>
        </Box>
      </Modal>

      {/* View Slip Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700, maxHeight: '90vh', overflowY: 'auto',
          bgcolor: 'background.paper', border: '1px solid #ccc',
          boxShadow: 24, p: 4, fontFamily: 'monospace',
        }}>
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
              <Typography><strong>Employee:</strong> {selectedSlip.employeeNumber}</Typography>
              <Typography><strong>Designation:</strong> {selectedSlip.designation}</Typography>
              <Typography><strong>Department:</strong> {selectedSlip.department}</Typography>
              <Typography><strong>Date of Joining:</strong> {selectedSlip.dateOfJoining}</Typography>

              <Divider sx={{ my: 2 }} />

              <Typography><strong>Month:</strong> {selectedSlip.month}</Typography>
              <Typography><strong>Date:</strong> {selectedSlip.date}</Typography>
              <Typography><strong>Total Working Days:</strong> {selectedSlip.totalWorkingDays}</Typography>
              <Typography><strong>Actual Payable Days:</strong> {selectedSlip.actualPayableDays}</Typography>
              <Typography><strong>Paid Leave:</strong> {selectedSlip.paidLeave}</Typography>
              <Typography><strong>LOP Days:</strong> {selectedSlip.lopDays}</Typography>
              <Typography><strong>Sick Leave:</strong> {selectedSlip.sickLeave}</Typography>

              <Divider sx={{ my: 2 }} />

              <Typography><strong>Base Salary:</strong> {Number(selectedSlip.baseSalary) + Number(selectedSlip.increment)}</Typography>
              <Typography><strong>DA:</strong> {selectedSlip.da}</Typography>
              <Typography><strong>HRA:</strong> {selectedSlip.hra}</Typography>
              <Typography><strong>Conveyance Allowance:</strong> {selectedSlip.specialAllowance}</Typography>
              <Typography><strong>Total Earnings:</strong> {selectedSlip.totalEarnings}</Typography>

              <Divider sx={{ my: 2 }} />

              <Typography><strong>Professional Tax:</strong> {selectedSlip.professionalTax}</Typography>
              <Typography><strong>TDS:</strong> {selectedSlip.tds}</Typography>
              <Typography><strong>LOP Amount:</strong> {selectedSlip.lopAmount}</Typography>
              <Typography><strong>Net Payable:</strong> {selectedSlip.netPayable}</Typography>
              <Typography><strong>Total Deduction:</strong> {Number(selectedSlip.professionalTax) + Number(selectedSlip.tds) + Number(selectedSlip.lopAmount)}</Typography>

              <Divider sx={{ my: 3 }} />

              <Typography align="center" variant="body2" color="textSecondary">
                This is a system-generated payslip and does not require a signature.
              </Typography>

            </>
          )}
        </Box>
      </Modal>

      <Typography variant="h6" sx={{ mt: 3 }}>Salary Slip History</Typography>
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
                    <Button size="small" variant="outlined" onClick={() => handleView(slip)}>View</Button>
                    <Button size="small" variant="outlined" onClick={() => handleDownload(slip)}>Download</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
