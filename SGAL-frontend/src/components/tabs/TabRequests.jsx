import React, { useState, useEffect, useContext } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Search, Filter, FileText, Plus, Download, MoreHorizontal, AlertCircle } from 'lucide-react';
import { clientService, solicitudService } from '../../api/services.js';
import { UserContext } from '../../context/UserContext.jsx';
import { message } from 'antd';

const STATUS_COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#EF4444'];

const RequestForm = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    clientId: '',
    rutCliente: '',
    nombreContacto: '',
    telefono: '',
    email: '',
    nombreObra: '',
    ubicacionObra: '',
    descripcionServicios: '',
    prioridad: 'Media'
  });

  const [clientValidation, setClientValidation] = useState({
    exists: false,
    loading: false,
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validar cliente por RUT
  const validateClient = async (rut) => {
    if (!rut || rut.length < 8) {
      setClientValidation({ exists: false, loading: false, message: '' });
      return;
    }

    setClientValidation({ exists: false, loading: true, message: '' });
    
    try {
      const response = await clientService.getClientByRut(rut);
      setClientValidation({
        exists: response.exists,
        loading: false,
        message: response.message
      });
      
      if (response.exists) {
        setFormData(prev => ({ ...prev, clientId: response.client._id }));
      }
    } catch (error) {
      setClientValidation({
        exists: false,
        loading: false,
        message: error.response?.data?.message || 'Error al validar cliente'
      });
    }
  };

  // Validar campos requeridos
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.clientId) {
      newErrors.clientId = 'Debe seleccionar un cliente válido';
    }
    if (!formData.nombreContacto.trim()) {
      newErrors.nombreContacto = 'Nombre del contacto es requerido';
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'Teléfono es requerido';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email es requerido';
    }
    if (!formData.nombreObra.trim()) {
      newErrors.nombreObra = 'Nombre de la obra es requerido';
    }
    if (!formData.ubicacionObra.trim()) {
      newErrors.ubicacionObra = 'Ubicación de la obra es requerida';
    }
    if (!formData.descripcionServicios.trim()) {
      newErrors.descripcionServicios = 'Descripción de servicios es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verificar autenticación
    const user = localStorage.getItem('user');
    if (!user) {
      message.error('Debe iniciar sesión para crear solicitudes');
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    if (!clientValidation.exists) {
      setErrors({ clientId: 'El cliente no está registrado en el sistema' });
      return;
    }

    setLoading(true);

    try {
      const solicitudData = {
        clientId: formData.clientId,
        nombreContacto: formData.nombreContacto,
        telefono: formData.telefono,
        email: formData.email,
        nombreObra: formData.nombreObra,
        ubicacionObra: formData.ubicacionObra,
        descripcionServicios: formData.descripcionServicios,
        prioridad: formData.prioridad
      };

      console.log('Enviando solicitud:', solicitudData);
      const response = await solicitudService.createSolicitud(solicitudData);
      
      message.success('Solicitud registrada exitosamente');
      onSuccess();
      onCancel();
    } catch (error) {
      console.error('Error al crear solicitud:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      let errorMessage = 'Error al crear la solicitud';
      
      if (error.response?.status === 404) {
        errorMessage = 'Ruta no encontrada. Verifique que el backend esté funcionando.';
      } else if (error.response?.status === 403) {
        console.log('Error de autenticación, limpiando sesión');
        message.error('Sesión expirada. Por favor, inicie sesión nuevamente.');
        localStorage.removeItem('user');
        window.location.href = '/';
      } else if (error.response?.status === 401) {
        console.log('Error de autenticación, limpiando sesión');
        message.error('Sesión expirada. Por favor, inicie sesión nuevamente.');
        localStorage.removeItem('user');
        window.location.href = '/';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg mb-6">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Nueva Solicitud de Cotización</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* RUT del cliente */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              RUT del Cliente *
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.clientId ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formData.rutCliente}
                onChange={(e) => {
                  setFormData({...formData, rutCliente: e.target.value});
                  validateClient(e.target.value);
                }}
                placeholder="Ingrese RUT del cliente"
                required
              />
              {clientValidation.loading && (
                <div className="px-3 py-2 text-sm text-gray-500">Validando...</div>
              )}
            </div>
            {clientValidation.exists && (
              <div className="text-sm text-green-600">✓ Cliente encontrado</div>
            )}
            {clientValidation.message && !clientValidation.exists && (
              <div className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {clientValidation.message}
              </div>
            )}
            {errors.clientId && (
              <div className="text-sm text-red-600">{errors.clientId}</div>
            )}
          </div>

          {/* Nombre del contacto */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nombre del Contacto Solicitante *
            </label>
            <input 
              type="text" 
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.nombreContacto ? 'border-red-500' : 'border-gray-300'
              }`}
              value={formData.nombreContacto}
              onChange={(e) => setFormData({...formData, nombreContacto: e.target.value})}
              placeholder="Nombre completo del solicitante"
              required
            />
            {errors.nombreContacto && (
              <div className="text-sm text-red-600">{errors.nombreContacto}</div>
            )}
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Teléfono del Solicitante *
            </label>
            <input 
              type="tel" 
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.telefono ? 'border-red-500' : 'border-gray-300'
              }`}
              value={formData.telefono}
              onChange={(e) => setFormData({...formData, telefono: e.target.value})}
              placeholder="+56 9 1234 5678"
              required
            />
            {errors.telefono && (
              <div className="text-sm text-red-600">{errors.telefono}</div>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Correo del Solicitante *
            </label>
            <input 
              type="email" 
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="solicitante@empresa.com"
              required
            />
            {errors.email && (
              <div className="text-sm text-red-600">{errors.email}</div>
            )}
          </div>

          {/* Nombre de la obra */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nombre de la Obra o Proyecto *
            </label>
            <input 
              type="text" 
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.nombreObra ? 'border-red-500' : 'border-gray-300'
              }`}
              value={formData.nombreObra}
              onChange={(e) => setFormData({...formData, nombreObra: e.target.value})}
              placeholder="Ej: Edificio Corporativo Centro"
              required
            />
            {errors.nombreObra && (
              <div className="text-sm text-red-600">{errors.nombreObra}</div>
            )}
          </div>

          {/* Ubicación de la obra */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Ubicación de la Obra o Proyecto *
            </label>
            <input 
              type="text" 
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.ubicacionObra ? 'border-red-500' : 'border-gray-300'
              }`}
              value={formData.ubicacionObra}
              onChange={(e) => setFormData({...formData, ubicacionObra: e.target.value})}
              placeholder="Ej: Av. Providencia 1234, Santiago"
              required
            />
            {errors.ubicacionObra && (
              <div className="text-sm text-red-600">{errors.ubicacionObra}</div>
            )}
          </div>

          {/* Descripción de servicios */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Descripción de los Servicios de Laboratorio *
            </label>
            <textarea 
              className={`w-full px-3 py-2 border rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.descripcionServicios ? 'border-red-500' : 'border-gray-300'
              }`}
              value={formData.descripcionServicios}
              onChange={(e) => setFormData({...formData, descripcionServicios: e.target.value})}
              placeholder="Describa los servicios de laboratorio que desea solicitar..."
              required
            />
            {errors.descripcionServicios && (
              <div className="text-sm text-red-600">{errors.descripcionServicios}</div>
            )}
          </div>

          {/* Prioridad */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Prioridad
            </label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.prioridad}
              onChange={(e) => setFormData({...formData, prioridad: e.target.value})}
            >
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 text-white font-medium rounded-md transition-colors cursor-pointer ${
                loading 
                  ? 'bg-amber-400 cursor-not-allowed' 
                  : 'bg-amber-800 hover:bg-amber-900'
              }`}
              style={{ color: 'white' }}
            >
              {loading ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TabRequests = () => {
  const { user } = useContext(UserContext);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [observaciones, setObservaciones] = useState("");

  // Cargar solicitudes cuando el usuario esté autenticado
  useEffect(() => {
    if (user) {
      console.log('Usuario autenticado, cargando solicitudes:', user);
      loadSolicitudes();
    } else {
      console.log('Usuario no autenticado');
    }
  }, [user]);

  // Cargar solicitudes
  const loadSolicitudes = async () => {
    console.log('loadSolicitudes llamado, user:', user);
    
    if (!user) {
      console.log('No hay usuario autenticado, saltando carga de solicitudes');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Haciendo petición a /solicitudes...');
      const response = await solicitudService.getSolicitudes();
      console.log('Respuesta de solicitudes:', response);
      setSolicitudes(response.solicitudes || []);
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error headers:', error.response?.headers);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('Error de autenticación, limpiando sesión');
        message.error('Sesión expirada. Por favor, inicie sesión nuevamente.');
        localStorage.removeItem('user');
        window.location.href = '/';
      } else if (error.response?.data?.message) {
        console.error('Error response:', error.response);
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);
        message.error(error.response.data.message);
      } else if (error.message) {
        message.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Cargar detalle de solicitud
  const loadSolicitudDetail = async (id) => {
    try {
      const response = await solicitudService.getSolicitudById(id);
      setSelectedSolicitud(response);
      setObservaciones(""); // Limpiar observaciones al abrir modal
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error al cargar detalle de solicitud:', error);
      message.error('Error al cargar el detalle de la solicitud');
    }
  };

  // Aprobar solicitud
  const aprobarSolicitud = async (id) => {
    try {
      await solicitudService.aprobarSolicitud(id, observaciones);
      message.success('Solicitud aprobada exitosamente');
      setShowDetailModal(false);
      setSelectedSolicitud(null);
      setObservaciones("");
      loadSolicitudes(); // Recargar la lista
    } catch (error) {
      console.error('Error al aprobar solicitud:', error);
      message.error('Error al aprobar la solicitud');
    }
  };

  // Rechazar solicitud
  const rechazarSolicitud = async (id) => {
    try {
      await solicitudService.rechazarSolicitud(id, observaciones);
      message.success('Solicitud rechazada exitosamente');
      setShowDetailModal(false);
      setSelectedSolicitud(null);
      setObservaciones("");
      loadSolicitudes(); // Recargar la lista
    } catch (error) {
      console.error('Error al rechazar solicitud:', error);
      message.error('Error al rechazar la solicitud');
    }
  };

  // Filtrar solicitudes por búsqueda
  const filteredSolicitudes = solicitudes.filter(solicitud => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      solicitud.nombreContacto?.toLowerCase().includes(searchLower) ||
      solicitud.nombreObra?.toLowerCase().includes(searchLower) ||
      solicitud.client?.razonSocial?.toLowerCase().includes(searchLower)
    );
  });

  // Datos para gráficos
  const requestsByStatusData = [
    { name: 'En revisión', value: solicitudes.filter(s => s.status === 'en-revisión').length },
    { name: 'Aprobadas', value: solicitudes.filter(s => s.status === 'aprobado').length },
    { name: 'Rechazadas', value: solicitudes.filter(s => s.status === 'rechazado').length },
  ];
  // Filtrar solo los estados con valor > 0
  const filteredStatusData = requestsByStatusData.filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      {!user ? (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Acceso Requerido</h2>
            <p className="text-gray-600 mb-4">Debe iniciar sesión para acceder a las solicitudes de cotización.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-900"
              style={{ color: 'white' }}
            >
              Ir al Login
            </button>
          </div>
        </div>
      ) : (
        <>
          {showForm ? (
            <RequestForm 
              onCancel={() => setShowForm(false)} 
              onSuccess={loadSolicitudes}
            />
          ) : (
            <div className="flex justify-center mb-6">
              <button 
                onClick={() => setShowForm(true)}
                className="flex items-center px-6 py-3 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors cursor-pointer font-medium"
                style={{ color: 'white' }}
              >
                <Plus className="w-4 h-4 mr-2" /> Crear Nueva Solicitud
              </button>
            </div>
          )}

          {/* Gráfico de torta - Distribución por estado */}
          <div className="bg-white shadow-lg rounded-lg">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Distribución por Estado</h2>
              {filteredStatusData.length === 0 ? (
                <div className="text-center text-gray-400 py-16 text-lg">No hay datos para mostrar</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={filteredStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {filteredStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Tabla de solicitudes */}
          <div className="bg-white shadow-lg rounded-lg">
            <div className="p-0">
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold">Listado de Solicitudes</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Buscar..." 
                      className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                    <Filter className="w-4 h-4 mr-1" /> Filtros
                  </button>
                  <button className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                    <Download className="w-4 h-4 mr-1" /> Exportar
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitante</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Obra/Proyecto</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ESTATUS</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OPCIONES</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                          Cargando solicitudes...
                        </td>
                      </tr>
                    ) : filteredSolicitudes.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                          No hay solicitudes registradas
                        </td>
                      </tr>
                    ) : (
                      filteredSolicitudes.map((solicitud) => (
                        <tr key={solicitud._id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {solicitud._id.slice(-6)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {solicitud.client?.razonSocial || 'N/A'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {solicitud.nombreContacto || 'N/A'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {solicitud.nombreObra || 'N/A'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(solicitud.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                              solicitud.status === 'aprobado' ? 'bg-green-100 text-green-800' :
                              solicitud.status === 'en-revisión' ? 'bg-blue-100 text-blue-800' :
                              solicitud.status === 'rechazado' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {solicitud.status === 'en-revisión' && <div className="w-2 h-2 bg-blue-400 rounded-full mr-1 animate-pulse"></div>}
                              {solicitud.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-1">
                              <button 
                                className="flex items-center px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                                onClick={() => loadSolicitudDetail(solicitud._id)}
                              >
                                <FileText className="w-3 h-3 mr-1" /> Detalle
                              </button>
                              <button className="flex items-center px-2 py-1 text-xs text-gray-400 hover:text-gray-600 cursor-pointer">
                                <MoreHorizontal className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center p-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Mostrando {filteredSolicitudes.length} de {solicitudes.length} registros
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal de Detalle de Solicitud */}
      {showDetailModal && selectedSolicitud && (
        <div 
          className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center"
          style={{ zIndex: 9999 }}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Detalle de Solicitud #{selectedSolicitud._id?.slice(-6) || 'N/A'}
              </h2>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedSolicitud(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Información del Cliente */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Información del Cliente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Razón Social</label>
                    <p className="text-sm text-gray-900">{selectedSolicitud.client?.razonSocial || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">RUT</label>
                    <p className="text-sm text-gray-900">{selectedSolicitud.client?.rut || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Giro</label>
                    <p className="text-sm text-gray-900">{selectedSolicitud.client?.giro || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Comuna</label>
                    <p className="text-sm text-gray-900">{selectedSolicitud.client?.comuna || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email del Cliente</label>
                    <p className="text-sm text-gray-900">{selectedSolicitud.client?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Teléfono del Cliente</label>
                    <p className="text-sm text-gray-900">{selectedSolicitud.client?.phone || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Dirección</label>
                    <p className="text-sm text-gray-900">{selectedSolicitud.client?.address || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Información del Contacto */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Información del Contacto</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre del Contacto</label>
                    <p className="text-sm text-gray-900">{selectedSolicitud.nombreContacto}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Teléfono del Contacto</label>
                    <p className="text-sm text-gray-900">{selectedSolicitud.telefono}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email del Contacto</label>
                    <p className="text-sm text-gray-900">{selectedSolicitud.email}</p>
                  </div>
                </div>
              </div>

              {/* Información de la Obra */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Información de la Obra</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre de la Obra</label>
                    <p className="text-sm text-gray-900">{selectedSolicitud.nombreObra}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ubicación de la Obra</label>
                    <p className="text-sm text-gray-900">{selectedSolicitud.ubicacionObra}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Descripción de Servicios</label>
                  <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{selectedSolicitud.descripcionServicios}</p>
                </div>
              </div>

              {/* Información de la Solicitud */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Información de la Solicitud</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedSolicitud.status === 'aprobado' ? 'bg-green-100 text-green-800' :
                      selectedSolicitud.status === 'en-revisión' ? 'bg-blue-100 text-blue-800' :
                      selectedSolicitud.status === 'rechazado' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedSolicitud.status === 'en-revisión' && <div className="w-2 h-2 bg-blue-400 rounded-full mr-1 animate-pulse"></div>}
                      {selectedSolicitud.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Prioridad</label>
                    <p className="text-sm text-gray-900">{selectedSolicitud.prioridad}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de Creación</label>
                    <p className="text-sm text-gray-900">{new Date(selectedSolicitud.createdAt).toLocaleDateString('es-CL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                </div>
                {/* Observaciones SIEMPRE visible */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                  <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{selectedSolicitud.observaciones && selectedSolicitud.observaciones.trim() !== '' ? selectedSolicitud.observaciones : 'No hay observaciones'}</p>
                </div>
                {selectedSolicitud.status === 'en-revisión' && (
                  <>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Observaciones (opcional)</label>
                      <textarea
                        className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        value={observaciones}
                        onChange={e => setObservaciones(e.target.value)}
                        placeholder="Ingrese comentarios técnicos u observaciones internas"
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          rechazarSolicitud(selectedSolicitud._id);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        Rechazar
                      </button>
                      <button
                        onClick={() => {
                          aprobarSolicitud(selectedSolicitud._id);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Aprobar
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabRequests;