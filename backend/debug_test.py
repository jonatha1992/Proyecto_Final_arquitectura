#!/usr/bin/env python3
"""Script para debug de los tests"""

import sys
import os

# Agregar el directorio backend al path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models.database import db

def test_basic_app():
    """Test básico de la aplicación"""
    try:
        app = create_app('testing')
        print("✓ App creada exitosamente")
        
        with app.app_context():
            db.create_all()
            print("✓ Base de datos creada")
            
            # Test cliente
            client = app.test_client()
            
            # Test endpoint básico
            response = client.get('/health')
            print(f"Health endpoint: {response.status_code}")
            print(f"Data: {response.get_json()}")
            
            # Test endpoint turnos
            response = client.get('/turnos')
            print(f"Turnos endpoint: {response.status_code}")
            
            if response.status_code != 200:
                print(f"Error: {response.get_data(as_text=True)}")
            else:
                print(f"Data: {response.get_json()}")
            
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    test_basic_app()
