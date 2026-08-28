import { Injectable, signal } from '@angular/core';
import { Product } from '../../../shared/models/product.model';

const PRODUCTS: Product[] = [
  {
    slug: 'vigiliner',
    name: 'Vigiliner',
    shortDescription: 'Documentación funcional y técnica de Vigiliner.',
    status: 'disponible',
    statusLabel: 'Versión 1.0.0',
    logoUrl: 'products/vigiliner.png',
    logoWidth: 333,
    logoHeight: 351,
    functionalDoc: [
      {
        title: '¿Qué es Vigiliner?',
        paragraphs: [
          'Vigiliner es una plataforma SaaS de control y rastreo vehicular en tiempo real, con soporte multiempresa (multi-tenant): cada empresa cliente administra su propia flota, conductores y usuarios de forma aislada.',
        ],
      },
      {
        title: 'Roles de usuario',
        items: [
          'Super Administrador: administra la plataforma completa — todas las empresas clientes, usuarios globales, inventario de hardware GPS y líneas SIM, catálogos del sistema y el mapa global de todas las unidades.',
          'Admin de empresa: administra la flota, los conductores y los usuarios de su propia empresa.',
          'Monitorista: rol operativo de seguimiento dentro de una empresa — ve el mapa, las unidades (solo lectura) y reportes, pero no los módulos de gestión.',
          'Cliente visualización: rol de solo lectura, limitado al mapa de la empresa, sin poder enviar comandos remotos.',
        ],
      },
      {
        title: 'Módulos del panel de empresa',
        items: [
          'Dashboard: resumen operativo — unidades totales, en línea, conductores, km recorridos hoy y alertas, más actividad reciente de la flota.',
          'Mapa General: rastreo en tiempo real de las unidades en mapa, con lista filtrable por placa o conductor y panel de detalle por unidad (velocidad, batería, señal, dirección aproximada, datos del vehículo, posición y rumbo).',
          'Unidades: listado y gestión de la flota (placa, tipo, modelo, conductor asignado, empresa operadora, estatus operativo, estado GPS, última señal).',
          'Conductores: alta y gestión de choferes, separados en Internos (empleados) y Externos (terceros/subcontratados).',
          'Usuarios: invitación y gestión de accesos de la empresa por rol.',
          'Geocercas: dibujo de polígonos sobre el mapa y asignación a unidades, con alertas configurables de entrada y/o salida.',
          'Incidencias: registro de eventos operativos (siniestro, exceso de velocidad, falla mecánica, robo, otro) con severidad, estado y evidencia adjunta.',
          'Alertas: bandeja de eventos críticos detectados automáticamente sobre la flota.',
          'Reportes: velocidad y detención por unidad, con gráfica, KPIs y exportación a PDF.',
        ],
      },
      {
        title: 'Acciones remotas sobre una unidad',
        paragraphs: [
          'Desde el detalle de una unidad en el Mapa General se pueden enviar comandos directos al dispositivo GPS instalado en el vehículo:',
        ],
        items: [
          'Desactivar / Activar unidad (según el estado real del motor)',
          'Activar alarma',
          'Solicitar posición',
          'Reiniciar dispositivo',
        ],
      },
      {
        title: 'Panel de Super Administrador',
        items: [
          'Consola ejecutiva: KPIs globales (empresas activas, unidades totales, GPS instalados, usuarios totales) y crecimiento de la plataforma.',
          'Empresas: alta, edición, suspensión y baja de empresas clientes, con detalle de usuarios y unidades por empresa y su plan.',
          'Usuarios: todos los usuarios de la plataforma y de cada empresa cliente.',
          'Unidades: flota consolidada de todas las empresas.',
          'Dispositivos GPS: inventario de hardware rastreador y su asignación a unidades.',
          'Teléfonos/SIM: inventario de líneas asignables a los dispositivos GPS.',
          'Mapa Global: mapa en tiempo real de todas las unidades de todas las empresas, filtrable por empresa y estado.',
          'Reportes: velocidad y detención, e historial de comandos remotos, a nivel de toda la plataforma.',
          'Configuración: catálogos de tipos de unidad, condiciones de unidad y modelos GPS usados en los formularios de alta.',
        ],
      },
    ],
    technicalDoc: [
      {
        title: 'Arquitectura general',
        paragraphs: [
          'Aplicación web (SPA) desplegada en Cloudflare Workers, con un backend/API propio que alimenta el frontend y recibe telemetría de los dispositivos GPS instalados en las unidades.',
        ],
        screenshots: [
          {
            src: 'products/vigiliner/technical/arquitectura-general.png',
            width: 1347,
            height: 567,
            alt: 'Diagrama comparativo de arquitectura: la actual (Angular 8, backend Express con Mongo para trazabilidad GPS y MySQL para datos generales, más un panel admin en Codeigniter) y la nueva propuesta (frontend React, backend as a service con Supabase sobre Postgres)',
          },
        ],
      },
      {
        title: 'Multi-tenancy y roles (RBAC)',
        paragraphs: [
          'El modelo de datos aísla la información por empresa (tenant): unidades, conductores y usuarios pertenecen a una o más empresas, salvo el rol Super Admin, que tiene visión y gestión cross-tenant. El rol se valida con políticas RLS en Postgres, no solo en el cliente.',
        ],
        items: [
          'super_admin (plataforma)',
          'company_admin (por tenant)',
          'monitor (por tenant, lectura + acciones remotas)',
          'viewer (por tenant, solo lectura)',
        ],
      },
      {
        title: 'Multi-empresa y empresa operadora',
        paragraphs: [
          'Un usuario company_admin o monitor puede pertenecer a más de una empresa (tabla company_members); en ese caso las tablas de Unidades y Conductores muestran una columna adicional "Empresa".',
          'Una unidad puede pertenecer a una empresa (propietaria) y ser operada por otra (préstamo o arrendamiento entre empresas): la operadora obtiene visibilidad y gestión completa (mapa, conductores, incidencias) sin que se transfiera la propiedad.',
        ],
      },
      {
        title: 'Entidades de datos principales',
        items: [
          'Empresa (tenant): nombre, plan (ej. Enterprise), estado, fecha de creación, conteo de unidades/usuarios/admins.',
          'Usuario: nombre, correo, rol, empresa(s) asociada(s), estado (activo/desactivado).',
          'Unidad (vehículo): nombre, placa, tipo, marca, modelo, año, número de serie, kilometraje, conductor asignado, empresa propietaria/operadora, estatus operativo, estado GPS, última señal, posición (lat/long), rumbo, velocidad, señal.',
          'Conductor: nombre, foto, teléfono, email, licencia y vigencia, unidad asignada, tipo (interno/externo), activo.',
          'Dispositivo GPS: modelo (catálogo, ej. Queclink GV55W), IMEI, línea SIM asociada, batería, estado (asignado/disponible/retirado).',
          'Teléfono/SIM: número, ICCID, compañía, plan, estado — reutilizable entre dispositivos GPS.',
          'Geocerca: nombre, color, polígono, alertas de entrada/salida, unidades asignadas.',
          'Incidencia: título, tipo, severidad, unidad, conductor, estado, descripción, evidencia.',
          'Comando remoto (remote_commands): unidad, tipo de comando, estado (pending/sent/acknowledged/failed/timeout), operador que lo emitió, timestamps.',
        ],
      },
      {
        title: 'Integración con hardware GPS',
        paragraphs: [
          'Cada unidad se vincula a un dispositivo GPS físico (modelos Queclink, catalogados en Configuración) con línea SIM propia. El backend recibe telemetría (posición, velocidad, batería, señal, estado del motor) y expone comandos remotos hacia el dispositivo: desactivar/activar unidad, activar alarma, solicitar posición y reiniciar. El botón de encendido/apagado de motor es un toggle que refleja la telemetría real reportada por el GPS, no solo el último comando enviado desde la app.',
        ],
      },
      {
        title: 'Tiempo real',
        paragraphs: [
          'El Mapa General y el Mapa Global muestran actualización en vivo ("LIVE") de posición y estado de las unidades vía Supabase Realtime (postgres_changes).',
        ],
      },
      {
        title: 'Soft delete',
        paragraphs: [
          'Las entidades principales (empresas, unidades, conductores) nunca se borran físicamente: se marcan con `deleted_at` (o el estado `retired` en GPS/SIM) y dejan de listarse, pero su historial se conserva. Al eliminar, la app libera las referencias que la entidad sostenía (unidad → libera su GPS asignado; conductor → libera su unidad).',
        ],
      },
      {
        title: 'Estado actual del MVP',
        statusItems: [
          { label: 'Autenticación', tone: 'done' },
          { label: 'Dashboard', tone: 'done' },
          { label: 'Mapa en tiempo real', tone: 'done' },
          { label: 'Unidades', tone: 'done' },
          { label: 'Conductores', text: 'Internos y externos.', tone: 'done' },
          { label: 'Usuarios y roles', tone: 'done' },
          {
            label: 'Panel de Super Admin',
            text: 'Empresas, usuarios, unidades, GPS, teléfonos, mapa global, catálogos.',
            tone: 'done',
          },
          { label: 'Geocercas', text: 'Editor de polígonos con alertas de entrada/salida.', tone: 'done' },
          { label: 'Incidencias y Alertas', tone: 'done' },
          {
            label: 'Reportes',
            text: 'Velocidad y detención, e historial de comandos remotos.',
            tone: 'done',
          },
          {
            label: 'Multi-empresa y empresa operadora',
            text: 'Recién incorporado — un usuario o unidad puede asociarse a más de una empresa.',
            tone: 'partial',
          },
        ],
      },
    ],
    manualOverview: {
      roleColumns: ['Super Admin', 'Admin de empresa', 'Monitorista', 'Cliente visualización'],
      rows: [
        { capability: 'Dashboard', values: ['Global (toda la plataforma)', 'De su empresa', '—', '—'] },
        { capability: 'Mapa en vivo', values: ['Global (todas las empresas)', 'De su empresa', 'De su empresa', 'De su empresa'] },
        { capability: 'Unidades', values: ['Gestión global', 'Gestión completa', 'Solo lectura', '—'] },
        { capability: 'Conductores', values: ['—', 'Gestión completa', '—', '—'] },
        { capability: 'Usuarios', values: ['Gestión global', 'De su empresa', '—', '—'] },
        { capability: 'Geocercas', values: ['—', 'Gestión completa', '—', '—'] },
        { capability: 'Incidencias', values: ['—', 'Gestión completa', 'Crear y editar las propias', '—'] },
        { capability: 'Alertas', values: ['—', 'Solo lectura', '—', '—'] },
        { capability: 'Reportes de velocidad', values: ['Global', 'De su empresa', 'De su empresa', '—'] },
        { capability: 'Historial de comandos', values: ['Global', '—', '—', '—'] },
        { capability: 'Configuración (catálogos)', values: ['Gestión completa', '—', '—', '—'] },
        { capability: 'Acciones remotas al GPS', values: ['Sí', 'Sí', 'Sí', 'No'] },
        { capability: 'Mi perfil', values: ['Sí', 'Sí', 'Sí', 'Sí'] },
      ],
    },
    manualCommonSteps: [
      {
        title: 'Mi perfil',
        description: [
          'Disponible para cualquier rol desde el avatar en la esquina superior derecha. Tiene dos pestañas: "General" (foto, nombre completo, teléfono; el correo no es editable ahí — hay que pedirle el cambio al administrador) y "Seguridad" (cambio de contraseña y cierre de todas las sesiones activas).',
        ],
        businessRules: [
          'Para cambiar la contraseña hay que volver a escribir la contraseña actual — la app revalida las credenciales antes de aceptar la nueva.',
          '"Cerrar todas las sesiones" cierra la sesión en todos los dispositivos, incluido el actual — hay que volver a iniciar sesión después.',
        ],
        pendingScreenshots: true,
      },
    ],
    userManual: [
      {
        id: 'super-admin',
        name: 'Super Administrador',
        summary:
          'Gestiona la plataforma completa: todas las empresas clientes, sus usuarios, la flota consolidada, el inventario de hardware (GPS y SIM), los reportes globales y los catálogos del sistema. Accede desde /super tras iniciar sesión con una cuenta con rol Super Admin.',
        steps: [
          {
            title: 'Panel principal (Dashboard)',
            description: [
              'Al iniciar sesión se muestra la Consola Ejecutiva con los indicadores clave de toda la plataforma: empresas activas, unidades totales, GPS instalados y usuarios totales, además de una gráfica de crecimiento de los últimos 6 meses y el listado de empresas principales.',
            ],
            screenshots: [
              {
                src: 'products/vigiliner/manual/super-admin/01-dashboard.jpg',
                width: 1568,
                height: 713,
                alt: 'Consola Ejecutiva del Super Admin con KPIs globales y gráfica de crecimiento de la plataforma',
              },
            ],
          },
          {
            title: 'Mapa Global',
            description: [
              'Vista en tiempo real de todas las unidades de todas las empresas sobre el mapa, con el mismo panel lateral "Live Tracking" (unidades en operación) que usa el Admin de empresa en su Mapa General. Permite filtrar por empresa y por estado, y muestra cuántas unidades están en línea del total.',
            ],
            businessRules: [
              'El filtro de empresa afecta tanto los marcadores del mapa como los contadores del panel — no son dos vistas independientes.',
            ],
            screenshots: [
              {
                src: 'products/vigiliner/manual/super-admin/02-mapa-global.jpg',
                width: 1568,
                height: 713,
                alt: 'Mapa Global con las unidades de todas las empresas agrupadas por zona',
              },
            ],
          },
          {
            title: 'Empresas',
            description: [
              'Listado de las empresas clientes (tenants) de la plataforma, con su plan, cantidad de unidades y usuarios, administradores, fecha de alta y estado. Desde aquí se da de alta una nueva empresa con el botón "Nueva empresa".',
            ],
            screenshots: [
              {
                src: 'products/vigiliner/manual/super-admin/03-empresas.jpg',
                width: 1568,
                height: 713,
                alt: 'Listado de empresas clientes con plan, unidades, usuarios y estado',
              },
            ],
          },
          {
            title: 'Usuarios de la plataforma',
            description: [
              'Muestra todos los usuarios de todas las empresas, con su rol y la empresa a la que pertenecen. El botón "Invitar usuario" envía un correo para que la persona invitada defina su propia contraseña.',
              'Cada usuario tiene un menú de acciones: ver detalle, editar, asignar qué unidades puede visualizar, desactivar su acceso temporalmente o revocarlo por completo.',
            ],
            businessRules: [
              'Desactivar el acceso de un usuario cierra su sesión automáticamente la próxima vez que intente usar la app, con un aviso — no hace falta esperar a que expire el token.',
              'Si el enlace de invitación no funciona ("Auth session missing" o similar), probablemente un escáner de seguridad del correo lo abrió primero (frecuente en Outlook/Hotmail) y lo invalidó — pídele a la persona que use "¿Olvidaste tu contraseña?" en el login para generar uno nuevo.',
            ],
            screenshots: [
              {
                src: 'products/vigiliner/manual/super-admin/04-usuarios.jpg',
                width: 1568,
                height: 713,
                alt: 'Listado de usuarios de la plataforma con su rol y empresa',
              },
              {
                src: 'products/vigiliner/manual/super-admin/05-usuarios-menu-acciones.jpg',
                width: 1568,
                height: 713,
                alt: 'Menú de acciones sobre un usuario: ver detalle, editar, asignar unidades visibles, desactivar o revocar acceso',
              },
            ],
          },
          {
            title: 'Unidades (flota global)',
            description: [
              'Listado consolidado de la flota de todas las empresas: placa, tipo, modelo, empresa propietaria, empresa operadora (si aplica), conductor asignado, estatus operativo, estado del GPS y última señal recibida.',
              'Al hacer clic en una unidad se abre un panel de detalle con tres pestañas — General, GPS y Teléfono — donde se gestionan sus datos, el dispositivo GPS vinculado (modelo, IMEI, SIM) y la posibilidad de asignar o quitar el GPS.',
            ],
            businessRules: [
              'Eliminar una unidad es un soft delete: deja de listarse pero su historial se conserva, y libera automáticamente el GPS y el conductor que tuviera asignados.',
            ],
            screenshots: [
              {
                src: 'products/vigiliner/manual/super-admin/06-unidades.jpg',
                width: 1568,
                height: 713,
                alt: 'Listado global de unidades de todas las empresas',
              },
              {
                src: 'products/vigiliner/manual/super-admin/07-unidad-detalle-general.jpg',
                width: 1568,
                height: 713,
                alt: 'Panel de detalle de una unidad, pestaña General: marca, modelo, año, placa y conductor',
              },
              {
                src: 'products/vigiliner/manual/super-admin/08-unidad-detalle-gps.jpg',
                width: 1568,
                height: 713,
                alt: 'Panel de detalle de una unidad, pestaña GPS: dispositivo vinculado, modelo, IMEI y SIM',
              },
            ],
          },
          {
            title: 'Dispositivos GPS',
            description: [
              'Inventario de hardware rastreador (modelos Queclink): modelo, IMEI, línea SIM asociada, batería, y la unidad a la que está asignado cada dispositivo, o si está disponible para asignar.',
            ],
            screenshots: [
              {
                src: 'products/vigiliner/manual/super-admin/09-dispositivos-gps.jpg',
                width: 1483,
                height: 812,
                alt: 'Inventario de dispositivos GPS con su IMEI, teléfono, unidad asignada, batería y estado',
              },
            ],
          },
          {
            title: 'Teléfonos / SIM',
            description: [
              'Inventario de líneas telefónicas/SIM asignables a los dispositivos GPS, con su ICCID, compañía y plan.',
            ],
            businessRules: ['Un teléfono/SIM es reutilizable: se puede desvincular de un GPS y reasignar a otro más adelante.'],
            screenshots: [
              {
                src: 'products/vigiliner/manual/super-admin/10-telefonos.jpg',
                width: 1483,
                height: 812,
                alt: 'Inventario de teléfonos y líneas SIM asignables a dispositivos GPS',
              },
            ],
          },
          {
            title: 'Reportes',
            description: [
              'Velocidad y detención: el mismo reporte que usan Admin de empresa y Monitorista, pero con selector de unidades de todas las empresas.',
              'Historial de comandos: auditoría de las acciones remotas enviadas a cualquier unidad — qué comando, cuándo, si el dispositivo lo confirmó, y qué operador lo envió.',
            ],
            screenshots: [
              {
                src: 'products/vigiliner/manual/super-admin/12-reportes-velocidad-datos.jpg',
                width: 1536,
                height: 784,
                alt: 'Reporte de velocidad y detención con KPIs (distancia, paradas, velocidad máxima y promedio)',
              },
              {
                src: 'products/vigiliner/manual/super-admin/13-historial-comandos.jpg',
                width: 1536,
                height: 784,
                alt: 'Historial de comandos remotos por unidad y rango de fechas',
              },
            ],
          },
          {
            title: 'Configuración (catálogos)',
            description: [
              'Tres catálogos alimentan los selectores del resto de la app: Tipos de unidad (con su prefijo de nomenclatura, ej. "ECO"), Condiciones de unidad (estatus operativo) y Modelos GPS (marca + modelo). Cada fila muestra cuántas unidades o dispositivos usan ese valor.',
            ],
            businessRules: [
              'El valor de un catálogo no se puede editar después de creado — solo desactivar o eliminar si ya no está en uso. Esto evita romper referencias históricas de unidades/dispositivos que ya lo usan.',
            ],
            screenshots: [
              {
                src: 'products/vigiliner/manual/super-admin/14-config-tipos-unidad.jpg',
                width: 1536,
                height: 784,
                alt: 'Catálogo de tipos de unidad con etiqueta, prefijo y cantidad de unidades',
              },
              {
                src: 'products/vigiliner/manual/super-admin/15-config-condiciones-unidad.jpg',
                width: 1536,
                height: 784,
                alt: 'Catálogo de condiciones/estatus operativo de unidad',
              },
              {
                src: 'products/vigiliner/manual/super-admin/16-config-modelos-gps.jpg',
                width: 1536,
                height: 784,
                alt: 'Catálogo de modelos de dispositivo GPS por marca',
              },
            ],
          },
        ],
      },
      {
        id: 'company-admin',
        name: 'Admin de empresa',
        summary:
          'Administra la flota, los conductores y los usuarios de su propia empresa. Es el rol de uso diario más común: accede desde /app tras iniciar sesión con una cuenta con rol Admin de empresa.',
        steps: [
          {
            title: 'Panel principal (Dashboard)',
            description: [
              'Resumen operativo de la flota de la empresa: unidades totales, unidades en línea, conductores, kilómetros estimados recorridos hoy y alertas activas.',
              'Incluye la distribución de actividad de la flota (activas/en ruta, en reposo, offline), el listado de unidades activas en ese momento y las alertas recientes.',
            ],
            screenshots: [
              {
                src: 'products/vigiliner/manual/company-admin/01-dashboard.jpg',
                width: 1568,
                height: 713,
                alt: 'Dashboard del Admin de empresa con KPIs de la flota y actividad reciente',
              },
            ],
          },
          {
            title: 'Mapa General',
            description: [
              'Rastreo en tiempo real de las unidades de la empresa. La lista lateral "Live Tracking" es buscable por unidad, placa o conductor y muestra el estado (activa/inactiva/offline) y la velocidad de cada una.',
              'Al seleccionar una unidad se abre un panel de detalle con velocidad, señal, dirección aproximada (geocodificación inversa de la posición), Street View, conductor, tipo de unidad, última señal, kilometraje, latitud/longitud y rumbo.',
            ],
            businessRules: [
              'Una unidad muestra el badge "Exceso de velocidad" cuando supera el límite configurado, y "Motor bloqueado" cuando el comando de apagado de motor sigue activo.',
              'El buscador de la lista puede ignorar el filtro de estado activo para permitir una búsqueda global — si no encuentras una unidad, revisa que no esté oculta por el filtro de estado.',
            ],
            screenshots: [
              {
                src: 'products/vigiliner/manual/company-admin/02-mapa-general.jpg',
                width: 1512,
                height: 772,
                alt: 'Mapa General con el rastreo en tiempo real de las unidades de la empresa',
              },
              {
                src: 'products/vigiliner/manual/company-admin/03-mapa-detalle-unidad.jpg',
                width: 1568,
                height: 713,
                alt: 'Panel de detalle de una unidad en el mapa con velocidad, batería, señal y Street View',
              },
            ],
          },
          {
            title: 'Acciones remotas sobre una unidad',
            description: [
              'Desde el panel de detalle de una unidad se pueden enviar comandos directos a su dispositivo GPS: Desactivar/Activar unidad, Activar alarma, Solicitar posición y Reiniciar dispositivo.',
              'Cada comando pasa por los estados "Enviando" → "En ruta" → "Confirmado" / "Falló" / "Sin confirmar", y el resultado aparece como notificación (toast) y como una insignia temporal sobre el botón.',
            ],
            businessRules: [
              'El botón de encendido es un interruptor: muestra "Desactivar Unidad" o "Activar Unidad" según lo que reporta ahora mismo el GPS (telemetría real), no solo el último comando enviado desde la app.',
              'Si intentas desactivar una unidad que está en movimiento, el sistema pide una confirmación reforzada (escribir para confirmar) y advierte del riesgo de accidente antes de continuar.',
            ],
            screenshots: [
              {
                src: 'products/vigiliner/manual/monitor/03-acciones-remotas.jpg',
                width: 1568,
                height: 713,
                alt: 'Sección Acciones remotas del panel de detalle: desactivar unidad, activar alarma, solicitar posición y reiniciar dispositivo',
              },
            ],
          },
          {
            title: 'Unidades',
            description: [
              'Listado y gestión de la flota propia de la empresa: placa, tipo, modelo, conductor asignado, estatus operativo, estado del GPS y última señal. Las columnas admiten orden por cualquier encabezado y paginan de 10 en 10.',
            ],
            screenshots: [
              {
                src: 'products/vigiliner/manual/company-admin/04-unidades.jpg',
                width: 1568,
                height: 713,
                alt: 'Listado de unidades de la empresa',
              },
            ],
          },
          {
            title: 'Conductores',
            description: [
              'Los conductores se dividen en dos listados independientes: Internos (choferes empleados de la flota) y Externos (terceros/subcontratados), con los mismos campos y controles en ambos.',
            ],
            screenshots: [
              {
                src: 'products/vigiliner/manual/company-admin/05-conductores.jpg',
                width: 1483,
                height: 812,
                alt: 'Listado de conductores internos con licencia, vigencia y unidad asignada',
              },
              {
                src: 'products/vigiliner/manual/company-admin/05b-conductores-externos.jpg',
                width: 1512,
                height: 772,
                alt: 'Listado vacío de conductores externos, con botón para dar de alta el primero',
              },
            ],
          },
          {
            title: 'Usuarios',
            description: [
              'Gestión de los accesos de la empresa: invitar nuevos usuarios y asignarles un rol — Admin de empresa, Monitorista o Cliente visualización. La persona invitada recibe un correo para definir su propia contraseña.',
            ],
            businessRules: [
              'Si el enlace de invitación falla, es probable que un escáner de seguridad del correo (Outlook/Hotmail) lo haya abierto primero e invalidado — usa "¿Olvidaste tu contraseña?" para generar uno nuevo en vez de reenviar la misma invitación.',
            ],
            screenshots: [
              {
                src: 'products/vigiliner/manual/company-admin/06-usuarios.jpg',
                width: 1568,
                height: 713,
                alt: 'Listado de usuarios de la empresa con su rol',
              },
            ],
          },
          {
            title: 'Geocercas',
            description: [
              'Editor de zonas geográficas: se dibuja un polígono directamente sobre el mapa, se le da nombre, color y se activan alertas de entrada y/o salida. Desde el detalle de cada geocerca se asignan las unidades que se van a vigilar en esa zona.',
            ],
            businessRules: [
              'El polígono necesita al menos 3 puntos y sus bordes no pueden cruzarse entre sí — la app rechaza el guardado con un mensaje de error si el trazo es inválido.',
            ],
            screenshots: [
              {
                src: 'products/vigiliner/manual/company-admin/07-geocercas.jpg',
                width: 1512,
                height: 772,
                alt: 'Listado de geocercas con el mapa de la empresa',
              },
              {
                src: 'products/vigiliner/manual/company-admin/07b-geocercas-detalle.jpg',
                width: 1512,
                height: 772,
                alt: 'Detalle de una geocerca con su polígono dibujado y la unidad asignada',
              },
            ],
          },
          {
            title: 'Incidencias',
            description: [
              'Registro de eventos operativos de la flota: siniestro, exceso de velocidad, falla mecánica, robo u otro, con severidad (baja/media/alta/crítica), estado (abierta/en proceso/cerrada), evidencia adjunta y exportación a CSV.',
            ],
            businessRules: [
              'Admin de empresa y Super Admin tienen CRUD completo. El Monitorista puede crear incidencias y editar únicamente las que él mismo registró — no puede eliminarlas. El rol Cliente visualización no tiene acceso a este módulo.',
            ],
            screenshots: [
              {
                src: 'products/vigiliner/manual/company-admin/08-incidencias.jpg',
                width: 1568,
                height: 713,
                alt: 'Módulo de Incidencias con filtros por tipo, severidad y estado',
              },
            ],
          },
          {
            title: 'Alertas',
            description: [
              'Bandeja de eventos críticos detectados automáticamente sobre la flota de la empresa, con severidad y unidad asociada.',
            ],
            screenshots: [
              {
                src: 'products/vigiliner/manual/company-admin/09-alertas.jpg',
                width: 1568,
                height: 713,
                alt: 'Bandeja de alertas críticas detectadas automáticamente',
              },
            ],
          },
          {
            title: 'Reportes — Velocidad y detención',
            description: [
              'Selecciona una unidad y un rango de fecha/hora (presets de 3 h, 24 h, 7 días o 1 mes, o un rango personalizado) y genera un reporte con distancia recorrida, número de paradas, tiempo detenido, velocidad máxima y promedio, más una gráfica de velocidad donde las paradas se resaltan como zonas sombreadas. El reporte se puede exportar a PDF.',
            ],
            businessRules: ['Una sola consulta cubre como máximo 30 días; si pides un rango mayor, la app lo recorta automáticamente y lo avisa.'],
            screenshots: [
              {
                src: 'products/vigiliner/manual/company-admin/10-reportes.jpg',
                width: 1483,
                height: 812,
                alt: 'Reporte de velocidad y detención con gráfica y zonas de paradas resaltadas',
              },
              {
                src: 'products/vigiliner/manual/company-admin/10b-reportes-kpis.jpg',
                width: 1483,
                height: 812,
                alt: 'KPIs del reporte: distancia recorrida, paradas, tiempo detenido, velocidad máxima y promedio',
              },
            ],
          },
        ],
      },
      {
        id: 'monitor',
        name: 'Monitorista',
        summary:
          'Rol operativo de seguimiento dentro de una empresa: ve el Mapa General, las Unidades (solo lectura) y los Reportes de velocidad y detención, pero no tiene Dashboard ni acceso a Conductores, Usuarios, Geocercas, Incidencias o Alertas.',
        steps: [
          {
            title: 'Mapa General',
            description: [
              'Es la sección donde entra por defecto al iniciar sesión: rastreo en tiempo real de las unidades de la empresa, con la misma lista buscable por unidad, placa o conductor que usa el Admin de empresa.',
            ],
            pendingScreenshots: true,
          },
          {
            title: 'Unidades (solo lectura)',
            description: [
              'Mismo listado que ve el Admin de empresa (placa, tipo, modelo, conductor, estatus operativo, estado GPS, última señal), pero sin botones de crear, editar ni eliminar.',
            ],
            pendingScreenshots: true,
          },
          {
            title: 'Detalle de una unidad',
            description: [
              'Al seleccionar una unidad se abre el mismo panel de detalle que ve el Admin de empresa: velocidad, señal, dirección aproximada, Street View, conductor, tipo, última señal, kilometraje y posición.',
            ],
            screenshots: [
              {
                src: 'products/vigiliner/manual/monitor/02-detalle-unidad.jpg',
                width: 1568,
                height: 713,
                alt: 'Panel de detalle de una unidad visto por el Monitorista, con velocidad, batería y señal',
              },
            ],
          },
          {
            title: 'Acciones remotas sobre una unidad',
            description: [
              'A diferencia de lo que sugiere su nombre, el rol Monitorista no es puramente de solo lectura: desde el panel de detalle puede enviar comandos remotos al dispositivo GPS de la unidad — desactivar/activar la unidad, activar la alarma, solicitar posición inmediata o reiniciar el dispositivo.',
            ],
            screenshots: [
              {
                src: 'products/vigiliner/manual/monitor/03-acciones-remotas.jpg',
                width: 1568,
                height: 713,
                alt: 'Sección Acciones remotas del panel de detalle: desactivar unidad, activar alarma, solicitar posición y reiniciar dispositivo',
              },
            ],
          },
          {
            title: 'Reportes — Velocidad y detención',
            description: [
              'Mismo reporte de velocidad y paradas que usa el Admin de empresa, con el mismo selector de unidad y rango de fechas.',
            ],
            pendingScreenshots: true,
          },
        ],
      },
      {
        id: 'viewer',
        name: 'Cliente visualización',
        summary:
          'Rol de solo lectura puro: ve únicamente el Mapa General de su empresa. No tiene ningún otro módulo en el menú y, a diferencia del Monitorista, no puede enviar comandos remotos aunque abra el detalle de una unidad.',
        steps: [
          {
            title: 'Mapa General (solo lectura)',
            description: [
              'Única sección disponible para este rol: rastreo en tiempo real de las unidades de la empresa y su panel de detalle, sin la sección "Acciones remotas" — el botón de comandos ni siquiera se muestra para este rol.',
            ],
            pendingScreenshots: true,
          },
        ],
      },
    ],
    manualGuides: [
      {
        id: 'alta-empresa',
        title: 'Dar de alta una empresa',
        role: 'Super Administrador',
        summary: 'Crear una nueva empresa cliente (tenant) en la plataforma.',
        steps: [
          {
            title: 'Abrir el formulario',
            description:
              'En Empresas (o desde el botón "Nueva empresa" del Dashboard), haz clic en "Nueva empresa". Solo se pide el nombre; el tipo de cuenta y el logo se pueden completar ahí mismo o después.',
            screenshot: {
              src: 'products/vigiliner/manual/crud/empresa-nueva.jpg',
              width: 1483,
              height: 812,
              alt: 'Formulario Nueva empresa: logo, nombre y tipo de cuenta',
            },
          },
          {
            title: 'Completar y crear',
            description:
              'Escribe el nombre de la empresa, elige el tipo de cuenta y presiona "Crear empresa". A partir de ahí ya puedes invitar usuarios y dar de alta unidades para esa empresa.',
          },
        ],
      },
      {
        id: 'alta-usuario',
        title: 'Invitar un usuario',
        role: 'Super Administrador y Admin de empresa',
        summary: 'Dar acceso a una persona nueva asignándole un rol.',
        steps: [
          {
            title: 'Abrir "Invitar usuario"',
            description:
              'Desde Usuarios, presiona "Invitar usuario". Completa nombre completo, correo y selecciona el rol (Admin de empresa, Monitorista o Cliente visualización; el Super Admin puede además crear otro Super Admin).',
          },
          {
            title: 'Enviar la invitación',
            description:
              'Al confirmar, Vigiliner envía un correo a esa dirección para que la persona defina su propia contraseña — tú nunca ves ni defines esa contraseña.',
          },
          {
            title: 'Si el enlace no funciona',
            description:
              'Un escáner de seguridad del correo (frecuente en Outlook/Hotmail) puede abrir el enlace antes que la persona y dejarlo inválido. En ese caso no reenvíes la misma invitación — pide que use "¿Olvidaste tu contraseña?" en la pantalla de inicio de sesión, que genera un enlace nuevo aunque la cuenta ya exista.',
          },
        ],
      },
      {
        id: 'alta-unidad',
        title: 'Dar de alta una unidad',
        role: 'Super Administrador',
        summary: 'Registrar un vehículo y, opcionalmente, vincularle GPS y teléfono en el mismo asistente.',
        steps: [
          {
            title: 'Paso 1 — Datos básicos',
            description:
              'En Unidades, presiona "Nueva unidad". Solo el nombre es obligatorio — el resto se puede completar más adelante. Elige la empresa propietaria y, si otra empresa va a operar la unidad en préstamo o arrendamiento, indica la "Empresa operadora". Completa tipo, marca, modelo, año, placa y estatus operativo, y presiona "Crear y continuar".',
            screenshot: {
              src: 'products/vigiliner/manual/crud/unidad-paso1-datos.jpg',
              width: 1483,
              height: 812,
              alt: 'Asistente de nueva unidad, paso 1: datos básicos y empresa operadora',
            },
          },
          {
            title: 'Paso 2 — Vincular GPS',
            description:
              'Elige entre "GPS existente" (seleccionar un dispositivo disponible del inventario) o "GPS nuevo" (dar de alta un dispositivo con su modelo e IMEI en el momento). También puedes presionar "Omitir por ahora" y vincularlo después desde la pestaña GPS del detalle de la unidad.',
            screenshot: {
              src: 'products/vigiliner/manual/crud/unidad-paso2-gps-existente.jpg',
              width: 1483,
              height: 812,
              alt: 'Asistente de nueva unidad, paso 2: elegir un GPS existente del inventario',
            },
          },
          {
            title: 'Paso 3 — Vincular teléfono/SIM',
            description:
              'Solo disponible si ya vinculaste un GPS en el paso anterior — el teléfono/SIM siempre se asigna a través de un dispositivo GPS, nunca directo a la unidad.',
            screenshot: {
              src: 'products/vigiliner/manual/crud/unidad-paso3-telefono.jpg',
              width: 1483,
              height: 812,
              alt: 'Asistente de nueva unidad, paso 3: aviso de que primero hay que vincular un GPS',
            },
          },
        ],
      },
      {
        id: 'alta-gps',
        title: 'Dar de alta un dispositivo GPS',
        role: 'Super Administrador',
        summary: 'Registrar un rastreador GPS en el inventario, con o sin SIM.',
        steps: [
          {
            title: 'Completar el formulario',
            description:
              'En Dispositivos GPS, presiona "Nuevo dispositivo". Selecciona el modelo (catálogo de Configuración) y escribe el IMEI. Puedes dejarlo sin SIM y asignarla más adelante — la SIM (teléfono) es reutilizable entre dispositivos.',
            screenshot: {
              src: 'products/vigiliner/manual/crud/gps-nuevo.jpg',
              width: 1483,
              height: 812,
              alt: 'Formulario Nuevo dispositivo GPS: modelo, IMEI y teléfono/SIM opcional',
            },
          },
        ],
      },
      {
        id: 'alta-telefono',
        title: 'Dar de alta un teléfono / línea SIM',
        role: 'Super Administrador',
        summary: 'Registrar una línea para asignarla luego a un dispositivo GPS.',
        steps: [
          {
            title: 'Completar el formulario',
            description:
              'En Teléfonos, presiona "Nuevo teléfono". Completa número, ICCID de la SIM, compañía, plan y estado. La SIM queda disponible para asignarse a cualquier dispositivo GPS.',
            screenshot: {
              src: 'products/vigiliner/manual/crud/telefono-nuevo.jpg',
              width: 1483,
              height: 812,
              alt: 'Formulario Nuevo teléfono: número, ICCID, compañía, estado y plan',
            },
          },
        ],
      },
      {
        id: 'alta-conductor',
        title: 'Dar de alta un conductor',
        role: 'Admin de empresa',
        summary: 'Registrar un chofer interno o externo y, si corresponde, asignarle una unidad.',
        steps: [
          {
            title: 'Elegir Internos o Externos',
            description:
              'Ve a Conductores → Internos (empleados de la flota) o Externos (terceros/subcontratados) según corresponda, y presiona "Nuevo conductor".',
          },
          {
            title: 'Completar el formulario',
            description:
              'Foto opcional, nombre completo (único campo obligatorio), teléfono, email, licencia y su fecha de vencimiento, unidad a asignar y notas. El interruptor "Activo" controla si puede operar unidades.',
            screenshot: {
              src: 'products/vigiliner/manual/crud/conductor-nuevo.jpg',
              width: 1483,
              height: 812,
              alt: 'Formulario Nuevo conductor: foto, nombre, teléfono, licencia y unidad asignada',
            },
          },
        ],
      },
      {
        id: 'alta-geocerca',
        title: 'Crear una geocerca',
        role: 'Admin de empresa',
        summary: 'Definir una zona en el mapa y configurar sus alertas.',
        steps: [
          {
            title: 'Dibujar el polígono',
            description:
              'En Geocercas, presiona "Nueva". El mapa entra en modo dibujo: haz clic para ir añadiendo puntos y doble clic para cerrar el polígono (mínimo 3 puntos, y los bordes no pueden cruzarse entre sí).',
            screenshot: {
              src: 'products/vigiliner/manual/crud/geocerca-nueva.jpg',
              width: 1483,
              height: 812,
              alt: 'Modo de dibujo de una nueva geocerca, con el panel de nombre, color y alertas',
            },
          },
          {
            title: 'Configurar y guardar',
            description:
              'Dale un nombre, color y descripción opcional, activa "Alertar al entrar" y/o "Alertar al salir" según lo que quieras vigilar, y guarda. Después podrás asignarle las unidades a monitorear desde su detalle.',
          },
        ],
      },
      {
        id: 'alta-incidencia',
        title: 'Registrar una incidencia',
        role: 'Admin de empresa (Monitorista puede crear y editar las propias)',
        summary: 'Documentar un evento operativo de la flota.',
        steps: [
          {
            title: 'Completar el formulario',
            description:
              'En Incidencias, presiona "Registrar incidencia". El título es obligatorio; elige tipo (siniestro, exceso de velocidad, falla mecánica, robo, otro), severidad, unidad y conductor involucrados, estado y una descripción. La evidencia (fotos/documentos) se adjunta desde el mismo formulario.',
            screenshot: {
              src: 'products/vigiliner/manual/crud/incidencia-nueva.jpg',
              width: 1483,
              height: 812,
              alt: 'Formulario Registrar incidencia: título, tipo, severidad, unidad, conductor y estado',
            },
          },
        ],
      },
    ],
  },
];

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly products = signal<Product[]>(PRODUCTS);

  readonly allProducts = this.products.asReadonly();

  findBySlug(slug: string): Product | undefined {
    return this.products().find((product) => product.slug === slug);
  }
}
