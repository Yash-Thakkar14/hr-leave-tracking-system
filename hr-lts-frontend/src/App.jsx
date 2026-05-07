import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBaseRoutes from "./utils/RoleBaseRoutes";
import AdminSummary from "./components/Admin/AdminSummary";
import BradfordReport from "./components/Admin/BradfordReport";
import AbsenceTrends from "./components/Admin/AbscenceTrends";
import PatternFlags from "./components/Admin/PatternFlags";
import DepartmentList from "./components/Department/DepartmentList";
import AddDepartment from "./components/Department/AddDepartment";
import EditDepartment from "./components/Department/EditDepartment";
import EmployeeList from "./components/Employee/EmployeeList";
import AddEmployee from "./components/Employee/AddEmployee";
import ViewEmployee from "./components/Employee/ViewEmployee";
import EditEmployee from "./components/Employee/EditEmployee";
import EmployeeLeaves from "./components/Employee/EmployeeLeaves";
import LeaveList from "./components/Leave/LeaveList";
import AddLeave from "./components/Leave/AddLeave";
import MyLeaves from "./components/Leave/MyLeaves";
import Unauthorized from "./pages/Unauthorized";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["admin"]}>
                <AdminDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<AdminSummary />} />
          <Route path="departments" element={<DepartmentList />} />
          <Route path="add-department" element={<AddDepartment />} />
          <Route path="department/:id" element={<EditDepartment />} />
          <Route path="employees" element={<EmployeeList />} />
          <Route path="add-employee" element={<AddEmployee />} />
          <Route path="employees/:id" element={<ViewEmployee />} />
          <Route path="employees/edit/:id" element={<EditEmployee />} />
          <Route path="employees/:id/leaves" element={<EmployeeLeaves />} />
          <Route path="leaves" element={<LeaveList />} />
          <Route path="reports/bradford" element={<BradfordReport />} />
          <Route path="reports/trends" element={<AbsenceTrends />} />
          <Route path="reports/patterns" element={<PatternFlags />} />
        </Route>

        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["employee"]}>
                <EmployeeDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<MyLeaves />} />
          <Route path="apply" element={<AddLeave />} />
          <Route path="my-leaves" element={<MyLeaves />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
