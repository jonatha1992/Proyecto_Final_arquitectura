from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from config.config import config
from models.database import db, init_db
from routes.main import main_bp
from routes.turnos import turnos_bp
from routes.auth import auth_bp

def create_app(config_name='default'):
    """Factory function para crear la aplicación Flask"""
    app = Flask(__name__)
    
    # Configuración
    app.config.from_object(config[config_name])
      # Extensiones
    CORS(app)
    db.init_app(app)
    migrate = Migrate(app, db)
    
    # Registrar blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(turnos_bp)
    app.register_blueprint(auth_bp)
    
    # Manejo de errores
    @app.errorhandler(404)
    def not_found(error):
        return {'error': 'Endpoint no encontrado'}, 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return {'error': 'Error interno del servidor'}, 500
    
    return app

if __name__ == '__main__':
    app = create_app('development')
    
    with app.app_context():
        db.create_all()
        print("✓ Base de datos inicializada")
    
    print("🚀 Iniciando servidor Flask reorganizado...")
    app.run(debug=True, host='0.0.0.0', port=5000)
