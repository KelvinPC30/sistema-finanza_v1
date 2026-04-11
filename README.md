# FinVisor - Sistema de Gestión de Finanzas Personales

![Laravel](https://img.shields.io/badge/Laravel-12.x-orange?style=flat&logo=laravel)
![React](https://img.shields.io/badge/React-18.x-blue?style=flat&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=flat&logo=mysql)

## Descripción

FinVisor es un sistema de gestión de finanzas personales desarrollado con Laravel (backend) y React (frontend).

## Características

- ✅ Registro e inicio de sesión de usuarios
- ✅ Dashboard con resumen financiero
- ✅ CRUD completo de cuentas (Cuenta Corriente, Ahorros, Tarjeta de Crédito)
- ✅ Registro de transacciones (Ingresos/Gastos)
- ✅ Sistema de roles (Administrador/General)
- ✅ Autenticación con Laravel Sanctum (tokens JWT)
- ✅ CI/CD configurado con GitHub Actions

## Tech Stack

- **Backend:** Laravel 12 + PHP 8.2
- **Frontend:** React 18 + Vite
- **Base de Datos:** MySQL 8.0
- **Autenticación:** Laravel Sanctum

## Instalación

### Requisitos Previos

- PHP 8.2+
- Node.js 18+
- MySQL 8.0+
- Composer

### Clonar el repositorio

```bash
git clone https://github.com/KelvinPC30/sistema-finanza_v1.git
cd sistema-finanza_v1
```

### Backend (Laravel)

```bash
cd backend

# Instalar dependencias
composer install

# Configurar entorno
cp .env.example .env

# Generar clave
php artisan key:generate

# Ejecutar migraciones
php artisan migrate

# Ejecutar seeders
php artisan db:seed --class=UserSeeder
```

### Frontend (React)

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## Credenciales de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | admin@finvisor.local | password123 |
| Usuario General | test@finvisor.local | password123 |

## Rutas de la API

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/user

GET    /api/accounts
POST   /api/accounts
GET    /api/accounts/{id}
PUT    /api/accounts/{id}
DELETE /api/accounts/{id}

POST   /api/accounts/{id}/transactions
GET    /api/accounts/{id}/transactions

GET /api/dashboard
```

## Desarrollo

### Iniciar servidores

```bash
# Backend (Puerto 8000)
cd backend && php artisan serve

# Frontend (Puerto 5173)
cd frontend && npm run dev
```

### Ramas Git

- `master` - Rama principal (producción)
- `develop` - Rama de desarrollo

## CI/CD

El proyecto incluye un workflow de GitHub Actions que:
- Ejecuta tests de PHPUnit
- Verifica el build de React
- Corre linting

## Licencia

MIT License