import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log('Form submitted');
        console.log('Credentials object:', credentials);
        console.log('Username length:', credentials.username.length);
        console.log('Password length:', credentials.password.length);

        // Validation
        if (!credentials.username || !credentials.password) {
            console.log('Validation failed: empty fields');
            toast.error('Veuillez remplir tous les champs');
            return;
        }

        console.log('Attempting login with username:', credentials.username, 'password:', credentials.password);

        // Simple authentication
        const usernameMatch = credentials.username === 'admin';
        const passwordMatch = credentials.password === 'admin123';
        
        console.log('Username match (admin):', usernameMatch);
        console.log('Password match (admin123):', passwordMatch);

        if (usernameMatch && passwordMatch) {
            console.log('✓ Login successful, setting adminAuth...');
            localStorage.setItem('adminAuth', 'true');
            console.log('✓ adminAuth set to:', localStorage.getItem('adminAuth'));
            toast.success('Connexion réussie');
            setTimeout(() => {
                console.log('→ Navigating to dashboard...');
                navigate('/admin/dashboard');
            }, 500);
        } else {
            console.log('✗ Login FAILED - credentials do not match');
            console.log('Expected: username="admin", password="admin123"');
            console.log('Got: username="' + credentials.username + '", password="' + credentials.password + '"');
            setErrorMessage('Identifiants incorrects');
            toast.error('Identifiants incorrects');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-black">
            <div className="card max-w-sm w-full bg-slate-900 border border-slate-800">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 mb-4">
                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
                    <p className="text-gray-400 text-sm">Espace réservé aux administrateurs</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    {errorMessage && (
                        <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-3 py-2 rounded text-sm">
                            {errorMessage}
                        </div>
                    )}
                    <div>
                        <label className="block text-gray-400 mb-1.5 text-xs font-medium uppercase tracking-wider">Nom d'utilisateur</label>
                        <input
                            type="text"
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="admin"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-1.5 text-xs font-medium uppercase tracking-wider">Mot de passe</label>
                        <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="btn-primary w-full mt-6">
                        Se connecter
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;

