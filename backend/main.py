import os
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from functools import wraps
from dotenv import load_dotenv
from datetime import datetime

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuración
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///turnos.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar extensiones
db = SQLAlchemy(app)

# Inicializar Firebase Admin SDK
try:
    firebase_credentials_path = os.getenv('FIREBASE_CREDENTIALS_PATH', 'firebase_service_account.json')
    cred = credentials.Certificate(os.path.join(os.path.dirname(__file__), firebase_credentials_path))
    firebase_admin.initialize_app(cred)
    print("✓ Firebase Admin SDK inicializado correctamente")
except Exception as e:
    print(f"⚠️  Error inicializando Firebase: {e}")
    print("⚠️  Autenticación Firebase no disponible")

# Modelo de datos
class Turno(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    usuario_email = db.Column(db.String(120), nullable=False)
    fecha = db.Column(db.String(50), nullable=False)
    hora = db.Column(db.String(20), nullable=False)
    servicio = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.String(200), nullable=True)
    estado = db.Column(db.String(20), default='pendiente')  # pendiente, confirmado, cancelado
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'usuario_email': self.usuario_email,
            'fecha': self.fecha,
            'hora': self.hora,
            'servicio': self.servicio,
            'descripcion': self.descripcion,
            'estado': self.estado,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

# Decorador para verificar token Firebase
def verify_firebase_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        id_token = None
        
        # Extraer token del header Authorization
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                id_token = auth_header.split(' ')[1]
        
        if not id_token:
            return jsonify({'error': 'Token de autenticación requerido'}), 401
        
        try:
            # Verificar token con Firebase
            decoded_token = firebase_auth.verify_id_token(id_token)
            request.user = decoded_token
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': 'Token inválido', 'details': str(e)}), 401
    
    return decorated_function

# Función para validar datos de turno
def validate_turno_data(data):
    required_fields = ['fecha', 'hora', 'servicio']
    errors = []
    
    for field in required_fields:
        if field not in data or not data[field]:
            errors.append(f'El campo {field} es requerido')
    
    # Validaciones adicionales aquí (formato de fecha, hora, etc.)
    
    return errors

# RUTAS DE LA API

@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint para verificar el estado del servidor"""
    return jsonify({'status': 'OK', 'message': 'Servidor funcionando correctamente'})

@app.route('/turnos', methods=['GET'])
@verify_firebase_token
def get_turnos():
    """Obtener todos los turnos del usuario autenticado"""
    try:
        user_email = request.user['email']
        turnos = Turno.query.filter_by(usuario_email=user_email).all()
        return jsonify({
            'turnos': [turno.to_dict() for turno in turnos],
            'user': user_email,
            'total': len(turnos)
        })
    except Exception as e:
        return jsonify({'error': 'Error al obtener turnos', 'details': str(e)}), 500

@app.route('/turnos', methods=['POST'])
@verify_firebase_token
def create_turno():
    """Crear un nuevo turno"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No se enviaron datos'}), 400
        
        # Validar datos
        errors = validate_turno_data(data)
        if errors:
            return jsonify({'error': 'Datos inválidos', 'details': errors}), 400
        
        # Crear turno
        nuevo_turno = Turno(
            usuario_email=request.user['email'],
            fecha=data['fecha'],
            hora=data['hora'],
            servicio=data['servicio'],
            descripcion=data.get('descripcion', ''),
            estado='pendiente'
        )
        
        db.session.add(nuevo_turno)
        db.session.commit()
        
        return jsonify({
            'message': 'Turno creado exitosamente',
            'turno': nuevo_turno.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al crear turno', 'details': str(e)}), 500

@app.route('/turnos/<int:turno_id>', methods=['PUT'])
@verify_firebase_token
def update_turno(turno_id):
    """Actualizar un turno existente"""
    try:
        turno = Turno.query.filter_by(id=turno_id, usuario_email=request.user['email']).first()
        
        if not turno:
            return jsonify({'error': 'Turno no encontrado'}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No se enviaron datos'}), 400
        
        # Actualizar campos permitidos
        allowed_fields = ['fecha', 'hora', 'servicio', 'descripcion', 'estado']
        for field in allowed_fields:
            if field in data:
                setattr(turno, field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Turno actualizado exitosamente',
            'turno': turno.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al actualizar turno', 'details': str(e)}), 500

@app.route('/turnos/<int:turno_id>', methods=['DELETE'])
@verify_firebase_token
def delete_turno(turno_id):
    """Eliminar un turno"""
    try:
        turno = Turno.query.filter_by(id=turno_id, usuario_email=request.user['email']).first()
        
        if not turno:
            return jsonify({'error': 'Turno no encontrado'}), 404
        
        db.session.delete(turno)
        db.session.commit()
        
        return jsonify({'message': 'Turno eliminado exitosamente'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al eliminar turno', 'details': str(e)}), 500

@app.route('/servicios', methods=['GET'])
def get_servicios():
    """Obtener lista de servicios disponibles"""
    servicios = [
        {'id': 1, 'nombre': 'Depilación Facial', 'precio': 1000, 'duracion': '30 min'},
        {'id': 2, 'nombre': 'Depilación Axilas', 'precio': 1500, 'duracion': '20 min'},
        {'id': 3, 'nombre': 'Depilación Piernas', 'precio': 3000, 'duracion': '60 min'},
        {'id': 4, 'nombre': 'Depilación Brasileña', 'precio': 2500, 'duracion': '45 min'},
        {'id': 5, 'nombre': 'Depilación Espalda', 'precio': 2000, 'duracion': '40 min'},
    ]
    return jsonify({'servicios': servicios})

# Manejo de errores
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint no encontrado'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Error interno del servidor'}), 500

# Inicialización de la base de datos
def init_db():
    """Inicializar base de datos"""
    with app.app_context():
        db.create_all()
        print("✓ Base de datos inicializada")

if __name__ == '__main__':
    init_db()
    print("🚀 Iniciando servidor Flask...")
    app.run(debug=True, host='0.0.0.0', port=5000)
