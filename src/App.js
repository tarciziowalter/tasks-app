// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Tasks from './Tasks';
import TaskForm from './TaskForm';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const isAuthenticated = localStorage.getItem('token'); // Verifica se o usuário está autenticado

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/tasks" element={isAuthenticated ? <Tasks /> : <Navigate to="/login" />} />
                <Route path="/" element={isAuthenticated ? <Navigate to="/tasks" /> : <Navigate to="/login" />} />
                <Route path="/tasks/:id/edit" element={isAuthenticated ? <TaskForm /> : <Navigate to="/login" />} />
                <Route exact path="/tasks/new" element={isAuthenticated ? <TaskForm /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
