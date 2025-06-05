import React, { useState, useEffect } from 'react';
import { Search, Plus, Check, Trash2 } from 'lucide-react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

const TabGroups = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gruposData, setGruposData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingGrupoId, setEditingGrupoId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    roles: ['general'], // Valor por defecto
    miembros: []
  });

  const [formErrors, setFormErrors] = useState({
    nombre: '',
    roles: ''
  });

  // Cargar grupos y usuarios
  useEffect(() => {
    fetchGrupos();
    fetchUsuarios();
  }, []);

  const fetchGrupos = async () => {
    try {
      const response = await api.get('/api/grupos');
      const data = response.data?.grupos || response.data;
      
      if (!Array.isArray(data)) {
        throw new Error('Formato de datos inválido');
      }
      
      setGruposData(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setErrorMessage(error.response?.data?.message || 'Error al cargar grupos');
      setGruposData([]);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await api.get('/api/auth/users');
      setUsersData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsersData([]);
    }
  };

  // Filtrado seguro de grupos
  const filteredGrupos = gruposData.filter(grupo => {
    if (!grupo) return false;
    return (
      (grupo.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (grupo.descripcion || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Validación del formulario
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.nombre?.trim()) {
      errors.nombre = 'Nombre del grupo es requerido';
      isValid = false;
    }

    if (!formData.roles || formData.roles.length === 0) {
      errors.roles = 'Debe asignar al menos un rol';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error cuando se escribe
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRolesChange = (e) => {
    const roles = e.target.value.split(',')
      .map(r => r.trim())
      .filter(Boolean);
      
    setFormData(prev => ({ ...prev, roles }));
    
    if (formErrors.roles) {
      setFormErrors(prev => ({ ...prev, roles: '' }));
    }
  };

  const handleEditGrupo = (grupo) => {
    setFormData({
      nombre: grupo.nombre || '',
      descripcion: grupo.descripcion || '',
      roles: Array.isArray(grupo.roles) ? grupo.roles : ['general'],
      miembros: Array.isArray(grupo.miembros) 
        ? grupo.miembros.map(m => typeof m === 'string' ? m : m._id)
        : []
    });
    setEditingGrupoId(grupo._id);
    setIsEditMode(true);
    setIsModalOpen(true);
    setErrorMessage('');
  };

  const handleDeleteGrupo = async () => {
    if (!editingGrupoId) return;
    
    setLoading(true);
    try {
      await api.delete(`/api/grupos/${editingGrupoId}`);
      setIsModalOpen(false);
      fetchGrupos();
    } catch (error) {
      console.error('Delete error:', error);
      setErrorMessage(error.response?.data?.message || 'Error al eliminar grupo');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const grupoData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        roles: formData.roles,
        miembros: formData.miembros
      };

      if (isEditMode) {
        await api.put(`/api/grupos/${editingGrupoId}`, grupoData);
      } else {
        await api.post('/api/grupos', grupoData);
      }

      setIsModalOpen(false);
      setFormData({ nombre: '', descripcion: '', roles: ['general'], miembros: [] });
      fetchGrupos();
    } catch (error) {
      console.error('Save error:', {
        error: error.response?.data,
        request: error.config?.data
      });

      // Manejar errores de validación del servidor
      if (error.response?.data?.errors) {
        const serverErrors = {};
        error.response.data.errors.forEach(err => {
          serverErrors[err.path] = err.msg;
        });
        setFormErrors(serverErrors);
      }

      setErrorMessage(
        error.response?.data?.message || 
        'Error al guardar el grupo. Verifique los datos.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Modal para crear/editar grupos */}
      <div className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-4xl">
          <h3 className="font-bold text-lg mb-4">
            {isEditMode ? 'Editar Grupo' : 'Crear Nuevo Grupo'}
          </h3>
          
          {errorMessage && (
            <div className="alert alert-error mb-4">
              <div>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre del Grupo */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nombre del Grupo*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className={`input input-bordered w-full ${
                    formErrors.nombre ? 'input-error' : ''
                  }`}
                  placeholder="Ej: Administradores"
                />
                {formErrors.nombre && (
                  <span className="text-error text-sm">{formErrors.nombre}</span>
                )}
              </div>

              {/* Descripción */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Descripción</span>
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered w-full h-24"
                  placeholder="Descripción del grupo"
                />
              </div>

              {/* Roles */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Roles* (separados por comas)</span>
                </label>
                <input
                  type="text"
                  value={formData.roles.join(', ')}
                  onChange={handleRolesChange}
                  className={`input input-bordered w-full ${
                    formErrors.roles ? 'input-error' : ''
                  }`}
                  placeholder="Ej: general, admin"
                />
                {formErrors.roles && (
                  <span className="text-error text-sm">{formErrors.roles}</span>
                )}
                <div className="mt-2 flex flex-wrap gap-1">
                  {formData.roles.map((rol, i) => (
                    <span key={i} className="badge badge-outline">
                      {rol}
                    </span>
                  ))}
                </div>
              </div>

              {/* Miembros */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Miembros</span>
                </label>
                <select
                  multiple
                  className="select select-bordered w-full h-32"
                  value={formData.miembros}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, opt => opt.value);
                    setFormData(prev => ({ ...prev, miembros: selected }));
                  }}
                >
                  {usersData.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                <div className="mt-2 flex flex-wrap gap-1">
                  {formData.miembros.map(id => {
                    const user = usersData.find(u => u._id === id);
                    return (
                      <span key={id} className="badge badge-primary">
                        {user?.name || id}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="modal-action mt-6">
              {isEditMode && (
                <button
                  type="button"
                  onClick={handleDeleteGrupo}
                  disabled={loading}
                  className="btn btn-error mr-auto"
                >
                  {loading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <Trash2 size={16} />
                  )}
                  Eliminar
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setFormErrors({});
                  setErrorMessage('');
                }}
                className="btn"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-outline"
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <Check size={16} />
                )}
                {isEditMode ? 'Guardar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Search size={20} />
              <input
                type="text"
                placeholder="Buscar grupos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>

            <button
              className="btn btn-outline w-full md:w-auto"
              onClick={() => {
                setIsEditMode(false);
                setFormData({
                  nombre: '',
                  descripcion: '',
                  roles: ['general'],
                  miembros: []
                });
                setFormErrors({});
                setErrorMessage('');
                setIsModalOpen(true);
              }}
            >
              <Plus size={16} /> Nuevo Grupo
            </button>
          </div>

          {/* Tabla de grupos */}
          {errorMessage && !isModalOpen && (
            <div className="alert alert-error mb-4">
              <div>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Roles</th>
                  <th>Miembros</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrupos.length > 0 ? (
                  filteredGrupos.map(grupo => (
                    <tr key={grupo._id}>
                      <td className="font-medium">{grupo.nombre}</td>
                      <td>{grupo.descripcion || '-'}</td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {grupo.roles?.map((rol, i) => (
                            <span key={i} className="badge badge-outline">
                              {rol}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {grupo.miembros?.map(miembro => {
                            const id = typeof miembro === 'string' ? miembro : miembro._id;
                            const user = usersData.find(u => u._id === id);
                            return (
                              <span key={id} className="badge badge-primary">
                                {user?.name || id}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleEditGrupo(grupo)}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      {gruposData.length === 0
                        ? 'No hay grupos registrados'
                        : 'No se encontraron grupos con ese criterio de búsqueda'}
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

export default TabGroups;