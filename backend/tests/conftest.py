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
