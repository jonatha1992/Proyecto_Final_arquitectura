from flask import Blueprint, request, jsonify
from models.cliente import Cliente
from models.database import db
import firebase_admin
from firebase_admin import auth, credentials
import os

# Crear blueprint para las rutas de autenticación
auth_bp = Blueprint('auth', __name__)

# Inicializar Firebase Admin (solo si no está inicializado)
if not firebase_admin._apps:
    try:
        # Intentar cargar desde archivo de credenciales
        cred_path = os.getenv('FIREBASE_CREDENTIALS_PATH')
        if cred_path and os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        else:
            # Usar credenciales por defecto si están disponibles
            firebase_admin.initialize_app()
    except Exception as e:
        print(f"Warning: Firebase Admin no pudo inicializarse: {e}")

def verify_firebase_token(token):
    """Verificar token de Firebase"""
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        print(f"Error verificando token: {e}")
        return None

@auth_bp.route('/auth/login', methods=['POST'])
def login():
    """Autenticar usuario con Firebase"""
    try:
        data = request.get_json()
        token = data.get('token')
        
        if not token:
            return jsonify({'error': 'Token requerido'}), 400
        
        # Verificar token con Firebase
        decoded_token = verify_firebase_token(token)
        if not decoded_token:
            return jsonify({'error': 'Token inválido'}), 401
        
        firebase_uid = decoded_token['uid']
        email = decoded_token.get('email')
        name = decoded_token.get('name', decoded_token.get('display_name', 'Usuario'))
        
        # Buscar cliente existente
        cliente = Cliente.get_by_firebase_uid(firebase_uid)
        
        if not cliente:
            # Crear nuevo cliente
            cliente = Cliente.create_from_firebase({
                'uid': firebase_uid,
                'email': email,
                'name': name,
                'phone_number': decoded_token.get('phone_number')
            })
        
        return jsonify({
            'message': 'Login exitoso',
            'cliente': cliente.to_dict(),
            'token_valid': True
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error en login', 'details': str(e)}), 500

@auth_bp.route('/auth/register', methods=['POST'])
def register():
    """Registrar nuevo cliente"""
    try:
        data = request.get_json()
        token = data.get('token')
        
        if not token:
            return jsonify({'error': 'Token requerido'}), 400
        
        # Verificar token con Firebase
        decoded_token = verify_firebase_token(token)
        if not decoded_token:
            return jsonify({'error': 'Token inválido'}), 401
        
        firebase_uid = decoded_token['uid']
        
        # Verificar si el cliente ya existe
        cliente_existente = Cliente.get_by_firebase_uid(firebase_uid)
        if cliente_existente:
            return jsonify({'error': 'Cliente ya registrado'}), 409
        
        # Crear nuevo cliente con datos adicionales
        cliente = Cliente(
            firebase_uid=firebase_uid,
            email=decoded_token.get('email'),
            nombre=data.get('nombre', decoded_token.get('name', 'Usuario')),
            telefono=data.get('telefono', decoded_token.get('phone_number')),
            fecha_nacimiento=data.get('fecha_nacimiento'),
            genero=data.get('genero'),
            direccion=data.get('direccion')
        )
        
        cliente.save()
        
        return jsonify({
            'message': 'Cliente registrado exitosamente',
            'cliente': cliente.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error en registro', 'details': str(e)}), 500

@auth_bp.route('/auth/profile', methods=['GET'])
def get_profile():
    """Obtener perfil del cliente autenticado"""
    try:
        # Obtener token del header Authorization
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Token requerido'}), 401
        
        token = auth_header.split(' ')[1]
        
        # Verificar token
        decoded_token = verify_firebase_token(token)
        if not decoded_token:
            return jsonify({'error': 'Token inválido'}), 401
        
        firebase_uid = decoded_token['uid']
        cliente = Cliente.get_by_firebase_uid(firebase_uid)
        
        if not cliente:
            return jsonify({'error': 'Cliente no encontrado'}), 404
        
        return jsonify(cliente.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': 'Error obteniendo perfil', 'details': str(e)}), 500

@auth_bp.route('/auth/profile', methods=['PUT'])
def update_profile():
    """Actualizar perfil del cliente"""
    try:
        # Obtener token del header Authorization
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Token requerido'}), 401
        
        token = auth_header.split(' ')[1]
        
        # Verificar token
        decoded_token = verify_firebase_token(token)
        if not decoded_token:
            return jsonify({'error': 'Token inválido'}), 401
        
        firebase_uid = decoded_token['uid']
        cliente = Cliente.get_by_firebase_uid(firebase_uid)
        
        if not cliente:
            return jsonify({'error': 'Cliente no encontrado'}), 404
        
        data = request.get_json()
        
        # Actualizar campos permitidos
        allowed_fields = ['nombre', 'telefono', 'fecha_nacimiento', 'genero', 'direccion']
        for field in allowed_fields:
            if field in data:
                setattr(cliente, field, data[field])
        
        cliente.save()
        
        return jsonify({
            'message': 'Perfil actualizado exitosamente',
            'cliente': cliente.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error actualizando perfil', 'details': str(e)}), 500

@auth_bp.route('/clientes', methods=['GET'])
def get_clientes():
    """Obtener todos los clientes (solo para admin)"""
    try:
        clientes = Cliente.get_all()
        return jsonify([cliente.to_dict() for cliente in clientes]), 200
    except Exception as e:
        return jsonify({'error': 'Error obteniendo clientes', 'details': str(e)}), 500

@auth_bp.route('/clientes/<int:cliente_id>', methods=['GET'])
def get_cliente(cliente_id):
    """Obtener cliente por ID"""
    try:
        cliente = Cliente.get_by_id(cliente_id)
        if not cliente:
            return jsonify({'error': 'Cliente no encontrado'}), 404
        
        return jsonify(cliente.to_dict()), 200
    except Exception as e:
        return jsonify({'error': 'Error obteniendo cliente', 'details': str(e)}), 500
