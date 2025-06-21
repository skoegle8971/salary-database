import React, { useState, Suspense, lazy } from 'react';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home.jsx'));
const SalarySlipPage = lazy(() => import('./pages/SalarySlipPage.jsx'));

// Hardcoded credentials
const USERID = 'Skoegle';
const PASSWORD = 'Skoegle@2019';

// CSS-in-JS styles object
const styles = {
  appContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f5f7fa',
    fontFamily: "'Segoe UI', Arial, sans-serif"
  },
  loginBox: {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 6px 32px rgba(60, 72, 88, 0.09), 0 1.5px 6px rgba(60, 72, 88, 0.03)',
    padding: '2.5rem 2rem 2rem 2rem',
    width: 320,
    margin: '2rem auto'
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '1.5rem'
  },
  fieldContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem'
  },
  label: {
    fontSize: '1rem',
    marginBottom: '0.3rem',
    color: '#222'
  },
  input: {
    width: '100%',
    padding: '0.6rem 0.8rem',
    border: '1px solid #d2dae3',
    borderRadius: 6,
    fontSize: '1rem',
    background: '#f9fafb',
    transition: 'border 0.2s',
    boxSizing: 'border-box'
  },
  inputFocus: {
    border: '1.5px solid #4466ee',
    background: '#fff'
  },
  button: {
    width: '100%',
    padding: '0.7rem 0',
    border: 'none',
    borderRadius: 6,
    background: '#4466ee',
    color: '#fff',
    fontSize: '1.08rem',
    fontWeight: 500,
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'background 0.2s'
  },
  buttonHover: {
    background: '#3554c7'
  },
  error: {
    color: '#d64545',
    fontSize: '0.96rem',
    marginBottom: '0.7rem',
    textAlign: 'center'
  }
};

function LoginForm({ onLogin }) {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [focusInput, setFocusInput] = useState({ user: false, pass: false });

  function handleSubmit(e) {
    e.preventDefault();
    if (userid === USERID && password === PASSWORD) {
      sessionStorage.setItem('isAuthenticated', 'true');
      onLogin();
    } else {
      setError('Invalid credentials');
    }
  }

  return (
    <div style={styles.appContainer}>
      <div style={styles.loginBox}>
        <h2 style={styles.title}>Login</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div style={styles.fieldContainer}>
            <label htmlFor="userid" style={styles.label}>User ID:</label>
            <input
              id="userid"
              type="text"
              value={userid}
              onChange={e => setUserid(e.target.value)}
              style={{
                ...styles.input,
                ...(focusInput.user ? styles.inputFocus : {})
              }}
              required
              autoFocus
              onFocus={() => setFocusInput(f => ({ ...f, user: true }))}
              onBlur={() => setFocusInput(f => ({ ...f, user: false }))}
            />
          </div>
          <div style={styles.fieldContainer}>
            <label htmlFor="password" style={styles.label}>Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                ...styles.input,
                ...(focusInput.pass ? styles.inputFocus : {})
              }}
              required
              onFocus={() => setFocusInput(f => ({ ...f, pass: true }))}
              onBlur={() => setFocusInput(f => ({ ...f, pass: false }))}
            />
          </div>
          {error && <div style={styles.error}>{error}</div>}
          <button
            type="submit"
            style={styles.button}
            onMouseOver={e => e.currentTarget.style.background = styles.buttonHover.background}
            onMouseOut={e => e.currentTarget.style.background = styles.button.background}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('isAuthenticated') === 'true'
  );

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <Suspense fallback={<div>Loading Home...</div>}>
            <Home />
          </Suspense>
        </ProtectedRoute>
      ),
    },
    {
      path: '/salary-slip/:employeeNumber',
      element: (
        <ProtectedRoute>
          <Suspense fallback={<div>Loading Salary Slip...</div>}>
            <SalarySlipPage />
          </Suspense>
        </ProtectedRoute>
      ),
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;