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
                setTurnos(data.turnos);
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
            <ul>
                {turnos.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
        </div>
    );
}
