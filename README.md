  Here are the `cURL` commands for **all routes** in your Express.js app, including employee, salary slip, experience letter, and relieving letter APIs.

---

### 📌 **Employee Routes**

#### ➕ Add Employee

```bash
curl -X POST https://salary-database.onrender.com/employee \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "designation": "Software Engineer",
    "department": "Engineering",
    "employeeNumber": "EMP001",
    "companyName": "Tech Corp",
    "baseSalary": 50000,
    "increment": 2000,
    "da": 3000,
    "hra": 4000,
    "specialAllowance": 1000,
    "address": "123 Street",
    "phoneNumber": "9876543210",
    "email": "john@example.com",
    "dateOfBirth": "01-01-1990",
    "dateOfJoining": "01-01-2022"
  }'
```

#### 📄 Get All Employees

```bash
curl https://salary-database.onrender.com/
```

#### 🔍 Get Employee by Number

```bash
curl https://salary-database.onrender.com/EMP001
```

#### ✏️ Update Employee

```bash
curl -X PUT https://salary-database.onrender.com/EMP001 \
  -H "Content-Type: application/json" \
  -d '{
    "baseSalary": 55000,
    "increment": 3000
  }'
```

#### ❌ Delete Employee

```bash
curl -X DELETE https://salary-database.onrender.com/EMP001
```

---

### 💰 **Salary Slip Routes**

#### ➕ Generate Salary Slip

```bash
curl --location 'http://localhost:3000/generate' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "John Doe",
    "designation": "Software Engineer",
    "department": "Development",
    "employeeNumber": "EMP12345",
    "companyName": "Tech Corp",
    "baseSalary": 50000,
    "increment": 5000,
    "da": 2000,
    "hra": 3000,
    "specialAllowance": 1500,
    "lopAmount": 1000,
    "professionalTax": 200,
    "tds": 1500,
    "totalWorkingDays": 30,
    "actualPayableDays": 28,
    "paidLeave": 2,
    "lopDays": 0,
    "date": "27-05-2025",
    "month": "May 2025",
    "dateOfJoining": "01-01-2020",
    "dateOfBirth": "15-07-1990",
    "address": "123 Main St, City",
    "phoneNumber": "1234567890",
    "email": "john.doe@example.com"
  }'
```

#### 🔍 Get Salary Slip by Employee Number

```bash
curl https://salary-database.onrender.com/EMP001
```
#### 🔍 Get All Salary Slip by Employee Number

```bash
curl --location 'http://localhost:3000/EMP003/all' 
res 

[
    {
        "id": 1,
        "name": "Akash Mehta",
        "designation": "Product Manager",
        "department": "Product",
        "employeeNumber": "EMP003",
        "companyName": "Skoegle IOT Innovations Pvt Ltd",
        "baseSalary": 80000,
        "increment": 7000,
        "da": 3500,
        "hra": 6000,
        "specialAllowance": 8001,
        "lopAmount": 0,
        "professionalTax": 200,
        "tds": 500,
        "totalWorkingDays": 30,
        "actualPayableDays": 30,
        "paidLeave": 0,
        "lopDays": 0,
        "date": "2025-05-27",
        "month": "May 2025",
        "dateOfJoining": "19-02-2025",
        "dateOfBirth": "19-08-2002",
        "address": "89 Green Park, Delhi",
        "phoneNumber": "8899776655",
        "email": "akash.mehta@skoegle.com",
        "totalEarnings": 104501,
        "netPayable": 103801,
        "createdAt": "2025-05-27T06:36:11.656Z",
        "updatedAt": "2025-05-27T06:36:11.656Z"
    },
    {
        "id": 2,
        "name": "Akash Mehta",
        "designation": "Product Manager",
        "department": "Product",
        "employeeNumber": "EMP003",
        "companyName": "Skoegle IOT Innovations Pvt Ltd",
        "baseSalary": 80000,
        "increment": 7000,
        "da": 3500,
        "hra": 6000,
        "specialAllowance": 8001,
        "lopAmount": 0,
        "professionalTax": 200,
        "tds": 500,
        "totalWorkingDays": 30,
        "actualPayableDays": 30,
        "paidLeave": 0,
        "lopDays": 0,
        "date": "2025-05-27",
        "month": "May 2025",
        "dateOfJoining": "19-02-2025",
        "dateOfBirth": "19-08-2002",
        "address": "89 Green Park, Delhi",
        "phoneNumber": "8899776655",
        "email": "akash.mehta@skoegle.com",
        "totalEarnings": 104501,
        "netPayable": 103801,
        "createdAt": "2025-05-27T06:36:48.723Z",
        "updatedAt": "2025-05-27T06:36:48.723Z"
    }
]
```
#### ✏️ Update Salary Slip

```bash
curl -X PUT https://salary-database.onrender.com/EMP001 \
  -H "Content-Type: application/json" \
  -d '{
    "tds": 700
  }'
```

#### ❌ Delete Salary Slip

```bash
curl -X DELETE https://salary-database.onrender.com/EMP001
```

---

### 📜 **Letter Routes**

#### 🧾 Generate Experience Letter

```bash
curl -X POST https://salary-database.onrender.com/generate-experience-letter \
  -H "Content-Type: application/json" \
  -d '{
    "employeeNumber": "EMP001",
    "lastWorkingDay": "01-05-2024"
  }'
```

#### 🧾 Generate Relieving Letter

```bash
curl -X POST https://salary-database.onrender.com/generate-relieving-letter \
  -H "Content-Type: application/json" \
  -d '{
    "employeeNumber": "EMP001",
    "lastWorkingDay": "01-05-2024"
  }'
```

---

Let me know if you want Postman collection or file download for these requests.
