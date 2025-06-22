import pytest
import sys
import os

# Agregar el directorio backend al path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from models.database import db

@pytest.fixture
def app():
    """Aplicación Flask para tests"""
    app = create_app('testing')
    
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app):
    """Cliente de pruebas para Flask"""
    return app.test_client()

@pytest.fixture
def app_context(app):
    """Contexto de aplicación para tests"""
    with app.app_context():
        yield app


@pytest.fixture
def firebase_token_data():
    """Datos simulados devueltos por Firebase."""
    return {
        'uid': 'testuid',
        'email': 'user@example.com',
        'name': 'Test User',
        'phone_number': '+123456789'
    }


@pytest.fixture
def mock_valid_token(monkeypatch, firebase_token_data):
    """Mock de verificación de token que retorna datos válidos."""
    monkeypatch.setattr('routes.auth.verify_firebase_token',
                        lambda token: firebase_token_data)
    return firebase_token_data


@pytest.fixture
def mock_invalid_token(monkeypatch):
    """Mock de verificación de token que simula token inválido."""
    monkeypatch.setattr('routes.auth.verify_firebase_token',
                        lambda token: None)

