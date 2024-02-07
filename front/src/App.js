import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./components/AuthContext";
import ChargingServiceInfo from "./components/ChargingServiceInfo";
import ChargingStationInfo from "./components/ChargingStationInfo";
import EVSystem from "./components/EVSystem";
import StatisticsInfo from "./components/StatisticsInfo";
import MapContainer from "./containers/MapContainer";
import Footer from "./layout/Footer";
import Navbar from "./layout/NavBar";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import ReportList from "./pages/Report/ReportList";
import ReportDetail from "./pages/Report/ReportDetail";
import ReportForm from "./pages/Report/ReportForm";
import Signup from "./pages/Signup/Signup";
import Inquiry from "./pages/Inquiry/Inquiry";
import InquiryForm from "./pages/Inquiry/InquiryForm";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<MapContainer />} />
          <Route
            path="/chargingServiceInfo"
            element={<ChargingServiceInfo />}
          />
          <Route
            path="/chargingStationInfo"
            element={<ChargingStationInfo />}
          />
          <Route path="/evsystem" element={<EVSystem />} />
          <Route path="/statisticsInfo" element={<StatisticsInfo />} />
          <Route path="/report/list" element={<ReportList />} />
          <Route path="/report/:id" element={<ReportDetail />} />
          <Route path="/report/form" element={<ReportForm />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/inquiry" element={<Inquiry />} />
          <Route path="/inquiry/form" element={<InquiryForm />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;
