import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";


import Home from "./Components/Home/Home";
import HomeHeader from "./Components/Home/Header";






import ResidentHeader from "./Components/Resident/Header";
import ProviderHeader from "./Components/ServiceProvider/Header";
import AdminHeader from "./Components/Admin/Header";
import AdministratorHeader from "./Components/Administrator/AdministratorHeader";
import ViewSocieties from "./Components/Administrator/ViewSocities";
import AdministratorDashboard from "./Components/Administrator/AdministratorDashboard";

import Footer from "./Components/Resident/Footer";

import ResidentEditProfile from "./Components/Resident/EditProfile";
import ResidentDashboard from "./Components/Resident/ResidentDashboard";
import Notifications from "./Components/Resident/Notifications";
import TrackComplaint from "./Components/Resident/TrackComplaint";
import HouseholdComplaint from "./Components/Resident/HouseholdComplaint";
import SocietyLevelComplaints from "./Components/Resident/SocietyComplaint";
import ComplaintHistory from "./Components/Resident/ComplaintHistory";
import Bids from "./Components/Resident/Bids";

import ResidentRegister from "./Components/Auth/ResidentRegister";
import AdminRegister from "./Components/Auth/SocietyRegister";
import VerifyOtp from "./Components/Auth/VerifyOtp";
import PendingApproval from "./Components/Auth/PendingApproval";
import AdministratorLogin from "./Components/Auth/AdministratorLogin";
import ForgotPassword from "./Components/Auth/ForgotPassword";
import SocietyRequests from "./Components/Administrator/SocietyRequests";

import ProviderRegister from "./Components/Auth/ProviderRegister";

import ProviderEditProfile from "./Components/ServiceProvider/EditProfile";
import ProviderDashboard from "./Components/ServiceProvider/ProviderDashboard";
import AvailableComplaints from "./Components/ServiceProvider/AvailableComplaints";
import SocietyComplaints from "./Components/ServiceProvider/SocietyComplaints";
import ProviderResolvedComplaints from "./Components/ServiceProvider/ProviderResolvedComplaints";
import UnsatisfactoryComplaints from "./Components/ServiceProvider/UnsatisfactoryComplaints";
import ProviderNotifications from "./Components/ServiceProvider/ProviderNotifications";
import ViewProviderFeedback from "./Components/ServiceProvider/ViewProviderFeedback";
import HouseholdComplaints from "./Components/ServiceProvider/HouseholdComplaints";


import AdminEditProfile from "./Components/Admin/EditProfile";
import ListOfBids from "./Components/Admin/ListOfBids";
import VerifyComplaints from "./Components/Admin/VerifyComplaints";
import ViewPayments from "./Components/Admin/ViewPayments";
import TotalComplaints from "./Components/Admin/TotalComplaints";
import AuthorityComplaints from "./Components/Admin/AuthorityComplaints";
import ResolvedComplaints from "./Components/Admin/ResolvedComplaints";
import ProviderRequests from "./Components/Admin/ProviderRequests";
import ListOfProviders from "./Components/Admin/ListOfProviders";
import ResidentRequests from "./Components/Admin/ResidentRequests";
import PendingComplaints from "./Components/Admin/PendingComplaints";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import ViewFeedback from "./Components/Admin/ViewFeedback";
import AdminNotifications from "./Components/Admin/AdminNotifications";


import ProtectedRoute from "./utils/ProtectedRoute";

import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";

function Layout() {
  const location = useLocation();
  const path = location.pathname;

  const isPublicPage = [
    "/",
    "/about",
    "/privacy-policy",
    "/terms",
    "/resident-register",
    "/admin-register",
    "/provider-register",
    "/verify-otp",
    "/pending-approval",
    "/administrator-login",
    "/forgot-password",
    
    
   
  ].includes(path);

  const isProviderPage = path.startsWith("/provider");
  const isAdminPage = path.startsWith("/admin");
  const isAdministratorPage = path.startsWith("/sadmin");


  const renderHeader = () => {
    if (isPublicPage) return <HomeHeader />;
    if (isAdminPage) return <AdminHeader />;
    if (isAdministratorPage) return <AdministratorHeader />;
    if (isProviderPage) return <ProviderHeader />;
    return <ResidentHeader />;
  };

  return (
    <div style={styles.layout}>
      {renderHeader()}

      <div style={styles.content}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/sadmin-societies" element={<ViewSocieties />} />
          <Route path="/sadmin-dashboard" element={<AdministratorDashboard />} />


          <Route path="/resident-register" element={<ResidentRegister />} />
          <Route path="/admin-register" element={<AdminRegister />} />
           <Route path="/administrator-login" element={<AdministratorLogin />} />
           <Route path="/forgot-password" element={<ForgotPassword />} />
           <Route path="/sadmin-requests" element={<SocietyRequests />} />

          <Route path="/provider-register" element={<ProviderRegister />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/pending-approval" element={<PendingApproval />} />

          <Route path="/resident-dashboard" element={<ProtectedRoute>
        <ResidentDashboard />
      </ProtectedRoute>} />
          <Route path="/edit-profile" element={<ResidentEditProfile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/track-complaint" element={<TrackComplaint />} />
          <Route path="/complaint-history" element={<ComplaintHistory />} />
          <Route path="/household-complaint"element={<HouseholdComplaint />}/>
           <Route path="/resident-bids" element={<Bids />} />
           <Route path="/society-level-complaint"element={<SocietyLevelComplaints />}/>
           
          <Route path="/provider/edit-profile" element={<ProviderEditProfile />}/>
          <Route path="/provider-dashboard" element={<ProtectedRoute><ProviderDashboard /></ProtectedRoute>} />
          <Route path="/provider-available-complaints" element={<AvailableComplaints />} />
          <Route path="/provider-society-complaints" element={<SocietyComplaints />} />
          <Route path="/provider-resolved-complaints" element={<ProviderResolvedComplaints />} />
          <Route path="/provider-unsatisfactory" element={<UnsatisfactoryComplaints />} />
          <Route path="/provider-notifications" element={<ProviderNotifications />} />
          <Route path="/provider-feedback" element={<ViewProviderFeedback />}/>
          <Route path="/provider-household-complaints" element={<HouseholdComplaints />} />

          <Route path="/admin/edit-profile" element={<AdminEditProfile />} />
          <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin-notifications" element={<AdminNotifications />} />
          <Route path="/admin-bids" element={<ListOfBids />} />
          <Route path="/admin-verify-complaints" element={<VerifyComplaints />} />
          <Route path="/admin-total-complaints" element={<TotalComplaints />} />
          <Route path="/admin-authority-complaints" element={<AuthorityComplaints />} />
          <Route path="/admin-payment-records" element={<ViewPayments />} />
          <Route path="/admin-resolved-complaints" element={<ResolvedComplaints />}/>
          <Route path="/admin-pending-complaints"element={<PendingComplaints />}/>
          <Route path="/admin-provider-requests"element={<ProviderRequests />}/>
          <Route path="/admin-providers" element={<ListOfProviders />}/>
          <Route path="/admin-resident-requests" element={<ResidentRequests />} />
          

          <Route path="/admin-view-feedback" element={<ViewFeedback />} />

        </Routes>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

const styles = {
  layout: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    width: "100%",
  },
};

export default App;
