# 📋 ANÁLISIS DE ARCHIVOS BACKEND

## 📂 **ESTRUCTURA ACTUAL**

### ✅ **ARCHIVOS NECESARIOS** (MANTENER)
```
backend/
├── app.py                              # ✅ Aplicación principal
├── requirements.txt                    # ✅ Dependencias
├── README.md                          # ✅ Documentación
├── .gitignore                         # ✅ Git ignore
├── config/
│   ├── __init__.py                    # ✅ Package init
│   └── config.py                      # ✅ Configuraciones
├── models/
│   ├── __init__.py                    # ✅ Package init
│   ├── database.py                    # ✅ Config SQLAlchemy
│   ├── cliente.py                     # ✅ Modelo Cliente
│   └── turno.py                       # ✅ Modelo Turno
├── routes/
│   ├── __init__.py                    # ✅ Package init
│   ├── main.py                        # ✅ Rutas principales
│   ├── turnos.py                      # ✅ CRUD turnos
│   └── auth.py                        # ✅ Autenticación
├── tests/
│   ├── __init__.py                    # ✅ Package init
│   ├── conftest.py                    # ✅ Config pytest
│   ├── test_models.py                 # ✅ Tests modelos
│   ├── test_routes.py                 # ✅ Tests rutas
│   └── test_turnos_api.py             # ✅ Tests API
└── migrations/
    ├── alembic.ini                    # ✅ Config Alembic
    ├── env.py                         # ✅ Entorno migrations
    ├── README                         # ✅ Info migrations
    ├── script.py.mako                 # ✅ Template migrations
    └── versions/
        ├── inicial001_...py           # ✅ Migración inicial
        └── 9fc506c9ed63_...py         # ✅ Migración actualizada
```

### ❌ **ARCHIVOS INNECESARIOS** (ELIMINAR)
```
❌ test_models_relaciones.py          # Script temporal de testing
❌ test_app.py                        # Test duplicado/obsoleto
❌ main.py                            # Archivo principal obsoleto
❌ debug_test.py                      # Script temporal de debug
❌ create_database.py                 # Script temporal para crear DB
❌ conftest.py                        # Duplicado de tests/conftest.py
❌ auth_firebase.py                   # Demo Firebase obsoleto
❌ app_new.py                         # Versión alternativa obsoleta
❌ models/turno_old.py                # Versión antigua del modelo
❌ models/turno_new.py                # Versión temporal del modelo
❌ models/turno_fixed.py              # Versión temporal corregida
```

## 🧹 **PLAN DE LIMPIEZA**

### 1️⃣ Eliminar archivos temporales de desarrollo
### 2️⃣ Eliminar versiones obsoletas de modelos
### 3️⃣ Eliminar scripts de testing temporal
### 4️⃣ Verificar que no se rompa nada

## 📊 **RESUMEN**
- **Total archivos**: 36
- **Mantener**: 25 archivos
- **Eliminar**: 11 archivos
- **Reducción**: ~30% del desorden
