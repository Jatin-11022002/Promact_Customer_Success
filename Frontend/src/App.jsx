import React from "react";
import Layout from "src/Layout";
import Login from "src/components/user/Login.jsx";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "src/components/routing/Protected-Route.jsx";
import Client from "src/components/dashboard/Client.jsx";
import Project from "src/components/project/Project.jsx";
import CreateProject from "src/components/project/Create-Project.jsx";
import CreateUser from "src/components/user/Create-User.jsx";
import UpdateUserPassword from "src/components/user/Update-User-Password.jsx";

// Main component defining the application routes
const App = () => {
  return (
    <Routes>
      {/* Route for login page */}
      <Route path="/login" element={<Login />}></Route>

      <Route path="/createUserLogin/?" element={<UpdateUserPassword />}></Route>
      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute />}>
        {/* Layout component containing navigation */}
        <Route path="/" element={<Layout />}>
          {/* Route for home page */}
          <Route path="/" element={<Client />}></Route>
          {/* Route for adding a new project */}
          <Route path="/addProject" element={<CreateProject />}></Route>
          {/* Route for adding a new user */}
          <Route path="/addUser" element={<CreateUser />}></Route>
          {/* Route for displaying project details */}
          <Route path="/project/:id" element={<Project />}></Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
