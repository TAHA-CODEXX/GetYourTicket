import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import EventsManagement from './pages/admin/EventsManagement';
import Events from './pages/Events';
import Navbar from './components/Navbar';
import Cart from './pages/Cart';  
import OrdersManagement from './pages/admin/OrdersManagement';
import Checkout from './pages/Checkout';
function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />
        <Routes>
          <Route path="/checkout" element={<Checkout />} />
           <Route path="/events" element={<Events />} />
           <Route path="/cart" element={<Cart />} />
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <ProtectedRoute>
                <EventsManagement />
              </ProtectedRoute>
            }
          />
           <Route
            path="/admin/orders"
            element={
              <ProtectedRoute>
                <OrdersManagement />
              </ProtectedRoute>
            }
          />
        </Routes>
    </Router>
  );
}

export default App;