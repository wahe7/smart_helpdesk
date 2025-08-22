import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tickets from "./pages/Tickets";
import TicketDetail from "./pages/TicketDetail";
import KB from "./pages/KB";
import Navbar from "./components/Navbar";

function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <div>{children}</div>
    </div>
  );
}

function PrivateRoute({ children, roles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/" />;
  if (roles && !roles.includes(role)) return <Navigate to="/tickets" />;

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/tickets" element={
          <PrivateRoute><Layout><Tickets /></Layout></PrivateRoute>
        } />

        <Route path="/tickets/:id" element={
          <PrivateRoute><Layout><TicketDetail /></Layout></PrivateRoute>
        } />

        <Route path="/kb" element={
          <PrivateRoute roles={["admin"]}>
            <Layout><KB /></Layout>
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
