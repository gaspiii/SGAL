import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Plus, X, Check, Trash2 } from 'lucide-react';
import { Modal, message } from 'antd';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true
});

const TabUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [usersData, setUsersData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    cargo: '',
    iniciales: '',
    username: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // Ref para detectar clic fuera del dropdown de filtros y cerrarlo
  const filtersRef = useRef(null);

  // Cargar usuarios
  useEffect(() => {
    fetchUsers();
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

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/auth/users');
      setUsersData(response.data);
    } catch (error) {
      message.error('Error al cargar los usuarios');
      console.error(error);
    }
  };

  // Filtrado simple, puedes ampliar según filtros reales
  const filteredUsers = usersData.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Validación formulario (igual que antes)
  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Nombre es requerido';
    if (!formData.email) {
      errors.email = 'Email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email no válido';
    }
    // Solo exigir password si es creación, o si el campo no está vacío (cambiar contraseña)
    if (!isEditMode || formData.password) {
      if (!formData.password) {
        errors.password = 'Contraseña es requerida';
      } else if (formData.password.length < 6) {
        errors.password = 'Mínimo 6 caracteres';
      }
    }
    if (!formData.iniciales) errors.iniciales = 'Iniciales son requeridas';
    if (!formData.username) errors.username = 'Usuario es requerido';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Iniciales automáticas
    if (name === 'name') {
      const initials = value.split(' ').map(n => n[0]).join('').toUpperCase();
      setFormData(prev => ({ ...prev, iniciales: initials.substring(0, 2) }));
    }

    // Username automático desde email
    if (name === 'email') {
      const usernamePart = value.split('@')[0];
      setFormData(prev => ({ ...prev, username: usernamePart || '' }));
    }

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleEditUser = (user) => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'user',
      cargo: user.cargo || '',
      iniciales: user.iniciales || '',
      username: user.username || ''
    });
    setEditingUserId(user._id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!editingUserId) return;
    setLoading(true);
    try {
      await api.delete(`/api/auth/users/${editingUserId}`);
      message.success('Usuario eliminado exitosamente');
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditingUserId(null);
      fetchUsers();
    } catch (error) {
      console.error(error);
      message.error('Error al eliminar usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isEditMode && editingUserId) {
        // En PUT si password está vacío, no enviar para no cambiar
        const updateData = { ...formData };
        if (!formData.password) delete updateData.password;
        await api.put(`/api/auth/users/${editingUserId}`, updateData);
        message.success('Usuario actualizado exitosamente');
      } else {
        await api.post('/api/auth/register', formData);
        message.success('Usuario creado exitosamente');
      }

      setIsModalOpen(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user',
        cargo: '',
        iniciales: '',
        username: ''
      });
      setIsEditMode(false);
      setEditingUserId(null);
      fetchUsers();
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Error al guardar usuario';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative">
    
      <Modal
        title={isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setFormErrors({});
          setIsEditMode(false);
          setEditingUserId(null);
        }}
        footer={null}
        width={600}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ... campos del formulario iguales que antes ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nombre Completo*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`input input-bordered ${formErrors.name ? 'input-error' : ''}`}
              />
              {formErrors.name && <span className="text-error text-xs">{formErrors.name}</span>}
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
                disabled={isEditMode} // No permitir cambiar email en edición para simplicidad
              />
              {formErrors.email && <span className="text-error text-xs">{formErrors.email}</span>}
            </div>
            {/* Contraseña */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">{isEditMode ? 'Nueva Contraseña' : 'Contraseña*'}</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`input input-bordered ${formErrors.password ? 'input-error' : ''}`}
                placeholder={isEditMode ? 'Dejar vacío para no cambiar' : ''}
              />
              {formErrors.password && <span className="text-error text-xs">{formErrors.password}</span>}
            </div>
            {/* Rol */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Rol*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="select select-bordered"
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            {/* Cargo */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Cargo</span>
              </label>
              <input
                type="text"
                name="cargo"
                value={formData.cargo}
                onChange={handleInputChange}
                className="input input-bordered"
              />
            </div>
            {/* Iniciales */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Iniciales*</span>
              </label>
              <input
                type="text"
                name="iniciales"
                value={formData.iniciales}
                onChange={handleInputChange}
                className={`input input-bordered ${formErrors.iniciales ? 'input-error' : ''}`}
                maxLength={2}
              />
              {formErrors.iniciales && <span className="text-error text-xs">{formErrors.iniciales}</span>}
            </div>
            {/* Username */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Usuario*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`input input-bordered ${formErrors.username ? 'input-error' : ''}`}
              />
              {formErrors.username && <span className="text-error text-xs">{formErrors.username}</span>}
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            {isEditMode && (
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={loading}
                className="btn btn-error btn-outline flex items-center gap-2"
              >
                <Trash2 size={16} /> Eliminar Usuario
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-outline flex items-center gap-2 ml-auto"
            >
              <Check size={16} />
              {isEditMode ? 'Guardar Cambios' : 'Crear Usuario'}
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
          placeholder="Buscar usuario..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>

        {/* Filtros y botón crear agrupados */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="relative" ref={filtersRef}>
            <button
              className="btn btn-outline btn-secondary flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} /> Filtros
            </button>

            {/* Dropdown filtros */}
            {showFilters && (
              <div className="absolute right-0 mt-2 w-60 bg-base-100 border border-gray-300 rounded-md shadow-lg p-4 z-10">
                <p className="text-sm font-semibold mb-2">Filtros disponibles</p>
                <label className="flex items-center space-x-2 mb-1">
                  <input type="checkbox" className="checkbox checkbox-outline" />
                  <span>Administradores</span>
                </label>
                <label className="flex items-center space-x-2 mb-1">
                  <input type="checkbox" className="checkbox checkbox-outline" />
                  <span>Usuarios Activos</span>
                </label>
                <label className="flex items-center space-x-2 mb-1">
                  <input type="checkbox" className="checkbox checkbox-outline" />
                  <span>Sin cargo</span>
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
                name: '',
                email: '',
                password: '',
                role: 'user',
                cargo: '',
                iniciales: '',
                username: ''
              });
              setFormErrors({});
              setIsModalOpen(true);
            }}
          >
            <Plus size={20} /> Nuevo Usuario
          </button>
        </div>
      </div>


      {/* Tabla de usuarios */}
      <table className="table w-full mt-4">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Cargo</th>
            <th>Iniciales</th>
            <th>Usuario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.cargo || '-'}</td>
                <td>{user.iniciales}</td>
                <td>{user.username}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline btn-danger"
                    onClick={() => handleEditUser(user)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No se encontraron usuarios
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div></div></div>
  );
};

export default TabUsers;
