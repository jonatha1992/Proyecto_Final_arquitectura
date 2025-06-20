import json

class TestMainRoutes:
    """Tests para las rutas principales"""
    
    def test_health_endpoint(self, client):
        """Test: Endpoint de salud"""
        response = client.get('/health')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'OK'
        assert 'message' in data
    
    def test_servicios_endpoint(self, client):
        """Test: Endpoint de servicios"""
        response = client.get('/servicios')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'servicios' in data
        assert len(data['servicios']) > 0
        
        # Verificar estructura de servicios
        servicio = data['servicios'][0]
        assert 'id' in servicio
        assert 'nombre' in servicio
        assert 'precio' in servicio
        assert 'duracion' in servicio
    
    def test_index_endpoint(self, client):
        """Test: Endpoint raíz"""
        response = client.get('/')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'message' in data
        assert 'version' in data
        assert 'endpoints' in data
