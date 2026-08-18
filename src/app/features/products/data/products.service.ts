import { Injectable, signal } from '@angular/core';
import { Product } from '../../../shared/models/product.model';

const PRODUCTS: Product[] = [
  {
    slug: 'vigiliner',
    name: 'Vigiliner',
    shortDescription: 'Documentación funcional y técnica de Vigiliner.',
    status: 'en-progreso',
    logoUrl: 'products/vigiliner.png',
    logoWidth: 572,
    logoHeight: 375,
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
          'Super Administrador: administra la plataforma completa — todas las empresas clientes, usuarios globales, inventario de hardware GPS y líneas SIM, y el mapa global de todas las unidades.',
          'Admin de empresa: administra la flota, los conductores y los usuarios de su propia empresa.',
          'Monitorista: rol operativo de seguimiento dentro de una empresa, sin permisos administrativos plenos.',
          'Cliente visualización: rol de solo lectura para consultar la flota de la empresa.',
        ],
      },
      {
        title: 'Módulos del panel de empresa',
        items: [
          'Dashboard: resumen operativo — unidades totales, en línea, conductores, km recorridos hoy y alertas, más actividad reciente de la flota.',
          'Mapa General: rastreo en tiempo real de las unidades en mapa, con lista filtrable por placa o conductor y panel de detalle por unidad (velocidad, batería, señal, datos del vehículo, posición y rumbo).',
          'Unidades: listado y gestión de la flota (placa, tipo, modelo, conductor asignado, estatus operativo, estado GPS, última señal).',
          'Conductores: alta y gestión de choferes (foto, contacto, licencia y vigencia, unidad asignada, notas, activo/inactivo).',
          'Usuarios: invitación y gestión de accesos de la empresa por rol.',
          'Geocercas: definición de zonas geográficas para alertas de entrada/salida de unidades.',
          'Incidencias: registro manual de eventos operativos (siniestro, exceso de velocidad, falla mecánica, robo, otro) con severidad y estado.',
          'Alertas: bandeja de eventos críticos detectados automáticamente sobre la flota.',
          'Reportes: módulo en desarrollo — próximamente reportes de recorridos, eventos, geocercas y desempeño por unidad o conductor.',
        ],
      },
      {
        title: 'Acciones remotas sobre una unidad',
        paragraphs: [
          'Desde el detalle de una unidad en el Mapa General se pueden enviar comandos directos al dispositivo GPS instalado en el vehículo:',
        ],
        items: ['Desactivar unidad', 'Activar alarma', 'Solicitar posición', 'Reiniciar dispositivo'],
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
        ],
      },
    ],
    technicalDoc: [
      {
        title: 'Arquitectura general',
        paragraphs: [
          'Aplicación web (SPA) desplegada en Cloudflare Workers, con un backend/API propio que alimenta el frontend y recibe telemetría de los dispositivos GPS instalados en las unidades.',
        ],
      },
      {
        title: 'Multi-tenancy y roles (RBAC)',
        paragraphs: [
          'El modelo de datos aísla la información por empresa (tenant): unidades, conductores y usuarios pertenecen a una sola empresa, salvo para el rol Super Admin, que tiene visión y gestión cross-tenant.',
        ],
        items: ['super_admin (plataforma)', 'admin_empresa (por tenant)', 'monitorista (por tenant)', 'cliente_visualizacion (por tenant, solo lectura)'],
      },
      {
        title: 'Entidades de datos principales',
        items: [
          'Empresa (tenant): nombre, plan (ej. Enterprise), estado, fecha de creación, conteo de unidades/usuarios/admins.',
          'Usuario: nombre, correo, rol, empresa asociada, estado.',
          'Unidad (vehículo): nombre, placa, tipo, marca, modelo, año, número de serie, kilometraje, conductor asignado, estatus operativo, estado GPS, última señal, posición (lat/long), rumbo, velocidad, batería, señal.',
          'Conductor: nombre, foto, teléfono, email, licencia y vigencia, unidad asignada, notas, activo.',
          'Dispositivo GPS: marca/modelo (ej. Queclink GV55W), IMEI, línea SIM asociada, estado (asignado/disponible).',
          'Teléfono/SIM: número, operador, estado, dispositivo asociado.',
          'Geocerca: zona geográfica asignada a unidades para alertas de entrada/salida.',
          'Incidencia: título, tipo, severidad, unidad, conductor, estado, descripción, evidencia.',
          'Alerta: evento crítico generado automáticamente por el sistema, asociado a una unidad.',
        ],
      },
      {
        title: 'Integración con hardware GPS',
        paragraphs: [
          'Cada unidad se vincula a un dispositivo GPS físico (se observó el modelo Queclink GV55W) con línea SIM propia. El backend recibe telemetría (posición, velocidad, batería, señal) y expone comandos remotos hacia el dispositivo: desactivar unidad, activar alarma, solicitar posición y reiniciar.',
        ],
      },
      {
        title: 'Tiempo real',
        paragraphs: [
          'El Mapa General y el Mapa Global muestran actualización en vivo ("LIVE") de posición y estado de las unidades, lo que implica un canal de datos en tiempo real entre backend y frontend.',
        ],
      },
      {
        title: 'Estado actual del MVP',
        items: [
          'Completos y en uso: autenticación, dashboard, mapa en tiempo real, unidades, conductores, usuarios/roles, panel de Super Admin (empresas, usuarios, unidades, GPS, teléfonos, mapa global).',
          'Parciales: Geocercas e Incidencias/Alertas — UI funcional, sin datos de prueba cargados.',
          'Pendiente: Reportes, marcado explícitamente como "Próximamente" en producción.',
        ],
      },
    ],
    userManual: [
      {
        id: 'super-admin',
        name: 'Super Administrador',
        summary:
          'Gestiona la plataforma completa: todas las empresas clientes, sus usuarios, la flota consolidada y el inventario de hardware (GPS y SIM). Accede desde /super tras iniciar sesión con una cuenta con rol Super Admin.',
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
              'Vista en tiempo real de todas las unidades de todas las empresas sobre el mapa, agrupadas por cercanía. Permite filtrar por empresa y por estado, y muestra cuántas unidades están en línea del total.',
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
              'Listado consolidado de la flota de todas las empresas: placa, tipo, modelo, conductor asignado, nivel de batería, estatus operativo, estado del GPS y última señal recibida.',
              'Al hacer clic en una unidad se abre un panel de detalle con tres pestañas — General, GPS y Teléfono — donde se gestionan sus datos, el dispositivo GPS vinculado (modelo, IMEI, SIM) y la posibilidad de asignar o quitar el GPS.',
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
              'Inventario de hardware rastreador (por ejemplo, Queclink GV55W): IMEI, línea SIM asociada y la unidad a la que está asignado cada dispositivo, o si está disponible para asignar.',
            ],
            screenshots: [
              {
                src: 'products/vigiliner/manual/super-admin/09-dispositivos-gps.jpg',
                width: 1568,
                height: 713,
                alt: 'Inventario de dispositivos GPS con su IMEI, SIM y unidad asignada',
              },
            ],
          },
          {
            title: 'Teléfonos / SIM',
            description: [
              'Inventario de líneas telefónicas/SIM asignables a los dispositivos GPS, con su ICCID, operador y plan.',
            ],
            screenshots: [
              {
                src: 'products/vigiliner/manual/super-admin/10-telefonos.jpg',
                width: 1568,
                height: 713,
                alt: 'Inventario de teléfonos y líneas SIM asignables a dispositivos GPS',
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
              'Rastreo en tiempo real de las unidades de la empresa. La lista lateral es buscable por unidad, placa o conductor y muestra el estado (activa/inactiva) y la velocidad de cada una.',
              'Al seleccionar una unidad se abre un panel de detalle con velocidad, batería, señal, vista de calle (Street View), conductor, tipo de unidad, última señal, kilometraje y su posición y rumbo actuales.',
            ],
            screenshots: [
              {
                src: 'products/vigiliner/manual/company-admin/02-mapa-general.jpg',
                width: 1568,
                height: 713,
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
            title: 'Unidades',
            description: [
              'Listado y gestión de la flota propia de la empresa: placa, tipo, modelo, conductor asignado, estatus operativo, estado del GPS y última señal.',
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
              'Alta y gestión de los choferes de la empresa: contacto, número de licencia y su vigencia, unidad asignada y estado activo/inactivo.',
            ],
            screenshots: [
              {
                src: 'products/vigiliner/manual/company-admin/05-conductores.jpg',
                width: 1568,
                height: 713,
                alt: 'Listado de conductores con licencia, vigencia y unidad asignada',
              },
            ],
          },
          {
            title: 'Usuarios',
            description: [
              'Gestión de los accesos de la empresa: invitar nuevos usuarios y asignarles un rol — Admin de empresa, Monitorista o Cliente visualización. La persona invitada recibe un correo para definir su propia contraseña.',
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
              'Definición de zonas geográficas sobre el mapa para generar alertas automáticas cuando una unidad entra o sale de ellas.',
            ],
            screenshots: [
              {
                src: 'products/vigiliner/manual/company-admin/07-geocercas.jpg',
                width: 1568,
                height: 713,
                alt: 'Módulo de Geocercas para definir zonas de alerta de entrada y salida',
              },
            ],
          },
          {
            title: 'Incidencias',
            description: [
              'Registro manual de eventos operativos de la flota (siniestro, exceso de velocidad, falla mecánica, robo, otro), con severidad y estado de seguimiento.',
            ],
            screenshots: [
              {
                src: 'products/vigiliner/manual/company-admin/08-incidencias.jpg',
                width: 1568,
                height: 713,
                alt: 'Módulo de Incidencias para el registro manual de eventos operativos',
              },
            ],
          },
          {
            title: 'Alertas',
            description: [
              'Bandeja de eventos críticos detectados automáticamente sobre la flota de la empresa.',
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
            title: 'Reportes',
            description: [
              'Módulo marcado como "Próximamente": generará reportes de recorridos, eventos, geocercas y desempeño por unidad o conductor.',
            ],
            screenshots: [
              {
                src: 'products/vigiliner/manual/company-admin/10-reportes.jpg',
                width: 1568,
                height: 713,
                alt: 'Módulo de Reportes marcado como próximamente disponible',
              },
            ],
          },
        ],
      },
      {
        id: 'monitor',
        name: 'Monitorista',
        summary:
          'Rol operativo de seguimiento dentro de una empresa, sin acceso a los módulos de gestión (Unidades, Conductores, Usuarios, Geocercas, Incidencias, Alertas, Reportes) ni al Dashboard. Al iniciar sesión entra directo al Mapa General, que es lo único que ve en su menú lateral.',
        steps: [
          {
            title: 'Mapa General',
            description: [
              'Es la única sección visible para este rol: rastreo en tiempo real de las unidades de la empresa, con la misma lista buscable por unidad, placa o conductor que usa el Admin de empresa.',
            ],
            screenshots: [
              {
                src: 'products/vigiliner/manual/monitor/01-mapa-general-nav.jpg',
                width: 1568,
                height: 713,
                alt: 'Menú lateral del Monitorista mostrando únicamente la opción Mapa General',
              },
            ],
          },
          {
            title: 'Detalle de una unidad',
            description: [
              'Al seleccionar una unidad se abre el mismo panel de detalle que ve el Admin de empresa: velocidad, batería, señal, vista de calle, conductor, tipo, última señal, kilometraje y posición.',
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
              'A diferencia de lo que sugiere su nombre, el rol Monitorista no es puramente de solo lectura: desde el panel de detalle puede enviar comandos remotos al dispositivo GPS de la unidad — desactivar la unidad, activar la alarma, solicitar posición inmediata o reiniciar el dispositivo.',
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
