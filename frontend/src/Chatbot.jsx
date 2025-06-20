import React, { useState } from "react";

export default function Chatbot() {
    const [messages, setMessages] = useState([
        { from: "bot", text: "¡Hola! ¿En qué puedo ayudarte con tu depilación definitiva?" }
    ]);
    const [input, setInput] = useState("");

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setMessages([...messages, { from: "user", text: input }]);
        // Respuesta simple demo
        let botReply = "";
        if (input.toLowerCase().includes("precio")) botReply = "Puedes ver los precios en la sección de Precios.";
        else if (input.toLowerCase().includes("turno")) botReply = "Puedes reservar un turno desde la sección Turnos.";
        else botReply = "¡Gracias por tu consulta! Pronto te responderemos.";
        setTimeout(() => {
            setMessages(msgs => [...msgs, { from: "bot", text: botReply }]);
        }, 500);
        setInput("");
    };

    return (
        <div>
            <h2>Chatbot</h2>
            <div style={{ border: '1px solid #ccc', padding: 10, height: 200, overflowY: 'auto', marginBottom: 10 }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{ textAlign: msg.from === 'bot' ? 'left' : 'right' }}>
                        <b>{msg.from === 'bot' ? 'Bot' : 'Tú'}:</b> {msg.text}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSend} style={{ display: 'flex', gap: 8 }}>
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="Escribe tu mensaje..." style={{ flex: 1 }} />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}
