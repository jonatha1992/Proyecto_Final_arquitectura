import React from "react";
import { Link } from "react-router-dom";
import "./Precios.css";

export default function Precios() {
    const services = [
        {
            icon: '😊',
            name: 'Depilación Facial',
            price: '$15,000',
            duration: '30 minutos',
            includes: ['Cejas', 'Labio superior', 'Mentón', 'Mejillas'],
            popular: false
        },
        {
            icon: '✋',
            name: 'Axilas',
            price: '$12,000',
            duration: '20 minutos',
            includes: ['Ambas axilas', 'Resultados duraderos', 'Sin irritación'],
            popular: true
        },
        {
            icon: '🦵',
            name: 'Piernas Completas',
            price: '$45,000',
            duration: '90 minutos',
            includes: ['Muslos', 'Pantorrillas', 'Pies', 'Rodillas'],
            popular: false
        },
        {
            icon: '👙',
            name: 'Bikini',
            price: '$25,000',
            duration: '45 minutos',
            includes: ['Zona íntima', 'Brasileño disponible', 'Máxima privacidad'],
            popular: false
        },
        {
            icon: '💪',
            name: 'Brazos Completos',
            price: '$28,000',
            duration: '50 minutos',
            includes: ['Antebrazos', 'Brazos superiores', 'Manos', 'Dedos'],
            popular: false
        },
        {
            icon: '🏔️',
            name: 'Espalda',
            price: '$35,000',
            duration: '60 minutos',
            includes: ['Espalda alta', 'Espalda baja', 'Hombros'],
            popular: false
        }
    ];

    const packages = [
        {
            name: 'Paquete Básico',
            price: '$65,000',
            originalPrice: '$82,000',
            discount: '20% OFF',
            includes: ['Axilas', 'Depilación Facial', '6 sesiones'],
            className: 'package-basic'
        },
        {
            name: 'Paquete Premium',
            price: '$120,000',
            originalPrice: '$150,000',
            discount: '20% OFF',
            includes: ['Piernas Completas', 'Axilas', 'Bikini', '8 sesiones'],
            className: 'package-premium',
            popular: true
        },
        {
            name: 'Paquete Full Body',
            price: '$200,000',
            originalPrice: '$280,000',
            discount: '30% OFF',
            includes: ['Todas las zonas', 'Tratamiento completo', '10 sesiones'],
            className: 'package-full'
        }
    ];

    return (
        <div className="precios-container">
            <div className="precios-header">
                <h1 className="precios-title">
                    💰 Precios y Servicios
                </h1>
                <p className="precios-subtitle">
                    Descubre nuestros tratamientos de depilación definitiva con tecnología láser de última generación
                </p>
            </div>

            {/* Servicios Individuales */}
            <h2 className="section-title first">
                Servicios Individuales
            </h2>
            <div className="pricing-grid">
                {services.map((service, index) => (
                    <div
                        key={index}
                        className={`price-card ${service.popular ? 'popular' : ''}`}
                    >
                        {service.popular && (
                            <div className="popular-badge">
                                MÁS POPULAR
                            </div>
                        )}

                        <div className="service-icon">
                            {service.icon}
                        </div>
                        <h3 className="service-name">
                            {service.name}
                        </h3>
                        <div className="service-price">{service.price}</div>
                        <p className="service-duration">
                            Duración: {service.duration}
                        </p>
                        <ul className="service-includes">
                            {service.includes.map((item, i) => (
                                <li key={i}>
                                    ✅ {item}
                                </li>
                            ))}
                        </ul>
                        <Link to="/turnos" className="btn-primary">
                            Reservar Turno
                        </Link>
                    </div>
                ))}
            </div>

            {/* Paquetes Promocionales */}
            <h2 className="section-title">
                🎉 Paquetes Promocionales
            </h2>
            <div className="pricing-grid">
                {packages.map((pkg, index) => (
                    <div
                        key={index}
                        className={`price-card ${pkg.className} ${pkg.popular ? 'popular' : ''}`}
                    >
                        {pkg.popular && (
                            <div className="recommended-badge">
                                RECOMENDADO
                            </div>
                        )}

                        <div className="package-header">
                            {pkg.name}
                        </div>

                        <div className="package-discount">
                            {pkg.discount}
                        </div>

                        <div className="package-original-price">
                            {pkg.originalPrice}
                        </div>

                        <div className="service-price">
                            {pkg.price}
                        </div>

                        <ul className="service-includes">
                            {pkg.includes.map((item, i) => (
                                <li key={i}>
                                    ⭐ {item}
                                </li>
                            ))}
                        </ul>

                        <Link to="/turnos" className="btn-primary">
                            Adquirir Paquete
                        </Link>
                    </div>
                ))}
            </div>

            {/* Información Adicional */}
            <div className="info-section">
                <h3>
                    ℹ️ Información Importante
                </h3>
                <div className="info-grid">
                    <div className="info-item">
                        <h4>💳 Formas de Pago</h4>
                        <ul>
                            <li>Efectivo (10% descuento)</li>
                            <li>Tarjeta de débito/crédito</li>
                            <li>Transferencia bancaria</li>
                            <li>Financiación hasta 12 cuotas</li>
                        </ul>
                    </div>
                    <div className="info-item">
                        <h4>🎯 Sesiones Requeridas</h4>
                        <ul>
                            <li>6-8 sesiones para resultados óptimos</li>
                            <li>Intervalos de 4-6 semanas</li>
                            <li>Evaluación gratuita inicial</li>
                            <li>Garantía de satisfacción</li>
                        </ul>
                    </div>
                    <div className="info-item">
                        <h4>🛡️ Nuestra Garantía</h4>
                        <ul>
                            <li>Equipos certificados FDA</li>
                            <li>Personal especializado</li>
                            <li>Protocolo de seguridad</li>
                            <li>Seguimiento post-tratamiento</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* CTA Final */}
            <div className="cta-section">
                <h3>
                    ¿Tienes dudas sobre nuestros precios?
                </h3>
                <div>
                    <Link to="/chatbot" className="btn-success">
                        🤖 Consultar Asistente
                    </Link>
                    <Link to="/turnos" className="btn-primary">
                        📅 Agendar Consulta Gratuita
                    </Link>
                </div>
            </div>
        </div>
    );
}
