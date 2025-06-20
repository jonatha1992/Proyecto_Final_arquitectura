import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div>
            <h1>Bienvenido a Depilación Definitiva</h1>
            <p>Reserva tu turno, consulta precios y chatea con nuestro asistente virtual.</p>
            <nav>
                <ul>
                    <li><Link to="/turnos">Turnos</Link></li>
                    <li><Link to="/precios">Precios</Link></li>
                    <li><Link to="/chatbot">Chatbot</Link></li>
                </ul>
            </nav>
        </div>
    );
}
