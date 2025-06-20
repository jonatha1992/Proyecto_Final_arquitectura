#!/usr/bin/env python3
"""Script para crear la base de datos con los nuevos modelos"""

import sys
import os

# Agregar el directorio backend al path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models.database import db

def create_database():
    """Crear la base de datos con todos los modelos"""
    try:
        app = create_app('development')
        print("✓ App creada exitosamente")
        
        with app.app_context():
            # Eliminar todas las tablas existentes
            db.drop_all()
            print("✓ Tablas anteriores eliminadas")
            
            # Crear todas las tablas nuevas
            db.create_all()
            print("✓ Nuevas tablas creadas:")
            
            # Mostrar las tablas creadas
            inspector = db.inspect(db.engine)
            tables = inspector.get_table_names()
            for table in tables:
                print(f"  - {table}")
                columns = inspector.get_columns(table)
                for col in columns:
                    print(f"    * {col['name']} ({col['type']})")
            
            print("\n🎉 ¡Base de datos creada exitosamente!")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    create_database()
