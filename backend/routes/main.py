from flask import Blueprint, jsonify

# Blueprint para rutas generales
main_bp = Blueprint('main', __name__)

@main_bp.route('/health', methods=['GET'])
def health_check():
    """Endpoint para verificar el estado del servidor"""
    return jsonify({
        'status': 'OK',
        'message': 'Servidor funcionando correctamente',
        'service': 'Depilación Definitiva API'
    }), 200

@main_bp.route('/servicios', methods=['GET'])
def get_servicios():
    """Obtener lista de servicios disponibles"""
    servicios = [
        {'id': 1, 'nombre': 'Depilación Facial', 'precio': 1000, 'duracion': '30 min'},
        {'id': 2, 'nombre': 'Depilación Axilas', 'precio': 1500, 'duracion': '20 min'},
        {'id': 3, 'nombre': 'Depilación Piernas', 'precio': 3000, 'duracion': '60 min'},
        {'id': 4, 'nombre': 'Depilación Brasileña', 'precio': 2500, 'duracion': '45 min'},
        {'id': 5, 'nombre': 'Depilación Espalda', 'precio': 2000, 'duracion': '40 min'},
    ]
    return jsonify({'servicios': servicios}), 200

@main_bp.route('/', methods=['GET'])
def index():
    """Ruta raíz de la API"""
    return jsonify({
        'message': 'API de Depilación Definitiva',
        'version': '1.0.0',
        'endpoints': {
            'health': '/health',
            'servicios': '/servicios',
            'turnos': '/turnos'
        }
    }), 200
