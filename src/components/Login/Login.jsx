import React, { useState } from 'react';
import './Login.css';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {

    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (username === '' || password === '') {
            setError('Por favor, completa todos os campos.');
        } else {
            setError('');
            try {
                await login(username, password);
                toast.success('Sesión iniciada correctamente');
                
            } catch (err) {
                setError('Error ao iniciar sesión. Por favor, verifica as túas credenciais.');
                console.error('Error ao iniciar sesión:', err);
            }
        }
    };
    

    return (
        <div className="login-container">
           
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Usuario:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contrasinal:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button className="form-button submit" type="submit">Ingresar</button>
            </form>
        </div>
    );
};

export default Login;