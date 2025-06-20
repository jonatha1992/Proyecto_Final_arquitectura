import React, { useState, useEffect, createContext, useContext } from 'react';
import { auth } from './firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import './AuthProvider.css';

// Contexto de autenticación
const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);

    // Función para registrar usuario en el backend
    const registerUserInBackend = async (firebaseUser, additionalData = {}) => {
        try {
            const idToken = await firebaseUser.getIdToken();

            const response = await fetch('http://localhost:5000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({
                    firebase_uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    nombre: additionalData.nombre || firebaseUser.displayName || 'Usuario',
                    telefono: additionalData.telefono || '',
                    fecha_nacimiento: additionalData.fecha_nacimiento || null,
                    genero: additionalData.genero || '',
                    direccion: additionalData.direccion || ''
                })
            });

            if (response.ok) {
                const userData = await response.json();
                console.log('Usuario registrado en backend:', userData);
                return userData;
            } else {
                console.error('Error registrando usuario en backend');
            }
        } catch (error) {
            console.error('Error al comunicarse con el backend:', error);
        }
    };

    // Función para actualizar token cuando cambia el usuario
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const idToken = await user.getIdToken();
                    setToken(idToken);
                    setCurrentUser(user);
                } catch (error) {
                    console.error('Error obteniendo token:', error);
                }
            } else {
                setToken(null);
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Función para registrarse
    const signup = async (email, password, additionalData = {}) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Actualizar el perfil con el nombre
            if (additionalData.nombre) {
                await updateProfile(userCredential.user, {
                    displayName: additionalData.nombre
                });
            }

            // Registrar en el backend
            await registerUserInBackend(userCredential.user, additionalData);

            return userCredential;
        } catch (error) {
            throw error;
        }
    };

    // Función para iniciar sesión
    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential;
        } catch (error) {
            throw error;
        }
    };

    // Función para cerrar sesión
    const logout = async () => {
        try {
            await signOut(auth);
            setToken(null);
            setCurrentUser(null);
        } catch (error) {
            throw error;
        }
    };

    const value = {
        currentUser,
        token,
        signup,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Componente de formulario de autenticación
export const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        nombre: '',
        telefono: '',
        fecha_nacimiento: '',
        genero: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signup, login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await signup(formData.email, formData.password, {
                    nombre: formData.nombre,
                    telefono: formData.telefono,
                    fecha_nacimiento: formData.fecha_nacimiento || null,
                    genero: formData.genero
                });
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>{isLogin ? 'Iniciar Sesión' : 'Registro'}</h2>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Contraseña:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {!isLogin && (
                        <>
                            <div className="form-group">
                                <label>Nombre completo:</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Teléfono:</label>
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Fecha de nacimiento:</label>
                                <input
                                    type="date"
                                    name="fecha_nacimiento"
                                    value={formData.fecha_nacimiento}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Género:</label>
                                <select name="genero" value={formData.genero} onChange={handleChange}>
                                    <option value="">Seleccionar</option>
                                    <option value="M">Masculino</option>
                                    <option value="F">Femenino</option>
                                    <option value="O">Otro</option>
                                </select>
                            </div>
                        </>
                    )}

                    <button type="submit" disabled={loading} className="auth-button">
                        {loading ? 'Cargando...' : (isLogin ? 'Ingresar' : 'Registrarse')}
                    </button>
                </form>

                <p className="auth-toggle">
                    {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="toggle-button"
                    >
                        {isLogin ? 'Regístrate' : 'Inicia sesión'}
                    </button>
                </p>
            </div>
        </div>
    );
};
