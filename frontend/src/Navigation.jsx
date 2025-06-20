import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import './Navigation.css';

const Navigation = () => {
    const location = useLocation();
    const { currentUser, logout } = useAuth();

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/precios', label: 'Precios', icon: '💰' },
        { path: '/chatbot', label: 'Asistente', icon: '🤖' }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navigation">
            <div className="nav-container">
                <div className="nav-brand">
                    <span className="nav-logo">✨</span>
                    <span className="nav-title">Depilación Definitiva</span>
                </div>

                <div className="nav-menu">
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    ))}
                </div>

                <div className="nav-user">
                    <div className="user-info">
                        <span className="user-name">
                            {currentUser?.displayName || currentUser?.email}
                        </span>
                        <button onClick={logout} className="logout-btn">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
