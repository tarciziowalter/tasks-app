import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // Inicialize o hook useNavigate

    // Verifica se o usuário já está autenticado ao acessar a página de login
    const isAuthenticated = localStorage.getItem('token');
    if (isAuthenticated) {
        navigate('/tasks');
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login', {
                email,
                password,
                device_name: 'Windows',
            });

            const { token } = response.data;

            localStorage.setItem('token', token); // Armazena o token no armazenamento local
            navigate('/tasks');

        } catch (error) {
            if (error.response && error.response.data) {
                const { data } = error.response;
                const errorMessage = data.message || 'Erro desconhecido';
                setErrorMessage(errorMessage);
            } else {
                setErrorMessage('Erro desconhecido');
            }
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card border-0 rounded-0" style={{ maxWidth: '400px', backgroundColor: '#f7f7f7' }}>
                <div className="card-body">
                    <h4 className="card-title mb-4">Tasks App</h4>
                    {errorMessage && <div className="alert alert-danger mb-3">{errorMessage}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email:</label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password:</label>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
