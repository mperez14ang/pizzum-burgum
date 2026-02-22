# PizzUM & BurgUM

> Sistema web Full Stack para la gestión de pedidos y ventas de la cadena de restaurantes **PizzUM & BurgUM**.

Desarrollado por **Synergy Software** como proyecto universitario para la **Universidad de Montevideo** — Proyecto TIC 2025.

[![GitHub version](https://img.shields.io/github/v/tag/mperez14ang/pizzum-burgum?label=Version)](https://github.com/mperez14ang/pizzum-burgum/tags)

## Equipo

| Nombre | Rol |
|--------|-----|
| Eduardo Delfante | Full Stack Developer |
| Manuel Pérez | Full Stack Developer |
| Paolo Portugal | Full Stack Developer |

**Profesor:** Nicolás Navarro  
**Empresa:** Synergy Software (SYS)™  

## Descripción

Sistema que permite la operativa completa de ventas y recepción de pedidos para una cadena de restaurantes de pizzas y hamburguesas personalizadas. El modelo de negocio se basa en **costos dinámicos por componente**: cada cliente diseña su propia creación eligiendo ingredientes, y el precio se calcula automáticamente según los componentes seleccionados.

### Principales funcionalidades

**Para clientes:**
- Diseño de pizzas y hamburguesas personalizadas
- Carrito de compras y seguimiento de pedidos
- Favoritos, historial de pedidos, gestión de direcciones y métodos de pago

**Para administradores:**
- Gestión de catálogo de productos (alta, baja, modificación)
- Control de estado de pedidos
- Gestión de usuarios administradores

**Integraciones externas:**
- Pagos online vía **Stripe**
- Reporte de ventas a **DGI**
- Estadísticas de usuarios para **BPS**

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React, HTML, CSS, JavaScript |
| Backend | Java, Spring Boot, Maven |
| Base de Datos | PostgreSQL (prod), H2 (dev/test) |
| Autenticación | JWT |
| Pagos | Stripe |
| Infraestructura | Oracle Cloud (VM Linux) |
| Control de versiones | Git |

**Arquitectura:** MVC en capas (Presentación → Negocio → Acceso a Datos)


## Seguridad

- Contraseñas hasheadas con **BCrypt** (mínimo 8 caracteres)
- Datos de tarjetas gestionados mediante **Stripe ID**
- Control de acceso basado en roles (`cliente` / `administrador`)
- Conexiones seguras para todas las APIs REST


## API Endpoints

### Autenticación (`/api/auth/v1`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/login` | Inicio de sesión |
| POST | `/register` | Registro de cliente |
| GET | `/verify` | Verificar token |
| POST | `/password` | Cambiar contraseña |

### Clientes (`/api/client/v1`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/` | Crear cliente |
| GET | `/{clientId}` | Obtener cliente por ID |
| GET | `/` | Listar todos los clientes |
| PUT | `/` | Actualizar cliente |
| DELETE | `/{clientId}` | Eliminar cliente |
| POST | `/{clientId}/address` | Agregar dirección |

### Administradores (`/api/admin/v1`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/` | Crear administrador |
| GET | `/` | Listar administradores |
| GET | `/{email}` | Obtener administrador |
| PUT | `/{email}` | Actualizar administrador |

### Pedidos (`/api/order/v1`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/` | Crear pedido |
| GET | `/{orderId}` | Obtener pedido |
| PUT | `/{orderId}` | Actualizar estado |
| GET | `/list/my` | Mis pedidos |
| GET | `/list` | Todos los pedidos (admin) |

### Productos (`/api/products`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/` | Crear producto |
| GET | `/?category,type,available` | Listar con filtros |
| GET | `/ingredients` | Listar ingredientes |
| PUT | `/{productId}` | Actualizar producto |
| DELETE | `/{productId}` | Eliminar producto |

### Carrito (`/api/cart/v1`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/` | Crear carrito / agregar item |
| GET | `/` | Ver carrito actual |
| POST | `/checkout` | Finalizar compra |
| POST | `/add_extras_as_creation` | Agregar extras |

### Tarjetas (`/api/card/v1`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/` | Registrar tarjeta |
| GET | `/` | Listar tarjetas |
| GET | `/{cardId}` | Obtener tarjeta |
| PUT | `/{cardId}` | Actualizar tarjeta |
| DELETE | `/{cardId}` | Eliminar tarjeta |
| PATCH | `/{cardId}/active` | Establecer tarjeta activa |

### Favoritos (`/api/favorites`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/{clientEmail}` | Obtener favoritos |
| POST | `/` | Crear lista de favoritos |
| PUT | `/{favoriteId}` | Actualizar favoritos |
| DELETE | `/{favoriteId}` | Eliminar favoritos |

### Creaciones (`/api/creation/v1`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/` | Crear creación |
| GET | `/` | Listar creaciones |
| GET | `/{creationId}` | Obtener creación |

### DGI (`/api/dgi`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/orders?date` | Órdenes de un día |
| GET | `/orders/range?startDate&endDate` | Órdenes en rango de fechas |

### BPS (`/api/bps`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/users/statistics` | Estadísticas de usuarios |


## Compilar y Correr

### Requisitos del sistema
- Java 21
- Maven
- Node.js

### Instalación y configuración

```bash
# Clonar repositorio
git clone https://github.com/mperez14ang/pizzum-burgum
```

Crear archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
DB_URL=pizzumnburgum.duckdns.org:5432
DB_NAME=solo_pruebas
DB_ADMIN_USERNAME=postgres
DB_ADMIN_PASSWORD=proyectotic2025!
JPA_DDL_AUTO=create
ADMIN_USERNAME=admin
ADMIN_PASSWORD=proyectotic2025!
SECRET_KEY=03d44642ae7bedc558ede4689c77f324af4b2115b0bc07e0141b180947e134d3
PRIVATE_STRIPE_KEY=sk_test_...
PUBLIC_STRIPE_KEY=pk_test_...
```

Configurar variables de entorno del sistema:
- `JAVA_HOME` → ruta al JDK 21, agregar `%JAVA_HOME%\bin\` al PATH
- `MAVEN_HOME` → ruta a Maven, agregar `%MAVEN_HOME%\bin\` al PATH

### Compilar
Genera: target/pizzumburgum-0.0.1-SNAPSHOT.jar
```bash
mvn clean package
```

### Correr
Disponible en: localhost:8080
```bash
java -jar target/pizzumburgum-0.0.1-SNAPSHOT.jar
```

## Flujo del Usuario

```
Página Principal
│
├── [Sin sesión iniciada]
│   ├── Login ──────────────────────────────────────────────────┐
│   └── Register (desde ícono usuario, favoritos o carrito)     │
│                                                               │
└── [Sesión iniciada] ◄─────────────────────────────────────────┘
    │   (se guardan cookies: logueado + usuario)
    │
    ├── Pizza
    │   ├── Elegir base (Tamaño + Masa) *obligatorio
    │   ├── Salsa (opcional)
    │   ├── Queso (opcional)
    │   └── Elegir ingredientes (toppings)
    │
    ├── Hamburguesa
    │   ├── Pan *obligatorio
    │   ├── Carne (cantidad ≤ 3) *obligatorio
    │   ├── Queso (opcional)
    │   └── Elegir ingredientes (toppings)
    │
    ├── [Agregar al Carrito]
    │   ├── ¿Existe carrito? → Sí: agregar orden / No: crear carrito
    │   ├── Agregar extras (bebidas, postres)
    │   ├── ¿Desea llevar algo más? → Sí: volver a Página Principal
    │   └── No → Continuar al Checkout
    │           ├── Confirmar dirección (elegir guardada o nueva)
    │           ├── Elegir tarjeta (guardada o nueva)
    │           ├── ¿Tarjeta y dirección válida? → No: volver
    │           └── Sí → Completar pago con Stripe
    │                   ├── ¿Pago realizado? → No: reintentar
    │                   └── Sí → Mostrar resumen del pedido y estado
    │
    └── Perfil de Usuario
        ├── Cambiar imagen de perfil
        ├── Cambiar Contraseña
        ├── Cambiar / Agregar / Eliminar dirección
        ├── Agregar / Eliminar tarjetas
        └── Historial de pedidos
            ├── Filtrar pedidos por fecha
            ├── Ver estado del pedido en tiempo real
            └── Ver información del pedido
```


## Flujo del Administrador

```
Loguearse como Administrador
│
├── Pedidos
│   ├── Mostrar lista de pedidos recientes
│   ├── Opciones de filtro por estado:
│   │   Sin Pagar / En Cola / Preparando / En Camino / Entregado / Cancelado
│   ├── Ver detalle de un pedido
│   └── Cambiar estado de un pedido
│
├── Productos
│   ├── Mostrar lista de productos
│   ├── Filtro por categoría: Pizza / Hamburguesa / Extra
│   ├── Filtro adicional: Activo / No Activo / Borrados
│   ├── Crear un producto
│   ├── Editar un producto
│   ├── Borrar un producto
│   └── Marcar producto como disponible / no disponible
│
├── Usuarios
│   ├── Ver Clientes / Administradores
│   │   ├── Ver Clientes
│   │   └── Ver Administradores
│   └── Agregar Administrador
│
└── Mi Perfil
    ├── Cambiar imagen de perfil
    └── Cambiar Contraseña
```