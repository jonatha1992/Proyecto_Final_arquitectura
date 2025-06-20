import React, { useState, useEffect } from "react";
import { auth } from "./firebase";

export default function Chatbot() {
    const [messages, setMessages] = useState([
        { from: "bot", text: "¡Hola! Soy tu asistente de depilación definitiva. Puedo ayudarte con consultas sobre turnos, precios y servicios. ¿En qué te puedo ayudar?" }
    ]);
    const [input, setInput] = useState("");
    const [turnos, setTurnos] = useState([]);
    const [loading, setLoading] = useState(false);

    // Cargar turnos del usuario al inicializar
    useEffect(() => {
        fetchTurnos();
    }, []);

    const fetchTurnos = async () => {
        try {
            const response = await fetch('http://localhost:5000/turnos');
            if (response.ok) {
                const data = await response.json();
                setTurnos(data);
            }
        } catch (error) {
            console.log('Error al cargar turnos:', error);
        }
    }; const generateBotResponse = async (userMessage) => {
        const message = userMessage.toLowerCase();

        // Respuestas sobre turnos
        if (message.includes("turnos") || message.includes("citas") || message.includes("reservas")) {
            if (message.includes("mis turnos") || message.includes("ver turnos")) {
                const user = auth.currentUser;
                if (!user) {
                    return "Para ver tus turnos necesitas iniciar sesión primero.";
                }

                const userTurnos = turnos.filter(t => t.usuario === user.email);
                if (userTurnos.length === 0) {
                    return "No tienes turnos registrados. ¿Te gustaría que te ayude a crear uno?";
                }

                let response = `Tienes ${userTurnos.length} turno(s) registrado(s):\n\n`;
                userTurnos.forEach((turno, index) => {
                    response += `${index + 1}. Fecha: ${turno.fecha} a las ${turno.hora}\n`;
                    response += `   Estado: ${turno.estado}\n`;
                    if (turno.descripcion) {
                        response += `   Servicio: ${turno.descripcion}\n`;
                    }
                    response += '\n';
                });
                return response;
            }

            if (message.includes("crear") || message.includes("nuevo") || message.includes("reservar")) {
                return "Para crear un nuevo turno, ve a la sección 'Dashboard' donde podrás seleccionar fecha, hora y tipo de servicio. ¿Necesitas ayuda con algo específico sobre los turnos?";
            }

            if (message.includes("cancelar") || message.includes("eliminar")) {
                return "Para cancelar un turno existente, ve al Dashboard y usa el botón 'Eliminar' junto al turno que deseas cancelar. ¿Hay algún turno específico que necesites modificar?";
            }

            return "Puedo ayudarte con:\n• Ver tus turnos existentes\n• Crear nuevos turnos\n• Cancelar turnos\n• Modificar turnos existentes\n\n¿Qué te interesa hacer?";
        }

        // Respuestas sobre precios
        if (message.includes("precio") || message.includes("costo") || message.includes("cuánto")) {
            if (message.includes("facial") || message.includes("cara")) {
                return "💰 Depilación Facial: $15,000\nIncluye: cejas, labio superior, mentón\nDuración: 30 minutos\n\n¿Te gustaría reservar un turno?";
            }
            if (message.includes("piernas") || message.includes("completas")) {
                return "💰 Piernas Completas: $45,000\nIncluye: muslos y pantorrillas\nDuración: 90 minutos\n\n¿Te interesa agendar una cita?";
            }
            if (message.includes("axilas") || message.includes("axila")) {
                return "💰 Axilas: $12,000\nDuración: 20 minutos\nResultados duraderos\n\n¿Quieres más información?";
            }
            return "Puedes ver todos nuestros precios en la sección 'Precios'. Tenemos servicios desde $8,000. ¿Hay algún área específica que te interese?";
        }

        // Respuestas sobre servicios
        if (message.includes("servicio") || message.includes("tratamiento") || message.includes("depilación")) {
            return "🌟 Nuestros servicios de depilación definitiva incluyen:\n\n• Depilación facial (cejas, labio, mentón)\n• Piernas completas\n• Axilas\n• Bikini\n• Brazos\n• Espalda\n\nUsamos tecnología láser de última generación. ¿Qué área te interesa tratar?";
        }

        // Respuestas sobre horarios
        if (message.includes("horario") || message.includes("hora") || message.includes("cuándo")) {
            return "🕒 Nuestros horarios de atención:\n• Lunes a Viernes: 9:00 - 19:00\n• Sábados: 9:00 - 17:00\n• Domingos: Cerrado\n\n¿Te gustaría reservar un turno?";
        }

        // Respuestas sobre ubicación
        if (message.includes("ubicación") || message.includes("dirección") || message.includes("dónde")) {
            return "📍 Nos encontramos en:\nAv. Principal 123, Centro\nCiudad, País\n\n🚗 Fácil acceso en transporte público\n🅿️ Estacionamiento disponible";
        }

        // Respuestas sobre duración del tratamiento
        if (message.includes("sesiones") || message.includes("duración") || message.includes("cuántas")) {
            return "📅 El tratamiento completo generalmente requiere:\n• 6-8 sesiones para resultados óptimos\n• Intervalos de 4-6 semanas entre sesiones\n• Cada sesión dura entre 20-90 min según el área\n\n¿Te gustaría agendar tu primera sesión?";
        }

        // Respuestas sobre preparación
        if (message.includes("preparar") || message.includes("cuidados") || message.includes("antes")) {
            return "✅ Antes de tu sesión:\n• No te depiles con cera 4 semanas antes\n• Evita el sol directo 2 semanas antes\n• Rasura el área 24-48h antes\n• No uses cremas con retinol\n\n¿Tienes alguna duda específica sobre la preparación?";
        }

        // Saludos
        if (message.includes("hola") || message.includes("buenos") || message.includes("buenas")) {
            return "¡Hola! 😊 Bienvenid@ a nuestro centro de depilación definitiva. Estoy aquí para ayudarte con cualquier consulta sobre nuestros servicios, turnos o precios. ¿En qué puedo asistirte?";
        }

        // Despedidas
        if (message.includes("gracias") || message.includes("adiós") || message.includes("hasta luego")) {
            return "¡De nada! 😊 Fue un placer ayudarte. Si tienes más preguntas o quieres reservar un turno, estaré aquí. ¡Que tengas un excelente día!";
        }

        // Respuesta por defecto
        return "Entiendo que tienes una consulta. Puedo ayudarte con:\n\n🗓️ Turnos y reservas\n💰 Precios y promociones\n🌟 Información sobre servicios\n🕒 Horarios de atención\n📍 Ubicación del centro\n\n¿Sobre qué te gustaría saber más?";
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setLoading(true);
        setMessages(prev => [...prev, { from: "user", text: input }]);

        // Generar respuesta del bot
        const botReply = await generateBotResponse(input);

        setTimeout(() => {
            setMessages(prev => [...prev, { from: "bot", text: botReply }]);
            setLoading(false);
        }, 800);

        setInput("");
    }; return (
        <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '2rem',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '2rem',
                padding: '1rem',
                backgroundColor: '#2196F3',
                color: 'white',
                borderRadius: '10px'
            }}>
                <div style={{ fontSize: '2rem', marginRight: '1rem' }}>🤖</div>
                <div>
                    <h2 style={{ margin: 0 }}>Asistente Virtual</h2>
                    <p style={{ margin: 0, opacity: 0.9 }}>Tu consultor personal de depilación definitiva</p>
                </div>
            </div>

            <div style={{
                border: '1px solid #e0e0e0',
                borderRadius: '10px',
                backgroundColor: 'white',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                <div style={{
                    height: '400px',
                    overflowY: 'auto',
                    padding: '1rem',
                    backgroundColor: '#fafafa'
                }}>
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            style={{
                                display: 'flex',
                                marginBottom: '1rem',
                                justifyContent: msg.from === 'bot' ? 'flex-start' : 'flex-end'
                            }}
                        >
                            <div style={{
                                maxWidth: '80%',
                                padding: '12px 16px',
                                borderRadius: '18px',
                                backgroundColor: msg.from === 'bot' ? '#e3f2fd' : '#2196F3',
                                color: msg.from === 'bot' ? '#1976D2' : 'white',
                                border: msg.from === 'bot' ? '1px solid #2196F3' : 'none',
                                whiteSpace: 'pre-line'
                            }}>
                                <div style={{
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    marginBottom: '4px',
                                    opacity: 0.8
                                }}>
                                    {msg.from === 'bot' ? '🤖 Asistente' : '👤 Tú'}
                                </div>
                                {msg.text}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            marginBottom: '1rem'
                        }}>
                            <div style={{
                                padding: '12px 16px',
                                borderRadius: '18px',
                                backgroundColor: '#e3f2fd',
                                color: '#1976D2',
                                border: '1px solid #2196F3'
                            }}>
                                <div style={{
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    marginBottom: '4px',
                                    opacity: 0.8
                                }}>
                                    🤖 Asistente
                                </div>
                                Escribiendo...
                            </div>
                        </div>
                    )}
                </div>

                <div style={{
                    padding: '1rem',
                    borderTop: '1px solid #e0e0e0',
                    backgroundColor: 'white'
                }}>
                    <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Escribe tu pregunta aquí... (ej: 'mis turnos', 'precios faciales')"
                            style={{
                                flex: 1,
                                padding: '12px 16px',
                                borderRadius: '25px',
                                border: '1px solid #ddd',
                                fontSize: '16px',
                                outline: 'none'
                            }}
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            style={{
                                backgroundColor: loading || !input.trim() ? '#ccc' : '#2196F3',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '25px',
                                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                                fontSize: '16px',
                                fontWeight: 'bold'
                            }}
                        >
                            {loading ? '...' : 'Enviar'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Sugerencias de preguntas */}
            <div style={{ marginTop: '2rem' }}>
                <h3 style={{ color: '#666', marginBottom: '1rem' }}>Preguntas frecuentes:</h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '10px'
                }}>
                    {[
                        "Ver mis turnos",
                        "Precios de servicios",
                        "Crear nuevo turno",
                        "Horarios de atención",
                        "¿Cuántas sesiones necesito?",
                        "Cuidados antes del tratamiento"
                    ].map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => setInput(suggestion)}
                            style={{
                                backgroundColor: 'white',
                                border: '1px solid #2196F3',
                                color: '#2196F3',
                                padding: '8px 12px',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                transition: 'all 0.3s'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#2196F3';
                                e.target.style.color = 'white';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = 'white';
                                e.target.style.color = '#2196F3';
                            }}
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
