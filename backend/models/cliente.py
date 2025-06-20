from models.database import db
from datetime import datetime

class Cliente(db.Model):
    """Modelo para clientes autenticados con Firebase"""
    __tablename__ = 'clientes'
    
    id = db.Column(db.Integer, primary_key=True)
    firebase_uid = db.Column(db.String(128), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    nombre = db.Column(db.String(100), nullable=False)
    telefono = db.Column(db.String(20), nullable=True)
    fecha_nacimiento = db.Column(db.Date, nullable=True)
    genero = db.Column(db.String(10), nullable=True)  # masculino, femenino, otro
    direccion = db.Column(db.String(200), nullable=True)
    activo = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relación con turnos
    turnos = db.relationship('Turno', backref='cliente', lazy=True, cascade='all, delete-orphan')

    def __init__(self, **kwargs):
        """Constructor del cliente"""
        super().__init__(**kwargs)

    def __repr__(self):
        return f'<Cliente {self.id}: {self.nombre} ({self.email})>'

    def to_dict(self):
        """Convertir el modelo a diccionario"""
        return {
            'id': self.id,
            'firebase_uid': self.firebase_uid,
            'email': self.email,
            'nombre': self.nombre,
            'telefono': self.telefono,
            'fecha_nacimiento': self.fecha_nacimiento.isoformat() if self.fecha_nacimiento else None,
            'genero': self.genero,
            'direccion': self.direccion,
            'activo': self.activo,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'total_turnos': len(self.turnos) if self.turnos else 0
        }

    def save(self):
        """Guardar el cliente en la base de datos"""
        self.updated_at = datetime.utcnow()
        db.session.add(self)
        db.session.commit()

    def delete(self):
        """Eliminar el cliente de la base de datos"""
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def get_all(cls):
        """Obtener todos los clientes"""
        return cls.query.filter_by(activo=True).all()

    @classmethod
    def get_by_id(cls, cliente_id):
        """Obtener cliente por ID"""
        return db.session.get(cls, cliente_id)

    @classmethod
    def get_by_firebase_uid(cls, firebase_uid):
        """Obtener cliente por Firebase UID"""
        return cls.query.filter_by(firebase_uid=firebase_uid, activo=True).first()

    @classmethod
    def get_by_email(cls, email):
        """Obtener cliente por email"""
        return cls.query.filter_by(email=email, activo=True).first()

    @classmethod
    def create_from_firebase(cls, firebase_data):
        """Crear cliente desde datos de Firebase"""
        cliente = cls(
            firebase_uid=firebase_data.get('uid'),
            email=firebase_data.get('email'),
            nombre=firebase_data.get('name', firebase_data.get('display_name', 'Usuario')),
            telefono=firebase_data.get('phone_number')
        )
        cliente.save()
        return cliente
