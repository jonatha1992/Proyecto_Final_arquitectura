import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    const heroStyle = {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center',
        marginBottom: '3rem'
    };

    const containerStyle = {
        maxWidth: '1200px',
        margin: '0 auto'
    };

    const featuresStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        padding: '0 2rem',
        marginBottom: '3rem'
    };

    const featureCardStyle = {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        textAlign: 'center',
        transition: 'transform 0.3s ease'
    };

    const ctaStyle = {
        backgroundColor: 'white',
        padding: '3rem 2rem',
        textAlign: 'center',
        borderRadius: '15px',
        margin: '0 2rem',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
    };

    const buttonStyle = {
        backgroundColor: '#2196F3',
        color: 'white',
        padding: '12px 30px',
        border: 'none',
        borderRadius: '25px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        textDecoration: 'none',
        display: 'inline-block',
        margin: '0 10px',
        transition: 'all 0.3s ease'
    };

    return (
        <div>
            {/* Hero Section */}
            <div style={heroStyle}>
                <div style={containerStyle}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                        ✨ Depilación Definitiva de Última Generación
                    </h1>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
                        Tecnología láser avanzada para resultados duraderos y seguros
                    </p>
                    <Link
                        to="/turnos"
                        style={{
                            ...buttonStyle,
                            backgroundColor: 'white',
                            color: '#2196F3',
                            fontSize: '18px',
                            padding: '15px 40px'
                        }}
                    >
                        🗓️ Reservar Turno
                    </Link>
                </div>
            </div>

            {/* Features Section */}
            <div style={containerStyle}>
                <h2 style={{ textAlign: 'center', marginBottom: '3rem', color: '#333', fontSize: '2.5rem' }}>
                    ¿Por qué elegir nuestro centro?
                </h2>

                <div style={featuresStyle}>
                    <div style={featureCardStyle}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔬</div>
                        <h3 style={{ color: '#2196F3', marginBottom: '1rem' }}>Tecnología Avanzada</h3>
                        <p style={{ color: '#666', lineHeight: '1.6' }}>
                            Equipos láser de última generación que garantizan resultados efectivos y seguros para todos los tipos de piel.
                        </p>
                    </div>

                    <div style={featureCardStyle}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👩‍⚕️</div>
                        <h3 style={{ color: '#2196F3', marginBottom: '1rem' }}>Profesionales Expertos</h3>
                        <p style={{ color: '#666', lineHeight: '1.6' }}>
                            Nuestro equipo de especialistas certificados te brindará el mejor cuidado y atención personalizada.
                        </p>
                    </div>

                    <div style={featureCardStyle}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
                        <h3 style={{ color: '#2196F3', marginBottom: '1rem' }}>Resultados Rápidos</h3>
                        <p style={{ color: '#666', lineHeight: '1.6' }}>
                            Observa resultados visibles desde las primeras sesiones. Tratamiento completo en 6-8 sesiones.
                        </p>
                    </div>

                    <div style={featureCardStyle}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
                        <h3 style={{ color: '#2196F3', marginBottom: '1rem' }}>100% Seguro</h3>
                        <p style={{ color: '#666', lineHeight: '1.6' }}>
                            Procedimientos completamente seguros con equipos aprobados por organismos internacionales.
                        </p>
                    </div>

                    <div style={featureCardStyle}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
                        <h3 style={{ color: '#2196F3', marginBottom: '1rem' }}>Precios Accesibles</h3>
                        <p style={{ color: '#666', lineHeight: '1.6' }}>
                            Ofrecemos los mejores precios del mercado con planes de financiación disponibles.
                        </p>
                    </div>

                    <div style={featureCardStyle}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
                        <h3 style={{ color: '#2196F3', marginBottom: '1rem' }}>Asistente 24/7</h3>
                        <p style={{ color: '#666', lineHeight: '1.6' }}>
                            Nuestro chatbot inteligente está disponible las 24 horas para resolver tus consultas.
                        </p>
                    </div>
                </div>

                {/* CTA Section */}
                <div style={ctaStyle}>
                    <h2 style={{ color: '#333', marginBottom: '1rem', fontSize: '2rem' }}>
                        ¿Listo para comenzar tu transformación?
                    </h2>
                    <p style={{ color: '#666', marginBottom: '2rem', fontSize: '1.1rem' }}>
                        Agenda tu consulta gratuita y descubre cómo podemos ayudarte a conseguir la piel que siempre quisiste.
                    </p>
                    <div>
                        <Link to="/turnos" style={buttonStyle}>
                            📅 Agendar Consulta
                        </Link>
                        <Link to="/precios" style={{ ...buttonStyle, backgroundColor: '#4CAF50' }}>
                            💰 Ver Precios
                        </Link>
                        <Link to="/chatbot" style={{ ...buttonStyle, backgroundColor: '#ff9800' }}>
                            🤖 Consultar Ahora
                        </Link>
                    </div>
                </div>

                {/* Services Preview */}
                <div style={{ margin: '4rem 2rem' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
                        Nuestros Servicios Más Populares
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {[
                            { name: 'Depilación Facial', price: '$15,000', duration: '30 min', icon: '😊' },
                            { name: 'Piernas Completas', price: '$45,000', duration: '90 min', icon: '🦵' },
                            { name: 'Axilas', price: '$12,000', duration: '20 min', icon: '✋' },
                            { name: 'Bikini', price: '$25,000', duration: '45 min', icon: '👙' }
                        ].map((service, index) => (
                            <div key={index} style={{
                                backgroundColor: 'white',
                                padding: '1.5rem',
                                borderRadius: '10px',
                                textAlign: 'center',
                                boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
                                border: '1px solid #e0e0e0'
                            }}>
                                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{service.icon}</div>
                                <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>{service.name}</h3>
                                <p style={{ color: '#2196F3', fontWeight: 'bold', fontSize: '1.2rem', margin: '0.5rem 0' }}>
                                    {service.price}
                                </p>
                                <p style={{ color: '#666', fontSize: '0.9rem' }}>Duración: {service.duration}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
