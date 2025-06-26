import API from './axios.js';

// Servicios para clientes
export const clientService = {
  // Buscar cliente por RUT
  getClientByRut: async (rut) => {
    const response = await API.get(`/clients/rut/${rut}`);
    return response.data;
  },

  // Obtener todos los clientes
  getClients: async (params = {}) => {
    const response = await API.get('/clients', { params });
    return response.data;
  }
};

// Servicios para solicitudes
export const solicitudService = {
  // Crear nueva solicitud
  createSolicitud: async (data) => {
    const response = await API.post('/solicitudes', data);
    return response.data;
  },

  // Obtener todas las solicitudes
  getSolicitudes: async (params = {}) => {
    const response = await API.get('/solicitudes', { params });
    return response.data;
  },

  // Obtener solicitud por ID
  getSolicitudById: async (id) => {
    const response = await API.get(`/solicitudes/${id}`);
    return response.data;
  },

  // Aprobar solicitud
  aprobarSolicitud: async (id, observaciones = '') => {
    const response = await API.patch(`/solicitudes/${id}/aprobar`, { observaciones });
    return response.data;
  },

  // Rechazar solicitud
  rechazarSolicitud: async (id, observaciones = '') => {
    const response = await API.patch(`/solicitudes/${id}/rechazar`, { observaciones });
    return response.data;
  }
};

// Servicios para cotizaciones/solicitudes
export const cotizacionService = {
  // Crear nueva cotización
  createCotizacion: async (data) => {
    const response = await API.post('/cotizaciones', data);
    return response.data;
  },

  // Obtener todas las cotizaciones
  getCotizaciones: async (params = {}) => {
    const response = await API.get('/cotizaciones', { params });
    return response.data;
  },

  // Obtener cotización por ID
  getCotizacionById: async (id) => {
    const response = await API.get(`/cotizaciones/${id}`);
    return response.data;
  },

  // Actualizar estado de cotización
  updateCotizacionStatus: async (id, status) => {
    const response = await API.patch(`/cotizaciones/${id}/status`, { status });
    return response.data;
  }
}; 