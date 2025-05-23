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
curl -X POST https://salary-database.onrender.com/generate \
  -H "Content-Type: application/json" \
  -d '{
    "employeeNumber": "EMP001",
    "baseSalary": 55000,
    "increment": 3000,
    "da": 3500,
    "hra": 4000,
    "specialAllowance": 1500,
    "lopAmount": 1000,
    "professionalTax": 200,
    "tds": 500
  }'
```

#### 🔍 Get Salary Slip by Employee Number

```bash
curl https://salary-database.onrender.com/EMP001
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
