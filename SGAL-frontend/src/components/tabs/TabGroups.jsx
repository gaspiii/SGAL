import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Check, Trash2 } from 'lucide-react';
import { Modal, message } from 'antd';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true
});

const TabGroups = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gruposData, setGruposData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingGrupoId, setEditingGrupoId] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    roles: [],
    miembros: []
  });

  const [formErrors, setFormErrors] = useState({});
  const filtersRef = useRef(null);

  // Cargar grupos y usuarios
  useEffect(() => {
    fetchGrupos();
    fetchUsuarios();
  }, []);

  const fetchGrupos = async () => {
    try {
      const response = await api.get('/api/grupos');
      // Asegúrate de que gruposData sea SIEMPRE un array
      setGruposData(Array.isArray(response.data.grupos) ? response.data.grupos : []);
    } catch (error) {
      message.error('Error al cargar los grupos');
      setGruposData([]);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await api.get('/api/auth/users');
      setUsersData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setUsersData([]);
    }
  };

  // Filtrado de grupos
  const filteredGrupos = Array.isArray(gruposData)
    ? gruposData.filter(grupo =>
        (grupo.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (grupo.descripcion || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Validación formulario
  const validateForm = () => {
    const errors = {};
    if (!formData.nombre) errors.nombre = 'Nombre del grupo es requerido';
    if (!formData.roles || formData.roles.length === 0) errors.roles = 'Debe asignar al menos un rol';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleRolesChange = (e) => {
    const roles = e.target.value.split(',').map(r => r.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, roles }));
  };

  const handleEditGrupo = (grupo) => {
    setFormData({
      nombre: grupo.nombre || '',
      descripcion: grupo.descripcion || '',
      roles: Array.isArray(grupo.roles) ? grupo.roles : [],
      miembros: Array.isArray(grupo.miembros)
        ? grupo.miembros.map(m => typeof m === 'string' ? m : m._id)
        : []
    });
    setEditingGrupoId(grupo._id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteGrupo = async () => {
    if (!editingGrupoId) return;
    setLoading(true);
    try {
      await api.delete(`/api/grupos/${editingGrupoId}`);
      message.success('Grupo eliminado exitosamente');
      setIsModalOpen(false);
      fetchGrupos();
    } catch (error) {
      message.error('Error al eliminar grupo');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Solo envía los campos requeridos y en el formato correcto
      const grupoData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        roles: formData.roles,
        miembros: formData.miembros.filter(Boolean)
      };

      if (isEditMode) {
        await api.put(`/api/grupos/${editingGrupoId}`, grupoData);
        message.success('Grupo actualizado exitosamente');
      } else {
        await api.post('/api/grupos', grupoData);
        message.success('Grupo creado exitosamente');
      }

      setIsModalOpen(false);
      setFormData({ nombre: '', descripcion: '', roles: [], miembros: [] });
      fetchGrupos();
    } catch (error) {
      message.error(error.response?.data?.message || 'Error al guardar grupo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <Modal
        title={isEditMode ? 'Editar Grupo' : 'Crear Nuevo Grupo'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setFormErrors({});
          setIsEditMode(false);
        }}
        footer={null}
        width={800}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
                className={`input input-bordered ${formErrors.nombre ? 'input-error' : ''}`}
              />
              {formErrors.nombre && <span className="text-error text-xs">{formErrors.nombre}</span>}
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
                className="textarea textarea-bordered h-24"
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
                className={`input input-bordered ${formErrors.roles ? 'input-error' : ''}`}
              />
              {formErrors.roles && <span className="text-error text-xs">{formErrors.roles}</span>}
            </div>

            {/* Miembros */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Miembros</span>
              </label>
              <select
                multiple
                className="select select-bordered h-32"
                value={formData.miembros}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  miembros: Array.from(e.target.selectedOptions, option => option.value)
                }))}
              >
                {usersData.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            {isEditMode && (
              <button
                type="button"
                onClick={handleDeleteGrupo}
                disabled={loading}
                className="btn btn-error btn-outline flex items-center gap-2"
              >
                <Trash2 size={16} /> Eliminar Grupo
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-outline flex items-center gap-2 ml-auto"
            >
              <Check size={16} />
              {isEditMode ? 'Guardar Cambios' : 'Crear Grupo'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Barra de búsqueda y controles */}
      <div className="card bg-base-100 p-5 shadow-lg">
        <div className="card-body p-0">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center space-x-2 w-full sm:max-w-md">
              <Search size={20} />
              <input
                type="text"
                placeholder="Buscar grupos..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                className="btn btn-outline flex items-center gap-2"
                onClick={() => {
                  setIsEditMode(false);
                  setFormData({ nombre: '', descripcion: '', roles: [], miembros: [] });
                  setIsModalOpen(true);
                }}
              >
                <Plus size={20} /> Nuevo Grupo
              </button>
            </div>
          </div>

          {/* Tabla de grupos */}
          <table className="table w-full mt-4">
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
                    <td>{grupo.nombre}</td>
                    <td>{grupo.descripcion || '-'}</td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(grupo.roles) && grupo.roles.map(rol => (
                          <span key={rol} className="badge badge-outline">{rol}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(grupo.miembros) && grupo.miembros.map(miembro => (
                          <span key={typeof miembro === 'string' ? miembro : miembro._id} className="badge">
                            {typeof miembro === 'string'
                              ? (usersData.find(u => u._id === miembro)?.name || miembro)
                              : miembro.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline btn-danger"
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
                    No se encontraron grupos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TabGroups;
