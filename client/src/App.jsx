import React from 'react';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from './pages/Home.jsx';
import SalarySlipPage from "./pages/SalarySlipPage.jsx";

// Define all application routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/salary-slip/:employeeNumber", // Dynamic route
    element: <SalarySlipPage />
  }
]);

// Main app component
function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
