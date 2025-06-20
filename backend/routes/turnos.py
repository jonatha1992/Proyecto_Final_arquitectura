from flask import Blueprint, request, jsonify
from models.turno import Turno
from models.cliente import Cliente
from models.database import db
from firebase_admin import auth

# Crear blueprint para las rutas de turnos
turnos_bp = Blueprint('turnos', __name__)

def verify_firebase_token(token):
    """Verificar token de Firebase"""
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        print(f"Error verificando token: {e}")
        return None

def get_authenticated_cliente():
    """Obtener cliente autenticado desde el token"""
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None
        
        token = auth_header.split(' ')[1]
        decoded_token = verify_firebase_token(token)
        
        if not decoded_token:
            return None
            
        firebase_uid = decoded_token['uid']
        return Cliente.get_by_firebase_uid(firebase_uid)
    except Exception:
        return None

@turnos_bp.route('/turnos', methods=['GET'])
def get_turnos():
    """Obtener todos los turnos"""
    try:
        turnos = Turno.get_all()
        return jsonify([turno.to_dict() for turno in turnos]), 200
    except Exception as e:
        return jsonify({'error': 'Error al obtener turnos', 'details': str(e)}), 500

@turnos_bp.route('/turnos', methods=['POST'])
def create_turno():
    """Crear un nuevo turno (requiere autenticación)"""
    try:
        # Verificar autenticación
        cliente = get_authenticated_cliente()
        if not cliente:
            return jsonify({'error': 'Autenticación requerida'}), 401
        
        data = request.get_json()
        
        # Validar datos requeridos
        required_fields = ['fecha', 'hora']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'El campo {field} es requerido'}), 400
        
        # Crear nuevo turno
        nuevo_turno = Turno(
            cliente_id=cliente.id,
            usuario=cliente.email,  # Por compatibilidad
            fecha=data['fecha'],
            hora=data['hora'],
            descripcion=data.get('descripcion', ''),
            servicio=data.get('servicio', ''),
            precio=data.get('precio'),
            notas=data.get('notas', ''),
            estado=data.get('estado', 'pendiente')
        )
        
        nuevo_turno.save()
        
        return jsonify({
            'message': 'Turno creado exitosamente',
            'turno': nuevo_turno.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al crear turno', 'details': str(e)}), 500

@turnos_bp.route('/turnos/<int:turno_id>', methods=['GET'])
def get_turno(turno_id):
    """Obtener un turno específico"""
    try:
        turno = Turno.get_by_id(turno_id)
        if not turno:
            return jsonify({'error': 'Turno no encontrado'}), 404
        
        return jsonify(turno.to_dict()), 200
    except Exception as e:
        return jsonify({'error': 'Error al obtener turno', 'details': str(e)}), 500

@turnos_bp.route('/turnos/<int:turno_id>', methods=['PUT'])
def update_turno(turno_id):
    """Actualizar un turno existente"""
    try:
        turno = Turno.get_by_id(turno_id)
        if not turno:
            return jsonify({'error': 'Turno no encontrado'}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No se enviaron datos'}), 400
        
        # Actualizar campos permitidos
        allowed_fields = ['usuario', 'fecha', 'hora', 'descripcion', 'estado']
        for field in allowed_fields:
            if field in data:
                setattr(turno, field, data[field])
        
        turno.save()
        
        return jsonify({
            'message': 'Turno actualizado exitosamente',
            'turno': turno.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al actualizar turno', 'details': str(e)}), 500

@turnos_bp.route('/turnos/<int:turno_id>', methods=['DELETE'])
def delete_turno(turno_id):
    """Eliminar un turno"""
    try:
        turno = Turno.get_by_id(turno_id)
        if not turno:
            return jsonify({'error': 'Turno no encontrado'}), 404
        
        turno.delete()
        
        return jsonify({'message': 'Turno eliminado exitosamente'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al eliminar turno', 'details': str(e)}), 500

@turnos_bp.route('/turnos/usuario/<string:usuario>', methods=['GET'])
def get_turnos_by_usuario(usuario):
    """Obtener turnos de un usuario específico"""
    try:
        turnos = Turno.get_by_usuario(usuario)
        return jsonify([turno.to_dict() for turno in turnos]), 200
    except Exception as e:
        return jsonify({'error': 'Error al obtener turnos del usuario', 'details': str(e)}), 500

@turnos_bp.route('/turnos/mis-turnos', methods=['GET'])
def get_mis_turnos():
    """Obtener turnos del cliente autenticado"""
    try:
        # Verificar autenticación
        cliente = get_authenticated_cliente()
        if not cliente:
            return jsonify({'error': 'Autenticación requerida'}), 401
        
        turnos = Turno.get_by_cliente_id(cliente.id)
        return jsonify([turno.to_dict() for turno in turnos]), 200
        
    except Exception as e:
        return jsonify({'error': 'Error al obtener turnos', 'details': str(e)}), 500
