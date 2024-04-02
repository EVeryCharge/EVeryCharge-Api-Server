import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./utils/AuthContext";
import ChargingServiceInfo from "./components/ChargingServiceInfo";
import EVSystem from "./components/EVSystem";
import StatisticsInfo from "./components/StatisticsInfo";
import ChargingStationMap from "./components/Common/ChargingStationMap";
import Footer from "./components/Layout/Footer";
import Navbar from "./components/Layout/NavBar";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import ReportList from "./pages/Report/ReportList";
import ReportDetail from "./pages/Report/ReportDetail";
import ReportForm from "./pages/Report/ReportForm";
import Signup from "./pages/Signup/Signup";
import { SelectedItemsProvider } from "./utils/StationInfoContext";
import ChargingStationSearch from "./pages/Search/ChargingStationSearch";
import Inquiry from "./pages/Inquiry/Inquiry";
import InquiryForm from "./pages/Inquiry/InquiryForm";
import InquiryDetail from "./pages/Inquiry/InquiryDetail";
import InquiryModifyform from "./pages/Inquiry/InquiryModifyform";
import ChargeFee from "./pages/ChargeFee/ChargeFee";
import My from "./pages/Mypage/My";
import CarInit from "./pages/Mypage/CarInit";
import Edit from "./pages/Mypage/Edit";
import ErrorPage from "./pages/Error/ErrorPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <SelectedItemsProvider>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<ChargingStationMap />} />
            <Route
              path="/chargingServiceInfo"
              element={<ChargingServiceInfo />}
            />
            <Route path="/evsystem" element={<EVSystem />} />
            <Route path="/statisticsInfo" element={<StatisticsInfo />} />
            <Route path="/report/list" element={<ReportList />} />
            <Route path="/report/:id" element={<ReportDetail />} />
            <Route path="/report/form" element={<ReportForm />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/search" element={<ChargingStationSearch />} />
            <Route path="/inquiry" element={<Inquiry />} />
            <Route path="/inquiry/form" element={<InquiryForm />} />
            <Route path="/inquiry/:id" element={<InquiryDetail />} />
            <Route path="/modify/:id" element={<InquiryModifyform />} />
            <Route path="/fee" element={<ChargeFee />} />
            <Route path="/my" element={<My />} />
            <Route path="/carInit" element={<CarInit />} />
            <Route path="/edit" element={<Edit />} />
            <Route
              path="*"
              element={
                <ErrorPage
                  errorCode="404 NOT FOUND"
                  errorTitle="요청하신 페이지를 찾을 수 없습니다."
                  errorDescription="입력하신 주소가 정확한지 확인해주세요."
                />
              }
            />
          </Routes>
          <Footer />
        </SelectedItemsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
