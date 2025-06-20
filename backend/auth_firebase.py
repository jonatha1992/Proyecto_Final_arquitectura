import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
from flask import Flask, request, jsonify
from functools import wraps
import os

app = Flask(__name__)

# Inicializar Firebase Admin SDK
cred = credentials.Certificate(os.path.join(os.path.dirname(__file__), 'firebase_service_account.json'))
firebase_admin.initialize_app(cred)

def verify_firebase_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        id_token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                id_token = auth_header.split(' ')[1]
        if not id_token:
            return jsonify({'error': 'Token requerido'}), 401
        try:
            decoded_token = firebase_auth.verify_id_token(id_token)
            request.user = decoded_token
        except Exception as e:
            return jsonify({'error': 'Token inválido', 'details': str(e)}), 401
        return f(*args, **kwargs)
    return decorated_function

@app.route('/turnos', methods=['GET'])
@verify_firebase_token
def get_turnos():
    # Aquí iría la lógica de turnos, por ahora demo
    return jsonify({'turnos': ['Turno 1', 'Turno 2'], 'user': request.user['email']})

if __name__ == '__main__':
    app.run(debug=True)
