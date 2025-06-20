import pytest
from models.turno import Turno
from models.database import db

class TestTurnoModel:
    """Tests para el modelo Turno"""
    
    def test_turno_creation(self, app_context):
        """Test: Crear instancia del modelo Turno"""
        turno = Turno(
            usuario='test@example.com',
            fecha='2025-01-15',
            hora='10:00',
            descripcion='Depilación facial'
        )
        
        assert turno.usuario == 'test@example.com'
        assert turno.fecha == '2025-01-15'
        assert turno.hora == '10:00'
        assert turno.descripcion == 'Depilación facial'
        assert turno.estado == 'pendiente'  # Valor por defecto
    
    def test_turno_to_dict(self, app_context):
        """Test: Conversión del modelo a diccionario"""
        turno = Turno(
            usuario='test@example.com',
            fecha='2025-01-15',
            hora='10:00',
            descripcion='Depilación facial'
        )
        
        turno_dict = turno.to_dict()
        
        assert isinstance(turno_dict, dict)
        assert turno_dict['usuario'] == 'test@example.com'
        assert turno_dict['fecha'] == '2025-01-15'
        assert turno_dict['hora'] == '10:00'
        assert turno_dict['estado'] == 'pendiente'
    
    def test_turno_save_to_db(self, app_context):
        """Test: Guardar turno en base de datos"""
        turno = Turno(
            usuario='test@example.com',
            fecha='2025-01-15',
            hora='10:00',
            descripcion='Depilación facial'
        )
        
        turno.save()
        
        # Verificar que se guardó
        saved_turno = Turno.query.first()
        assert saved_turno is not None
        assert saved_turno.usuario == 'test@example.com'
        assert saved_turno.id is not None
    
    def test_turno_delete(self, app_context):
        """Test: Eliminar turno de base de datos"""
        turno = Turno(
            usuario='test@example.com',
            fecha='2025-01-15',
            hora='10:00',
            descripcion='Depilación facial'
        )
        
        turno.save()
        turno_id = turno.id
        
        # Eliminar turno
        turno.delete()
        
        # Verificar que se eliminó
        deleted_turno = Turno.get_by_id(turno_id)
        assert deleted_turno is None
    
    def test_get_all_turnos(self, app_context):
        """Test: Obtener todos los turnos"""
        # Crear varios turnos
        turno1 = Turno(usuario='user1@example.com', fecha='2025-01-15', hora='10:00')
        turno2 = Turno(usuario='user2@example.com', fecha='2025-01-16', hora='11:00')
        
        turno1.save()
        turno2.save()
        
        # Obtener todos
        turnos = Turno.get_all()
        assert len(turnos) == 2
    
    def test_get_turnos_by_usuario(self, app_context):
        """Test: Obtener turnos por usuario"""
        # Crear turnos para diferentes usuarios
        turno1 = Turno(usuario='user1@example.com', fecha='2025-01-15', hora='10:00')
        turno2 = Turno(usuario='user1@example.com', fecha='2025-01-16', hora='11:00')
        turno3 = Turno(usuario='user2@example.com', fecha='2025-01-17', hora='12:00')
        
        turno1.save()
        turno2.save()
        turno3.save()
        
        # Obtener turnos de user1
        turnos_user1 = Turno.get_by_usuario('user1@example.com')
        assert len(turnos_user1) == 2
        
        # Obtener turnos de user2
        turnos_user2 = Turno.get_by_usuario('user2@example.com')
        assert len(turnos_user2) == 1
    
    def test_turno_repr(self, app_context):
        """Test: Representación string del modelo"""
        turno = Turno(
            usuario='test@example.com',
            fecha='2025-01-15',
            hora='10:00',
            descripcion='Depilación facial'
        )
        turno.save()
        
        repr_str = repr(turno)
        assert 'Turno' in repr_str
        assert 'test@example.com' in repr_str
        assert '2025-01-15' in repr_str
        assert '10:00' in repr_str
