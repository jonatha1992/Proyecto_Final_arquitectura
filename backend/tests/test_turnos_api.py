import json
import pytest
from models.turno import Turno
from models.database import db

class TestTurnosAPI:
    """Tests para la API de turnos"""
    
    def test_get_turnos_empty(self, client):
        """Test: Obtener turnos cuando la lista está vacía"""
        response = client.get('/turnos')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data == []
    
    def test_create_turno(self, client):
        """Test: Crear un nuevo turno"""
        turno_data = {
            'usuario': 'test@example.com',
            'fecha': '2025-01-15',
            'hora': '10:00',
            'descripcion': 'Depilación facial'
        }
        
        response = client.post('/turnos', 
                              data=json.dumps(turno_data),
                              content_type='application/json')
        
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data['message'] == 'Turno creado exitosamente'
        assert 'turno' in data
    
    def test_get_turnos_with_data(self, client):
        """Test: Obtener turnos cuando hay datos"""
        # Crear un turno primero
        turno_data = {
            'usuario': 'test@example.com',
            'fecha': '2025-01-15',
            'hora': '10:00',
            'descripcion': 'Depilación facial'
        }
        
        client.post('/turnos',
                   data=json.dumps(turno_data),
                   content_type='application/json')
        
        # Obtener turnos
        response = client.get('/turnos')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data) == 1
        assert data[0]['usuario'] == 'test@example.com'
        assert data[0]['fecha'] == '2025-01-15'
        assert data[0]['hora'] == '10:00'
        assert data[0]['estado'] == 'pendiente'
    
    def test_get_turno_by_id(self, client):
        """Test: Obtener turno por ID"""
        # Crear un turno primero
        turno_data = {
            'usuario': 'test@example.com',
            'fecha': '2025-01-15',
            'hora': '10:00',
            'descripcion': 'Depilación facial'
        }
        
        response = client.post('/turnos',
                              data=json.dumps(turno_data),
                              content_type='application/json')
        
        # Obtener el turno por ID
        response = client.get('/turnos/1')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['usuario'] == 'test@example.com'
    
    def test_update_turno(self, client):
        """Test: Actualizar un turno existente"""
        # Crear un turno primero
        turno_data = {
            'usuario': 'test@example.com',
            'fecha': '2025-01-15',
            'hora': '10:00',
            'descripcion': 'Depilación facial'
        }
        
        client.post('/turnos',
                   data=json.dumps(turno_data),
                   content_type='application/json')
        
        # Actualizar el turno
        update_data = {
            'estado': 'confirmado',
            'descripcion': 'Depilación facial confirmada'
        }
        
        response = client.put('/turnos/1',
                             data=json.dumps(update_data),
                             content_type='application/json')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['message'] == 'Turno actualizado exitosamente'
        assert data['turno']['estado'] == 'confirmado'
    
    def test_delete_turno_existing(self, client):
        """Test: Eliminar un turno existente"""
        # Crear un turno primero
        turno_data = {
            'usuario': 'test@example.com',
            'fecha': '2025-01-15',
            'hora': '10:00',
            'descripcion': 'Depilación facial'
        }
        
        client.post('/turnos',
                   data=json.dumps(turno_data),
                   content_type='application/json')
        
        # Eliminar el turno (ID = 1)
        response = client.delete('/turnos/1')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['message'] == 'Turno eliminado exitosamente'
        
        # Verificar que ya no existe
        response = client.get('/turnos')
        data = json.loads(response.data)
        assert len(data) == 0
    
    def test_delete_turno_not_existing(self, client):
        """Test: Intentar eliminar un turno que no existe"""
        response = client.delete('/turnos/999')
        assert response.status_code == 404
        data = json.loads(response.data)
        assert data['error'] == 'Turno no encontrado'
    
    def test_create_turno_invalid_data(self, client):
        """Test: Crear turno con datos inválidos"""
        # Sin datos
        response = client.post('/turnos',
                              data=json.dumps({}),
                              content_type='application/json')
        assert response.status_code == 400
        
        # Datos incompletos
        turno_data = {
            'usuario': 'test@example.com'
            # Faltan fecha y hora
        }
        
        response = client.post('/turnos',
                              data=json.dumps(turno_data),
                              content_type='application/json')
        assert response.status_code == 400
    
    def test_get_turnos_by_usuario(self, client):
        """Test: Obtener turnos por usuario"""
        # Crear turnos para diferentes usuarios
        turno1_data = {
            'usuario': 'user1@example.com',
            'fecha': '2025-01-15',
            'hora': '10:00',
            'descripcion': 'Depilación 1'
        }
        
        turno2_data = {
            'usuario': 'user2@example.com',
            'fecha': '2025-01-16',
            'hora': '11:00',
            'descripcion': 'Depilación 2'
        }
        
        client.post('/turnos', data=json.dumps(turno1_data), content_type='application/json')
        client.post('/turnos', data=json.dumps(turno2_data), content_type='application/json')
        
        # Obtener turnos de user1
        response = client.get('/turnos/usuario/user1@example.com')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data) == 1
        assert data[0]['usuario'] == 'user1@example.com'
