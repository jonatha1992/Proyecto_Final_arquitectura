import React, { useState, useEffect } from 'react';
import { auth } from './firebase';

const Dashboard = () => {
    const [turnos, setTurnos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingTurno, setEditingTurno] = useState(null);
    const [formData, setFormData] = useState({
        fecha: '',
        hora: '',
        descripcion: '',
        estado: 'pendiente'
    });

    // Cargar turnos al inicializar
    useEffect(() => {
        fetchTurnos();
    }, []);

    const fetchTurnos = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/turnos');

            if (!response.ok) {
                throw new Error('Error al cargar turnos');
            }

            const data = await response.json();
            setTurnos(data);
            setError('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = auth.currentUser;
        if (!user) {
            setError('Debes estar autenticado');
            return;
        }

        try {
            const turnoData = {
                ...formData,
                usuario: user.email
            };

            const url = editingTurno
                ? `http://localhost:5000/turnos/${editingTurno.id}`
                : 'http://localhost:5000/turnos';

            const method = editingTurno ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(turnoData)
            });

            if (!response.ok) {
                throw new Error('Error al guardar turno');
            }

            await fetchTurnos(); // Recargar lista
            resetForm();
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este turno?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/turnos/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Error al eliminar turno');
            }

            await fetchTurnos();
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (turno) => {
        setEditingTurno(turno);
        setFormData({
            fecha: turno.fecha,
            hora: turno.hora,
            descripcion: turno.descripcion || '',
            estado: turno.estado
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            fecha: '',
            hora: '',
            descripcion: '',
            estado: 'pendiente'
        });
        setEditingTurno(null);
        setShowForm(false);
    };

    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'confirmado': return '#4CAF50';
            case 'cancelado': return '#f44336';
            default: return '#ff9800';
        }
    };

    const formatFecha = (fecha) => {
        return new Date(fecha + 'T00:00:00').toLocaleDateString('es-AR');
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                <div>Cargando turnos...</div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
            }}>
                <h1 style={{ color: '#333', margin: 0 }}>Dashboard de Turnos</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    {showForm ? 'Cancelar' : 'Nuevo Turno'}
                </button>
            </div>

            {error && (
                <div style={{
                    backgroundColor: '#ffebee',
                    color: '#c62828',
                    padding: '1rem',
                    borderRadius: '5px',
                    marginBottom: '1rem',
                    border: '1px solid #ef5350'
                }}>
                    {error}
                </div>
            )}

            {/* Formulario */}
            {showForm && (
                <div style={{
                    backgroundColor: '#f5f5f5',
                    padding: '2rem',
                    borderRadius: '10px',
                    marginBottom: '2rem',
                    border: '1px solid #ddd'
                }}>
                    <h3>{editingTurno ? 'Editar Turno' : 'Nuevo Turno'}</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Fecha:</label>
                            <input
                                type="date"
                                value={formData.fecha}
                                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                                required
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Hora:</label>
                            <input
                                type="time"
                                value={formData.hora}
                                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                                required
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Estado:</label>
                            <select
                                value={formData.estado}
                                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                            >
                                <option value="pendiente">Pendiente</option>
                                <option value="confirmado">Confirmado</option>
                                <option value="cancelado">Cancelado</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Descripción:</label>
                            <textarea
                                value={formData.descripcion}
                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                placeholder="Ej: Depilación facial, piernas completas..."
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    border: '1px solid #ccc',
                                    minHeight: '80px',
                                    resize: 'vertical'
                                }}
                            />
                        </div>
                        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px' }}>
                            <button
                                type="submit"
                                style={{
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px 24px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '16px'
                                }}
                            >
                                {editingTurno ? 'Actualizar' : 'Crear'} Turno
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                style={{
                                    backgroundColor: '#9e9e9e',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px 24px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '16px'
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Estadísticas */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                <div style={{
                    backgroundColor: '#e3f2fd',
                    padding: '1.5rem',
                    borderRadius: '10px',
                    textAlign: 'center',
                    border: '1px solid #2196F3'
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#1976D2' }}>Total Turnos</h3>
                    <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold', color: '#1976D2' }}>{turnos.length}</p>
                </div>
                <div style={{
                    backgroundColor: '#e8f5e8',
                    padding: '1.5rem',
                    borderRadius: '10px',
                    textAlign: 'center',
                    border: '1px solid #4CAF50'
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#388E3C' }}>Confirmados</h3>
                    <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold', color: '#388E3C' }}>
                        {turnos.filter(t => t.estado === 'confirmado').length}
                    </p>
                </div>
                <div style={{
                    backgroundColor: '#fff3e0',
                    padding: '1.5rem',
                    borderRadius: '10px',
                    textAlign: 'center',
                    border: '1px solid #ff9800'
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#F57C00' }}>Pendientes</h3>
                    <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold', color: '#F57C00' }}>
                        {turnos.filter(t => t.estado === 'pendiente').length}
                    </p>
                </div>
            </div>

            {/* Grilla de turnos */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                <h2 style={{
                    margin: 0,
                    padding: '1.5rem',
                    backgroundColor: '#f5f5f5',
                    borderBottom: '1px solid #ddd',
                    color: '#333'
                }}>
                    Lista de Turnos
                </h2>

                {turnos.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                        No hay turnos registrados. ¡Crea tu primer turno!
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8f9fa' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>ID</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Usuario</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Fecha</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Hora</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Descripción</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Estado</th>
                                    <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {turnos.map((turno, index) => (
                                    <tr
                                        key={turno.id}
                                        style={{
                                            backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                                            borderBottom: '1px solid #dee2e6'
                                        }}
                                    >
                                        <td style={{ padding: '1rem' }}>{turno.id}</td>
                                        <td style={{ padding: '1rem' }}>{turno.usuario}</td>
                                        <td style={{ padding: '1rem' }}>{formatFecha(turno.fecha)}</td>
                                        <td style={{ padding: '1rem' }}>{turno.hora}</td>
                                        <td style={{ padding: '1rem', maxWidth: '200px' }}>
                                            {turno.descripcion || 'Sin descripción'}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                backgroundColor: getEstadoColor(turno.estado),
                                                color: 'white',
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                textTransform: 'uppercase'
                                            }}>
                                                {turno.estado}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <button
                                                onClick={() => handleEdit(turno)}
                                                style={{
                                                    backgroundColor: '#2196F3',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '6px 12px',
                                                    borderRadius: '3px',
                                                    cursor: 'pointer',
                                                    marginRight: '8px',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(turno.id)}
                                                style={{
                                                    backgroundColor: '#f44336',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '6px 12px',
                                                    borderRadius: '3px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
