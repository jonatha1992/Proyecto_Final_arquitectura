from models.database import db

class Turno(db.Model):
    """Modelo para turnos de depilación"""
    __tablename__ = 'turnos'
    
    id = db.Column(db.Integer, primary_key=True)
    usuario = db.Column(db.String(120), nullable=False)
    fecha = db.Column(db.String(50), nullable=False)
    hora = db.Column(db.String(20), nullable=False)
    descripcion = db.Column(db.String(200), nullable=True)
    estado = db.Column(db.String(20), default='pendiente')  # pendiente, confirmado, cancelado
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def __init__(self, **kwargs):
        """Constructor que asigna valores por defecto"""
        super().__init__(**kwargs)
        if self.estado is None:
            self.estado = 'pendiente'

    def __repr__(self):
        return f'<Turno {self.id}: {self.usuario} - {self.fecha} {self.hora}>'

    def to_dict(self):
        """Convertir el modelo a diccionario"""
        return {
            'id': self.id,
            'usuario': self.usuario,
            'fecha': self.fecha,
            'hora': self.hora,
            'descripcion': self.descripcion,
            'estado': self.estado,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

    def save(self):
        """Guardar el turno en la base de datos"""
        db.session.add(self)
        db.session.commit()

    def delete(self):
        """Eliminar el turno de la base de datos"""
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def get_all(cls):
        """Obtener todos los turnos"""
        return cls.query.all()

    @classmethod
    def get_by_id(cls, turno_id):
        """Obtener turno por ID"""
        return db.session.get(cls, turno_id)

    @classmethod
    def get_by_usuario(cls, usuario):
        """Obtener turnos por usuario"""
        return cls.query.filter_by(usuario=usuario).all()
