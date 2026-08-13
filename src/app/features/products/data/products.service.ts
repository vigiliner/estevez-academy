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
