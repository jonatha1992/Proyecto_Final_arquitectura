import json
import pytest
from models.cliente import Cliente

class TestAuthRoutes:
    """Tests para endpoints de autenticación"""

    def test_register_success(self, client, mock_valid_token, firebase_token_data):
        payload = {'token': 'fake-token', 'nombre': 'Otro', 'direccion': 'Calle 123'}
        response = client.post('/auth/register', data=json.dumps(payload), content_type='application/json')
        assert response.status_code == 201
        data = response.get_json()
        assert data['message'] == 'Cliente registrado exitosamente'
        assert data['cliente']['firebase_uid'] == firebase_token_data['uid']

    def test_register_missing_token(self, client):
        response = client.post('/auth/register', data=json.dumps({}), content_type='application/json')
        assert response.status_code == 400
        assert response.get_json()['error'] == 'Token requerido'

    def test_register_existing(self, client, mock_valid_token):
        payload = {'token': 't'}
        client.post('/auth/register', data=json.dumps(payload), content_type='application/json')
        response = client.post('/auth/register', data=json.dumps(payload), content_type='application/json')
        assert response.status_code == 409
        assert response.get_json()['error'] == 'Cliente ya registrado'

    def test_login_success(self, client, mock_valid_token):
        payload = {'token': 'fake'}
        response = client.post('/auth/login', data=json.dumps(payload), content_type='application/json')
        assert response.status_code == 200
        data = response.get_json()
        assert data['message'] == 'Login exitoso'
        assert data['cliente']['firebase_uid'] == 'testuid'

    def test_login_missing_token(self, client):
        response = client.post('/auth/login', data=json.dumps({}), content_type='application/json')
        assert response.status_code == 400
        assert response.get_json()['error'] == 'Token requerido'

    def test_login_invalid_token(self, client, mock_invalid_token):
        response = client.post('/auth/login', data=json.dumps({'token': 'x'}), content_type='application/json')
        assert response.status_code == 401
        assert response.get_json()['error'] == 'Token inválido'

    def test_profile_success(self, client, mock_valid_token):
        client.post('/auth/login', data=json.dumps({'token': 'y'}), content_type='application/json')
        response = client.get('/auth/profile', headers={'Authorization': 'Bearer token'})
        assert response.status_code == 200
        assert response.get_json()['firebase_uid'] == 'testuid'

    def test_profile_missing_token(self, client):
        response = client.get('/auth/profile')
        assert response.status_code == 401
        assert response.get_json()['error'] == 'Token requerido'

    def test_profile_invalid_token(self, client, mock_invalid_token):
        response = client.get('/auth/profile', headers={'Authorization': 'Bearer token'})
        assert response.status_code == 401
        assert response.get_json()['error'] == 'Token inválido'
