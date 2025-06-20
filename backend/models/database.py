from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db():
    """Inicializar base de datos"""
    db.create_all()
    print("✓ Base de datos inicializada")
