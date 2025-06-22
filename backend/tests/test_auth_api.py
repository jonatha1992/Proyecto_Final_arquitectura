import json
import pytest
from models.cliente import Cliente


@pytest.fixture
def firebase_stub(monkeypatch):
    decoded = {
        'uid': 'testuid',
        'email': 'test@example.com',
        'name': 'Test User',
        'phone_number': '+1'
    }

    def mock_verify(token):
        return decoded if token == 'valid_token' else None

    monkeypatch.setattr('routes.auth.verify_firebase_token', mock_verify)
    return decoded

class TestAuthRoutes:
    """Tests para las rutas de autenticación"""

    def test_register_success(self, client, firebase_stub):
        response = client.post('/auth/register', json={'token': 'valid_token'})
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data['message'] == 'Cliente registrado exitosamente'
        assert data['cliente']['email'] == firebase_stub['email']
        # verificar que se guardó en la base
        with client.application.app_context():
            assert Cliente.query.count() == 1

    def test_register_missing_token(self, client, firebase_stub):
        response = client.post('/auth/register', json={})
        assert response.status_code == 400

    def test_register_invalid_token(self, client, firebase_stub):
        response = client.post('/auth/register', json={'token': 'invalid'})
        assert response.status_code == 401

    def test_register_duplicate(self, client, firebase_stub):
        client.post('/auth/register', json={'token': 'valid_token'})
        response = client.post('/auth/register', json={'token': 'valid_token'})
        assert response.status_code == 409

    def test_login_success(self, client, firebase_stub):
        with client.application.app_context():
            Cliente.create_from_firebase(firebase_stub)
        response = client.post('/auth/login', json={'token': 'valid_token'})
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['token_valid'] is True
        assert data['cliente']['firebase_uid'] == firebase_stub['uid']

    def test_login_missing_token(self, client, firebase_stub):
        response = client.post('/auth/login', json={})
        assert response.status_code == 400

    def test_login_invalid_token(self, client, firebase_stub):
        response = client.post('/auth/login', json={'token': 'invalid'})
        assert response.status_code == 401

    def test_profile_success(self, client, firebase_stub):
        with client.application.app_context():
            Cliente.create_from_firebase(firebase_stub)
        headers = {'Authorization': 'Bearer valid_token'}
        response = client.get('/auth/profile', headers=headers)
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['email'] == firebase_stub['email']

    def test_profile_missing_token(self, client, firebase_stub):
        response = client.get('/auth/profile')
        assert response.status_code == 401

    def test_profile_invalid_token(self, client, firebase_stub):
        headers = {'Authorization': 'Bearer invalid'}
        response = client.get('/auth/profile', headers=headers)
        assert response.status_code == 401

    def test_profile_not_found(self, client, firebase_stub):
        headers = {'Authorization': 'Bearer valid_token'}
        response = client.get('/auth/profile', headers=headers)
        assert response.status_code == 404

