import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = lazy(() => import("./pages/auth/Register"));
const Login = lazy(() => import("./pages/auth/Login"));
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./components/NotFound"));
const VerifyEmail = lazy(() => import("./pages/auth/VerifyEmail"));
const ForgetPassword = lazy(() => import("./pages/auth/ForgetPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));

function App() {
  return (
    <Router>
      <>
        {/* ToastContainer added globally */}
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/verify-email" element={<VerifyEmail />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/forget-password" element={<ForgetPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </>
    </Router>
  );
}

export default App;
