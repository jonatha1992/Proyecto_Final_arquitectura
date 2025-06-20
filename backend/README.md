# Backend - API de Depilación Definitiva

Flask API para gestión de turnos con autenticación Firebase y base de datos SQLite.

## 📁 Estructura del Proyecto

```
backend/
├── config/
│   ├── __init__.py
│   └── config.py          # Configuraciones por entorno (dev, test, prod)
├── models/
│   ├── __init__.py
│   ├── database.py        # Configuración de base de datos
│   └── turno.py          # Modelo de datos Turno
├── routes/
│   ├── __init__.py
│   ├── main.py           # Rutas generales (health, servicios)
│   └── turnos.py         # CRUD de turnos
├── tests/
│   ├── __init__.py
│   ├── conftest.py       # Configuración de pytest
│   ├── test_models.py    # Tests de modelos
│   ├── test_routes.py    # Tests de rutas generales
│   └── test_turnos_api.py # Tests de API de turnos
├── .env                  # Variables de entorno
├── .gitignore           # Archivos a ignorar en git
├── app.py               # Aplicación principal
├── requirements.txt     # Dependencias Python
└── README.md           # Este archivo
```

## 🚀 Instalación y Configuración

1. **Crear entorno virtual:**
   ```bash
   python -m venv .venv
   .venv\Scripts\Activate  # Windows
   ```

2. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configurar variables de entorno (.env):**
   ```
   FLASK_ENV=development
   SECRET_KEY=tu_clave_secreta
   DATABASE_URL=sqlite:///turnos.db
   FIREBASE_CREDENTIALS_PATH=firebase_service_account.json
   ```

4. **Ejecutar migraciones:**
   ```bash
   flask db init
   flask db migrate -m "Migración inicial"
   flask db upgrade
   ```

## 🏃‍♂️ Ejecutar la Aplicación

```bash
python app.py
```

El servidor estará disponible en: `http://localhost:5000`

## 🧪 Ejecutar Tests

```bash
# Todos los tests
pytest

# Con información detallada
pytest -v

# Tests específicos
pytest tests/test_turnos_api.py -v
```

## 📡 Endpoints Disponibles

### Rutas Generales
- `GET /` - Información de la API
- `GET /health` - Estado del servidor
- `GET /servicios` - Lista de servicios disponibles

### Turnos (CRUD)
- `GET /turnos` - Obtener todos los turnos
- `POST /turnos` - Crear nuevo turno
- `GET /turnos/<id>` - Obtener turno específico
- `PUT /turnos/<id>` - Actualizar turno
- `DELETE /turnos/<id>` - Eliminar turno
- `GET /turnos/usuario/<email>` - Turnos por usuario

## 📝 Ejemplo de Uso

### Crear un turno:
```bash
curl -X POST http://localhost:5000/turnos \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "test@example.com",
    "fecha": "2025-01-15",
    "hora": "10:00",
    "descripcion": "Depilación facial"
  }'
```

### Obtener turnos:
```bash
curl http://localhost:5000/turnos
```

## 🏗️ Arquitectura

- **Flask Application Factory**: Patrón para crear múltiples instancias de la app
- **Blueprints**: Organización modular de rutas
- **SQLAlchemy ORM**: Mapeo objeto-relacional para base de datos
- **Flask-Migrate**: Gestión de migraciones de BD
- **Pytest**: Framework de testing con fixtures

## 🔧 Tecnologías Utilizadas

- **Flask**: Framework web minimalista
- **SQLAlchemy**: ORM para base de datos
- **SQLite**: Base de datos ligera
- **Flask-CORS**: Soporte para CORS
- **Pytest**: Framework de testing
- **Firebase Admin**: Autenticación (opcional)

## 📚 Comandos Útiles

```bash
# Crear nueva migración
flask db migrate -m "Descripción del cambio"

# Aplicar migraciones
flask db upgrade

# Ejecutar tests con cobertura
pytest --cov=models --cov=routes

# Linter de código
flake8 .

# Formatear código
black .
```
