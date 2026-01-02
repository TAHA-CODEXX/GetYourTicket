import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ThreeScene from './components/ThreeScene';

// User Pages
import Home from './pages/Home';
import Events from './pages/Events';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import EventsManagement from './pages/admin/EventsManagement';
import OrdersManagement from './pages/admin/OrdersManagement';

import { Toaster } from 'react-hot-toast';

const BackgroundWrapper = ({ children }) => {
  const location = useLocation();
  const showThreeScene = ['/', '/events', '/contact'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 relative">
      {showThreeScene && <ThreeScene />}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #334155',
            },
          }}
        />
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <BackgroundWrapper>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />

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
      </BackgroundWrapper>
    </Router>
  );
}

export default App;
