import React, { Suspense, lazy } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home.jsx'));
const SalarySlipPage = lazy(() => import('./pages/SalarySlipPage.jsx'));

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<div>Loading Home...</div>}>
        <Home />
      </Suspense> 
    ),
  },
  {
    path: '/salary-slip/:employeeNumber',
    element: (
      <Suspense fallback={<div>Loading Salary Slip...</div>}>
        <SalarySlipPage />
      </Suspense>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
