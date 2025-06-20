"""Crear modelos Cliente y Turno con relaciones

Revision ID: inicial001
Revises: 
Create Date: 2025-06-20 15:55:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'inicial001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Crear tabla clientes
    op.create_table('clientes',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('firebase_uid', sa.String(length=128), nullable=False),
        sa.Column('email', sa.String(length=120), nullable=False),
        sa.Column('nombre', sa.String(length=100), nullable=False),
        sa.Column('telefono', sa.String(length=20), nullable=True),
        sa.Column('fecha_nacimiento', sa.Date(), nullable=True),
        sa.Column('genero', sa.String(length=10), nullable=True),
        sa.Column('direccion', sa.String(length=200), nullable=True),
        sa.Column('activo', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('firebase_uid')
    )
    
    # Crear tabla turnos
    op.create_table('turnos',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('cliente_id', sa.Integer(), nullable=False),
        sa.Column('fecha', sa.String(length=50), nullable=False),
        sa.Column('hora', sa.String(length=20), nullable=False),
        sa.Column('servicio', sa.String(length=100), nullable=True),
        sa.Column('descripcion', sa.String(length=200), nullable=True),
        sa.Column('precio', sa.Float(), nullable=True),
        sa.Column('estado', sa.String(length=20), nullable=True),
        sa.Column('notas', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['cliente_id'], ['clientes.id'], name='fk_turno_cliente'),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    op.drop_table('turnos')
    op.drop_table('clientes')
