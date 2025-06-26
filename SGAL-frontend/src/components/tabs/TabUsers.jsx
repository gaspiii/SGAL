import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Plus, X, Check, Trash2 } from 'lucide-react';
import { Modal, message } from 'antd';
import axios from 'axios';

// Configuración de la conexión con el servidor backend
const api = axios.create({
  baseURL: 'http://localhost:3000',  // URL del servidor local
  withCredentials: true              // Permite enviar cookies de autenticación
});

/**
 * Componente principal para gestionar usuarios
 * Permite crear, editar, eliminar y buscar usuarios en el sistema
 */
const TabUsers = () => {
  // ==================== ESTADOS DEL COMPONENTE ====================
  
  // Estado para el texto de búsqueda en tiempo real
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado que almacena todos los usuarios obtenidos del servidor
  const [usersData, setUsersData] = useState([]);
  
  // Estado que controla si el modal (ventana emergente) está abierto
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado que indica si alguna operación está en proceso (crear, editar, eliminar)
  const [loading, setLoading] = useState(false);
  
  // Estado que indica si estamos editando (true) o creando (false) un usuario
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Estado que guarda el ID del usuario que se está editando
  const [editingUserId, setEditingUserId] = useState(null);
  
  // Estado que controla si el dropdown de filtros está visible
  const [showFilters, setShowFilters] = useState(false);

  // Estado que almacena todos los datos del formulario
  const [formData, setFormData] = useState({
    name: '',         // Nombre completo del usuario
    email: '',        // Correo electrónico
    password: '',     // Contraseña (vacía en modo edición si no se quiere cambiar)
    role: 'user',     // Rol por defecto: 'user' o 'admin'
    cargo: '',        // Cargo/puesto de trabajo (opcional)
    iniciales: '',    // Iniciales del nombre (máximo 2 caracteres)
    username: ''      // Nombre de usuario único
  });

  // Estado que almacena los errores de validación del formulario
  const [formErrors, setFormErrors] = useState({});

  // Referencia para detectar clics fuera del dropdown de filtros
  const filtersRef = useRef(null);

  // ==================== EFECTOS (useEffect) ====================
  
  /**
   * Efecto que se ejecuta una vez al cargar el componente
   * Obtiene la lista inicial de usuarios del servidor
   */
  useEffect(() => {
    fetchUsers();
  }, []);

  /**
   * Efecto que maneja el cierre del dropdown de filtros
   * Se cierra automáticamente si el usuario hace clic fuera de él
   */
  useEffect(() => {
    function handleClickOutside(event) {
      // Si el clic fue fuera del dropdown, lo cerramos
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    }
    
    // Solo añadimos el listener si el dropdown está abierto
    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    // Limpiamos el listener al desmontar el componente
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilters]);

  // ==================== FUNCIONES PRINCIPALES ====================

  /**
   * Obtiene todos los usuarios del servidor
   * Se ejecuta al cargar la página y después de crear/editar/eliminar usuarios
   */
  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/auth/users');
      setUsersData(response.data);  // Guardamos los usuarios en el estado
    } catch (error) {
      message.error('Error al cargar los usuarios');
      console.error(error);
    }
  };

  /**
   * Filtra los usuarios basándose en el término de búsqueda
   * Busca coincidencias en el nombre y email del usuario
   */
  const filteredUsers = usersData.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Valida todos los campos del formulario antes de enviar
   * Retorna true si todo está correcto, false si hay errores
   */
  const validateForm = () => {
    const errors = {};
    
    // Validación del nombre (obligatorio)
    if (!formData.name) errors.name = 'Nombre es requerido';
    
    // Validación del email (obligatorio y formato válido)
    if (!formData.email) {
      errors.email = 'Email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email no válido';
    }
    
    // Validación de contraseña (obligatoria solo al crear, opcional al editar)
    if (!isEditMode || formData.password) {
      if (!formData.password) {
        errors.password = 'Contraseña es requerida';
      } else if (formData.password.length < 6) {
        errors.password = 'Mínimo 6 caracteres';
      }
    }
    
    // Validación de iniciales (obligatorio)
    if (!formData.iniciales) errors.iniciales = 'Iniciales son requeridas';
    
    // Validación de nombre de usuario (obligatorio)
    if (!formData.username) errors.username = 'Usuario es requerido';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;  // Retorna true si no hay errores
  };

  /**
   * Maneja los cambios en los campos del formulario
   * Incluye lógica automática para generar iniciales y username
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Actualizamos el campo que cambió
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // FUNCIONALIDAD AUTOMÁTICA: Generar iniciales desde el nombre
    if (name === 'name') {
      // Tomamos la primera letra de cada palabra del nombre
      const initials = value.split(' ').map(n => n[0]).join('').toUpperCase();
      setFormData(prev => ({ 
        ...prev, 
        iniciales: initials.substring(0, 2)  // Máximo 2 iniciales
      }));
    }

    // FUNCIONALIDAD AUTOMÁTICA: Generar username desde el email
    if (name === 'email') {
      // Tomamos la parte antes del @ como sugerencia de username
      const usernamePart = value.split('@')[0];
      setFormData(prev => ({ 
        ...prev, 
        username: usernamePart || '' 
      }));
    }

    // Limpiar error del campo si el usuario está corrigiendo
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Prepara el formulario para editar un usuario existente
   * Llena todos los campos con los datos actuales del usuario
   */
  const handleEditUser = (user) => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',                 // Contraseña vacía - no cambiar si se deja así
      role: user.role || 'user',
      cargo: user.cargo || '',
      iniciales: user.iniciales || '',
      username: user.username || ''
    });
    setEditingUserId(user._id);     // Guardamos qué usuario estamos editando
    setIsEditMode(true);            // Activamos modo edición
    setIsModalOpen(true);           // Abrimos el modal
  };

  /**
   * Elimina un usuario del sistema
   * Solo funciona cuando estamos en modo edición
   */
  const handleDeleteUser = async () => {
    if (!editingUserId) return;  // No hacer nada si no hay usuario seleccionado
    
    setLoading(true);
    try {
      await api.delete(`/api/auth/users/${editingUserId}`);
      message.success('Usuario eliminado exitosamente');
      
      // Cerrar modal y limpiar estados
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditingUserId(null);
      
      fetchUsers();  // Recargar la lista de usuarios
    } catch (error) {
      console.error(error);
      message.error('Error al eliminar usuario');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja el envío del formulario (crear o editar usuario)
   * Valida los datos y envía la petición al servidor
   */
  const handleSubmit = async (e) => {
    e.preventDefault();           // Prevenir el envío normal del formulario
    if (!validateForm()) return;  // No continuar si hay errores de validación

    setLoading(true);
    try {
      if (isEditMode && editingUserId) {
        // MODO EDICIÓN: Actualizar usuario existente
        const updateData = { ...formData };
        // Si la contraseña está vacía, no la enviamos (no cambiar)
        if (!formData.password) delete updateData.password;
        
        await api.put(`/api/auth/users/${editingUserId}`, updateData);
        message.success('Usuario actualizado exitosamente');
      } else {
        // MODO CREACIÓN: Crear nuevo usuario
        await api.post('/api/auth/register', formData);
        message.success('Usuario creado exitosamente');
      }

      // Limpiar y cerrar formulario después del éxito
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
      fetchUsers();  // Recargar lista de usuarios
      
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Error al guardar usuario';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ==================== RENDERIZADO DEL COMPONENTE ====================
  
  return (
    <div className="space-y-6 relative">
    
      {/* MODAL PARA CREAR/EDITAR USUARIOS */}
      <Modal
        title={isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        open={isModalOpen}
        onCancel={() => {
          // Función para cerrar el modal y limpiar estados
          setIsModalOpen(false);
          setFormErrors({});
          setIsEditMode(false);
          setEditingUserId(null);
        }}
        footer={null}  // Sin botones por defecto, usamos los nuestros
        width={600}
      >
        {/* FORMULARIO PRINCIPAL */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* CAMPO: Nombre Completo */}
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
            
            {/* CAMPO: Email */}
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
                disabled={isEditMode} // No permitir cambiar email en edición
              />
              {formErrors.email && <span className="text-error text-xs">{formErrors.email}</span>}
            </div>
            
            {/* CAMPO: Contraseña */}
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
            
            {/* CAMPO: Rol del usuario */}
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
            
            {/* CAMPO: Cargo (opcional) */}
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
            
            {/* CAMPO: Iniciales (se generan automáticamente) */}
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
                maxLength={2}  // Máximo 2 caracteres
              />
              {formErrors.iniciales && <span className="text-error text-xs">{formErrors.iniciales}</span>}
            </div>
            
            {/* CAMPO: Username (se genera automáticamente desde email) */}
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

          {/* BOTONES DEL FORMULARIO */}
          <div className="flex justify-between items-center mt-6">
            {/* Botón de eliminar (solo en modo edición) */}
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
            
            {/* Botón principal (crear o guardar) */}
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
      
      {/* CONTENEDOR PRINCIPAL DE LA INTERFAZ */}
      <div className="card bg-base-100 p-5 shadow-lg">
        <div className="card-body p-0">
          <div className="flex justify-between items-center flex-wrap gap-4">
            
            {/* BARRA DE BÚSQUEDA */}
            <div className="flex items-center space-x-2 w-full sm:max-w-md">
              <Search size={20} />
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}  // Búsqueda en tiempo real
                className="input input-bordered w-full"
              />
            </div>

            {/* CONTROLES: Filtros y botón crear */}
            <div className="flex items-center gap-2 ml-auto">
              
              {/* DROPDOWN DE FILTROS */}
              <div className="relative" ref={filtersRef}>
                <button
                  className="btn btn-outline btn-secondary flex items-center gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size={20} /> Filtros
                </button>

                {/* Contenido del dropdown (solo visible si showFilters es true) */}
                {showFilters && (
                  <div className="absolute right-0 mt-2 w-60 bg-base-100 border border-gray-300 rounded-md shadow-lg p-4 z-10">
                    <p className="text-sm font-semibold mb-2">Filtros disponibles</p>
                    
                    {/* Opciones de filtro (funcionalidad pendiente de implementar) */}
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
                    
                    {/* Botón para limpiar filtros */}
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

              {/* BOTÓN PARA CREAR NUEVO USUARIO */}
              <button
                className="btn btn-outline flex items-center gap-2"
                onClick={() => {
                  // Preparar formulario para crear nuevo usuario
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

          {/* TABLA DE USUARIOS */}
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
                // Mostrar cada usuario filtrado en una fila
                filteredUsers.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.cargo || '-'}</td>  {/* Mostrar '-' si no tiene cargo */}
                    <td>{user.iniciales}</td>
                    <td>{user.username}</td>
                    <td>
                      {/* Botón para editar este usuario */}
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
                // Mensaje cuando no hay usuarios que mostrar
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No se encontraron usuarios
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

export default TabUsers;