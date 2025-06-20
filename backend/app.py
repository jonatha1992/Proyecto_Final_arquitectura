from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
CORS(app)

# Configuración de la base de datos SQLite
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'turnos.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Modelo de Turno
class Turno(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    usuario = db.Column(db.String(120), nullable=False)
    fecha = db.Column(db.String(50), nullable=False)
    hora = db.Column(db.String(20), nullable=False)
    descripcion = db.Column(db.String(200), nullable=True)

# Inicializar la base de datos
@app.before_first_request
def create_tables():
    db.create_all()

# Ruta para obtener todos los turnos
@app.route('/turnos', methods=['GET'])
def get_turnos():
    turnos = Turno.query.all()
    return jsonify([{
        'id': t.id,
        'usuario': t.usuario,
        'fecha': t.fecha,
        'hora': t.hora,
        'descripcion': t.descripcion
    } for t in turnos])

# Ruta para crear un nuevo turno
@app.route('/turnos', methods=['POST'])
def add_turno():
    data = request.json
    nuevo_turno = Turno(
        usuario=data['usuario'],
        fecha=data['fecha'],
        hora=data['hora'],
        descripcion=data.get('descripcion', '')
    )
    db.session.add(nuevo_turno)
    db.session.commit()
    return jsonify({'message': 'Turno creado'}), 201

# Ruta para eliminar un turno
@app.route('/turnos/<int:id>', methods=['DELETE'])
def delete_turno(id):
    turno = Turno.query.get(id)
    if not turno:
        return jsonify({'error': 'Turno no encontrado'}), 404
    db.session.delete(turno)
    db.session.commit()
    return jsonify({'message': 'Turno eliminado'})

if __name__ == '__main__':
    app.run(debug=True)
