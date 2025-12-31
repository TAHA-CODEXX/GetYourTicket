import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const authValue = localStorage.getItem('adminAuth');
    const isAuthenticated = authValue === 'true';
    
    console.log('ProtectedRoute check - adminAuth value:', authValue, 'isAuthenticated:', isAuthenticated);

    if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to login');
        return <Navigate to="/admin/login" replace />;
    }

    console.log('Authenticated, rendering protected component');
    return children;
};

export default ProtectedRoute;

