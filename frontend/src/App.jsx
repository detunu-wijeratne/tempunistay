import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public pages
import Home           from './pages/public/Home/Home';
import Login          from './pages/public/Login/Login';
import Register       from './pages/public/Register/Register';
import Properties     from './pages/public/Properties/Properties';
import PropertyDetail from './pages/public/PropertyDetail/PropertyDetail';
import Meals          from './pages/public/Meals/Meals';
import Services       from './pages/public/Services/Services';
import AboutUs        from './pages/public/AboutUs/AboutUs';
import ContactUs      from './pages/public/ContactUs/ContactUs';

// Student pages
import StudentDashboard   from './pages/student/Dashboard/StudentDashboard';
import StudentBooking     from './pages/student/Booking/StudentBooking';
import StudentMeals       from './pages/student/Meals/StudentMeals';
import StudentPayments    from './pages/student/Payments/StudentPayments';
import StudentMaintenance from './pages/student/Maintenance/StudentMaintenance';
import StudentCleaning    from './pages/student/Cleaning/StudentCleaning';
import StudentLaundry     from './pages/student/Laundry/StudentLaundry';
import StudentMessages    from './pages/student/Messages/StudentMessages';
import StudentSettings    from './pages/student/Settings/StudentSettings';

// Landlord pages
import LandlordDashboard   from './pages/landlord/Dashboard/LandlordDashboard';
import LandlordProperties  from './pages/landlord/Properties/LandlordProperties';
import LandlordAddProperty from './pages/landlord/AddProperty/LandlordAddProperty';
import LandlordBookings    from './pages/landlord/Bookings/LandlordBookings';
import LandlordTenants     from './pages/landlord/Tenants/LandlordTenants';
import LandlordPayments    from './pages/landlord/Payments/LandlordPayments';
import LandlordRequests    from './pages/landlord/Requests/LandlordRequests';
import LandlordMessages    from './pages/landlord/Messages/LandlordMessages';
import LandlordSettings    from './pages/landlord/Settings/LandlordSettings';

// Meal Provider pages
import MealDashboard from './pages/meal/Dashboard/MealDashboard';
import MealMenu      from './pages/meal/Menu/MealMenu';
import MealAddItem   from './pages/meal/AddItem/MealAddItem';
import MealOrders    from './pages/meal/Orders/MealOrders';
import MealSales     from './pages/meal/Sales/MealSales';
import MealMessages  from './pages/meal/Messages/MealMessages';
import MealSettings  from './pages/meal/Settings/MealSettings';

// Facility pages
import FacilityDashboard from './pages/facility/Dashboard/FacilityDashboard';
import FacilityRequests  from './pages/facility/Requests/FacilityRequests';
import FacilityJobs      from './pages/facility/Jobs/FacilityJobs';
import FacilityReports   from './pages/facility/Reports/FacilityReports';
import FacilityMessages  from './pages/facility/Messages/FacilityMessages';
import FacilitySettings  from './pages/facility/Settings/FacilitySettings';

// Protected route wrapper
const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

// Role → dashboard map
const roleDash = {
  student:       '/student/dashboard',
  landlord:      '/landlord/dashboard',
  meal_provider: '/meal/dashboard',
  facility:      '/facility/dashboard',
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      {/* Public */}
      <Route path="/"           element={<Home />} />
      <Route path="/login"      element={user ? <Navigate to={roleDash[user.role] || '/'} replace /> : <Login />} />
      <Route path="/register"   element={user ? <Navigate to={roleDash[user.role] || '/'} replace /> : <Register />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/properties/:id" element={<PropertyDetail />} />
      <Route path="/meals"      element={<Meals />} />
      <Route path="/services"   element={<Services />} />
      <Route path="/about"      element={<AboutUs />} />
      <Route path="/contact"    element={<ContactUs />} />

      {/* Student */}
      <Route path="/student/dashboard"   element={<PrivateRoute roles={['student']}><StudentDashboard /></PrivateRoute>} />
      <Route path="/student/booking"     element={<PrivateRoute roles={['student']}><StudentBooking /></PrivateRoute>} />
      <Route path="/student/meals"       element={<PrivateRoute roles={['student']}><StudentMeals /></PrivateRoute>} />
      <Route path="/student/payments"    element={<PrivateRoute roles={['student']}><StudentPayments /></PrivateRoute>} />
      <Route path="/student/maintenance" element={<PrivateRoute roles={['student']}><StudentMaintenance /></PrivateRoute>} />
      <Route path="/student/cleaning"    element={<PrivateRoute roles={['student']}><StudentCleaning /></PrivateRoute>} />
      <Route path="/student/laundry"     element={<PrivateRoute roles={['student']}><StudentLaundry /></PrivateRoute>} />
      <Route path="/student/messages"    element={<PrivateRoute roles={['student']}><StudentMessages /></PrivateRoute>} />
      <Route path="/student/settings"    element={<PrivateRoute roles={['student']}><StudentSettings /></PrivateRoute>} />

      {/* Landlord */}
      <Route path="/landlord/dashboard"   element={<PrivateRoute roles={['landlord']}><LandlordDashboard /></PrivateRoute>} />
      <Route path="/landlord/properties"  element={<PrivateRoute roles={['landlord']}><LandlordProperties /></PrivateRoute>} />
      <Route path="/landlord/add-property" element={<PrivateRoute roles={['landlord']}><LandlordAddProperty /></PrivateRoute>} />
      <Route path="/landlord/properties/add" element={<PrivateRoute roles={['landlord']}><LandlordAddProperty /></PrivateRoute>} />
      <Route path="/landlord/bookings"    element={<PrivateRoute roles={['landlord']}><LandlordBookings /></PrivateRoute>} />
      <Route path="/landlord/tenants"     element={<PrivateRoute roles={['landlord']}><LandlordTenants /></PrivateRoute>} />
      <Route path="/landlord/payments"    element={<PrivateRoute roles={['landlord']}><LandlordPayments /></PrivateRoute>} />
      <Route path="/landlord/requests"    element={<PrivateRoute roles={['landlord']}><LandlordRequests /></PrivateRoute>} />
      <Route path="/landlord/messages"    element={<PrivateRoute roles={['landlord']}><LandlordMessages /></PrivateRoute>} />
      <Route path="/landlord/settings"    element={<PrivateRoute roles={['landlord']}><LandlordSettings /></PrivateRoute>} />

      {/* Meal Provider */}
      <Route path="/meal/dashboard" element={<PrivateRoute roles={['meal_provider']}><MealDashboard /></PrivateRoute>} />
      <Route path="/meal/menu"      element={<PrivateRoute roles={['meal_provider']}><MealMenu /></PrivateRoute>} />
      <Route path="/meal/add-item"  element={<PrivateRoute roles={['meal_provider']}><MealAddItem /></PrivateRoute>} />
      <Route path="/meal/add"       element={<PrivateRoute roles={['meal_provider']}><MealAddItem /></PrivateRoute>} />
      <Route path="/meal/orders"    element={<PrivateRoute roles={['meal_provider']}><MealOrders /></PrivateRoute>} />
      <Route path="/meal/sales"     element={<PrivateRoute roles={['meal_provider']}><MealSales /></PrivateRoute>} />
      <Route path="/meal/messages"  element={<PrivateRoute roles={['meal_provider']}><MealMessages /></PrivateRoute>} />
      <Route path="/meal/settings"  element={<PrivateRoute roles={['meal_provider']}><MealSettings /></PrivateRoute>} />

      {/* Facility */}
      <Route path="/facility/dashboard" element={<PrivateRoute roles={['facility']}><FacilityDashboard /></PrivateRoute>} />
      <Route path="/facility/requests"  element={<PrivateRoute roles={['facility']}><FacilityRequests /></PrivateRoute>} />
      <Route path="/facility/jobs"      element={<PrivateRoute roles={['facility']}><FacilityJobs /></PrivateRoute>} />
      <Route path="/facility/reports"   element={<PrivateRoute roles={['facility']}><FacilityReports /></PrivateRoute>} />
      <Route path="/facility/messages"  element={<PrivateRoute roles={['facility']}><FacilityMessages /></PrivateRoute>} />
      <Route path="/facility/settings"  element={<PrivateRoute roles={['facility']}><FacilitySettings /></PrivateRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
