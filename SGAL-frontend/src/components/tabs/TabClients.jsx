import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Plus, X, Check, Trash2, Briefcase } from 'lucide-react';
import { Modal, message, Badge, Spin } from 'antd';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true
});

const TabClients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clientsData, setClientsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingClientId, setEditingClientId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    razonSocial: '',
    rut: '',
    giro: '',
    comuna: '',
    email: '',
    phone: '',
    address: '',
    status: 'active'
  });

  const [formErrors, setFormErrors] = useState({});
  const filtersRef = useRef(null);

  // Cargar clientes
  useEffect(() => {
    fetchClients();
  }, []);

  // Cerrar dropdown si clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    }
    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilters]);

  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/clients');
      // Manejar diferentes formatos de respuesta
      const data = response.data.data || response.data.clients || response.data;
      
      if (!Array.isArray(data)) {
        throw new Error('La respuesta de la API no es un array válido');
      }
      
      setClientsData(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setError(error.message || 'Error al cargar los clientes');
      message.error(error.message || 'Error al cargar los clientes');
      setClientsData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.razonSocial) errors.razonSocial = 'Razón social es requerida';
    if (!formData.rut) errors.rut = 'RUT es requerido';
    if (!formData.email) {
      errors.email = 'Email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email no válido';
    }
    if (!formData.phone) errors.phone = 'Teléfono es requerido';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleEditClient = (client) => {
    setFormData({
      razonSocial: client.razonSocial || '',
      rut: client.rut || '',
      giro: client.giro || '',
      comuna: client.comuna || '',
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      status: client.status || 'active'
    });
    setEditingClientId(client._id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteClient = async () => {
    if (!editingClientId) return;
    setLoading(true);
    try {
      await api.delete(`/api/clients/${editingClientId}`);
      message.success('Cliente eliminado exitosamente');
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditingClientId(null);
      fetchClients();
    } catch (error) {
      console.error(error);
      message.error('Error al eliminar cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isEditMode && editingClientId) {
        await api.put(`/api/clients/${editingClientId}`, formData);
        message.success('Cliente actualizado exitosamente');
      } else {
        await api.post('/api/clients', formData);
        message.success('Cliente creado exitosamente');
      }

      setIsModalOpen(false);
      setFormData({
        razonSocial: '',
        rut: '',
        giro: '',
        comuna: '',
        email: '',
        phone: '',
        address: '',
        status: 'active'
      });
      setIsEditMode(false);
      setEditingClientId(null);
      fetchClients();
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Error al guardar cliente';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clientsData.filter(client => {
    if (!client) return false;
    return (
      client.razonSocial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.rut?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error max-w-md mx-auto mt-8">
        <div className="flex flex-col items-center gap-2">
          <span>Error al cargar clientes: {error}</span>
          <button 
            className="btn btn-sm btn-outline" 
            onClick={fetchClients}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <Modal
        title={isEditMode ? 'Editar Cliente' : 'Crear Nuevo Cliente'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setFormErrors({});
          setIsEditMode(false);
          setEditingClientId(null);
        }}
        footer={null}
        width={600}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Razón Social */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Razón Social*</span>
              </label>
              <input
                type="text"
                name="razonSocial"
                value={formData.razonSocial}
                onChange={handleInputChange}
                className={`input input-bordered ${formErrors.razonSocial ? 'input-error' : ''}`}
              />
              {formErrors.razonSocial && <span className="text-error text-xs">{formErrors.razonSocial}</span>}
            </div>
            
            {/* RUT */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">RUT*</span>
              </label>
              <input
                type="text"
                name="rut"
                value={formData.rut}
                onChange={handleInputChange}
                className={`input input-bordered ${formErrors.rut ? 'input-error' : ''}`}
                placeholder="12.345.678-9"
              />
              {formErrors.rut && <span className="text-error text-xs">{formErrors.rut}</span>}
            </div>
            
            {/* Giro */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Giro</span>
              </label>
              <input
                type="text"
                name="giro"
                value={formData.giro}
                onChange={handleInputChange}
                className="input input-bordered"
              />
            </div>
            
            {/* Comuna */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Comuna</span>
              </label>
              <input
                type="text"
                name="comuna"
                value={formData.comuna}
                onChange={handleInputChange}
                className="input input-bordered"
              />
            </div>
            
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Correo Electrónico*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`input input-bordered ${formErrors.email ? 'input-error' : ''}`}
              />
              {formErrors.email && <span className="text-error text-xs">{formErrors.email}</span>}
            </div>
            
            {/* Teléfono */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Teléfono*</span>
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`input input-bordered ${formErrors.phone ? 'input-error' : ''}`}
              />
              {formErrors.phone && <span className="text-error text-xs">{formErrors.phone}</span>}
            </div>
            
            {/* Dirección */}
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Dirección</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="input input-bordered"
              />
            </div>
            
            {/* Estado */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Estado*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="select select-bordered"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="pending">Pendiente</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            {isEditMode && (
              <button
                type="button"
                onClick={handleDeleteClient}
                disabled={loading}
                className="btn btn-error btn-outline flex items-center gap-2"
              >
                <Trash2 size={16} /> Eliminar Cliente
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-outline flex items-center gap-2 ml-auto"
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <Check size={16} />
              )}
              {isEditMode ? 'Guardar Cambios' : 'Crear Cliente'}
            </button>
          </div>
        </form>
      </Modal>
      
      <div className="card bg-base-100 p-5 shadow-lg">
        <div className="card-body p-0">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center space-x-2 w-full sm:max-w-md">
              <Search size={20} />
              <input
                type="text"
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <div className="relative" ref={filtersRef}>
                <button
                  className="btn btn-outline btn-secondary flex items-center gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size={20} /> Filtros
                </button>

                {showFilters && (
                  <div className="absolute right-0 mt-2 w-60 bg-base-100 border border-gray-300 rounded-md shadow-lg p-4 z-10">
                    <p className="text-sm font-semibold mb-2">Filtros disponibles</p>
                    <label className="flex items-center space-x-2 mb-1">
                      <input type="checkbox" className="checkbox checkbox-outline" />
                      <span>Clientes Activos</span>
                    </label>
                    <label className="flex items-center space-x-2 mb-1">
                      <input type="checkbox" className="checkbox checkbox-outline" />
                      <span>Clientes Inactivos</span>
                    </label>
                    <label className="flex items-center space-x-2 mb-1">
                      <input type="checkbox" className="checkbox checkbox-outline" />
                      <span>Clientes Pendientes</span>
                    </label>
                    <button
                      className="btn btn-sm btn-outline mt-3 w-full"
                      onClick={() => {
                        message.info('Filtros reseteados');
                        setShowFilters(false);
                      }}
                    >
                      Limpiar Filtros
                    </button>
                  </div>
                )}
              </div>

              <button
                className="btn btn-outline flex items-center gap-2"
                onClick={() => {
                  setIsEditMode(false);
                  setFormData({
                    razonSocial: '',
                    rut: '',
                    giro: '',
                    comuna: '',
                    email: '',
                    phone: '',
                    address: '',
                    status: 'active'
                  });
                  setFormErrors({});
                  setIsModalOpen(true);
                }}
              >
                <Plus size={20} /> Nuevo Cliente
              </button>
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Razón Social</th>
                  <th>RUT</th>
                  <th>Giro</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.length > 0 ? (
                  filteredClients.map(client => (
                    <tr key={client._id || client.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-8 h-8">
                              <Briefcase className="w-4 h-4" />
                            </div>
                          </div>
                          <div>{client.razonSocial}</div>
                        </div>
                      </td>
                      <td>{client.rut}</td>
                      <td>{client.giro || '-'}</td>
                      <td>{client.email}</td>
                      <td>{client.phone}</td>
                      <td>
                        <Badge 
                          status={
                            client.status === 'active' ? 'success' : 
                            client.status === 'inactive' ? 'error' : 'warning'
                          } 
                          text={
                            client.status === 'active' ? 'Activo' : 
                            client.status === 'inactive' ? 'Inactivo' : 'Pendiente'
                          }
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleEditClient(client)}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      {clientsData.length === 0 ? 
                        'No hay clientes registrados' : 
                        'No se encontraron clientes con ese criterio de búsqueda'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabClients;