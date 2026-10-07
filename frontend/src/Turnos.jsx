import React, { useEffect, useState } from "react";
import { auth } from "./firebase";

export default function Turnos() {
    const [turnos, setTurnos] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTurnos = async () => {
            setLoading(true);
            setError("");
            try {
                const user = auth.currentUser;
                if (!user) {
                    setError("No autenticado");
                    setLoading(false);
                    return;
                }
                const token = await user.getIdToken();
                const res = await fetch("http://localhost:5000/turnos", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error("Error al obtener turnos");
                const data = await res.json();
                const list = Array.isArray(data) ? data : (data.turnos || []);
                setTurnos(list);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTurnos();
    }, []);

    if (loading) return <p>Cargando turnos...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    return (
        <div>
            <h2>Turnos</h2>
            {turnos.length === 0 ? (
                <p>No hay turnos registrados.</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {turnos.map((t, i) => (
                        <li key={t.id || i} style={{ borderBottom: "1px solid #ccc", padding: "8px 0" }}>
                            <strong>{t.fecha || "Fecha N/D"} {t.hora ? `- ${t.hora}` : ""}</strong>
                            {t.descripcion ? `: ${t.descripcion}` : ""}
                            {t.usuario ? ` (${t.usuario})` : ""}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
