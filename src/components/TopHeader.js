import React from 'react';
import { useNavigate } from 'react-router-dom';

const TopHeader = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <h3 className="navbar-brand">Tasks App</h3>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <button onClick={handleLogout} className="btn btn-sm btn-warning"><i className='fas fa-sign-out'></i> Sair</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default TopHeader;
