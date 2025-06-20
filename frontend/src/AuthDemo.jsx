import React, { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

export default function AuthDemo({ onAuth }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await signInWithEmailAndPassword(auth, email, password);
            setUser(res.user);
            onAuth && onAuth(res.user);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            setUser(res.user);
            onAuth && onAuth(res.user);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        setUser(null);
        onAuth && onAuth(null);
    };

    return (
        <div>
            {user ? (
                <div>
                    <p>Bienvenido, {user.email}</p>
                    <button onClick={handleLogout}>Cerrar sesión</button>
                </div>
            ) : (
                <form>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button onClick={handleLogin}>Iniciar sesión</button>
                    <button onClick={handleRegister}>Registrarse</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
            )}
        </div>
    );
}
