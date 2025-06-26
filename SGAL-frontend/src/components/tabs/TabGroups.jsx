import React, { useState, useEffect } from 'react';
import { Search, Plus, Check, Trash2 } from 'lucide-react';
import axios from 'axios';

// Configuración de la conexión con el servidor
// Esto establece la dirección del servidor y permite enviar cookies de sesión
const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

const TabGroups = () => {
  // ===== VARIABLES DE ESTADO =====
  // Estas variables guardan información que cambia mientras usas la aplicación
  
  const [searchTerm, setSearchTerm] = useState(''); // Texto para buscar grupos
  const [gruposData, setGruposData] = useState([]); // Lista de todos los grupos
  const [usersData, setUsersData] = useState([]); // Lista de todos los usuarios
  const [isModalOpen, setIsModalOpen] = useState(false); // Si la ventana emergente está abierta
  const [loading, setLoading] = useState(false); // Si algo se está cargando
  const [isEditMode, setIsEditMode] = useState(false); // Si estamos editando o creando un grupo
  const [editingGrupoId, setEditingGrupoId] = useState(null); // ID del grupo que estamos editando
  const [errorMessage, setErrorMessage] = useState(''); // Mensaje de error para mostrar al usuario

  // Información del formulario para crear/editar grupos
  const [formData, setFormData] = useState({
    nombre: '', // Nombre del grupo
    descripcion: '', // Descripción del grupo
    roles: ['general'], // Lista de roles (permisos) - empieza con 'general'
    miembros: [] // Lista de personas en el grupo
  });

  // Errores del formulario (para mostrar cuando algo está mal)
  const [formErrors, setFormErrors] = useState({
    nombre: '', // Error en el nombre
    roles: '' // Error en los roles
  });

  // ===== CARGAR DATOS AL INICIO =====
  // Esto se ejecuta cuando el componente se carga por primera vez
  useEffect(() => {
    fetchGrupos(); // Traer la lista de grupos del servidor
    fetchUsuarios(); // Traer la lista de usuarios del servidor
  }, []);

  // Función para obtener los grupos desde el servidor
  const fetchGrupos = async () => {
    try {
      const response = await api.get('/api/grupos');
      const data = response.data?.grupos || response.data;
      
      // Verificar que recibimos una lista válida
      if (!Array.isArray(data)) {
        throw new Error('Formato de datos inválido');
      }
      
      setGruposData(data); // Guardar los grupos en nuestra variable
    } catch (error) {
      console.error('Error fetching groups:', error);
      setErrorMessage(error.response?.data?.message || 'Error al cargar grupos');
      setGruposData([]); // Si hay error, dejar la lista vacía
    }
  };

  // Función para obtener los usuarios desde el servidor
  const fetchUsuarios = async () => {
    try {
      const response = await api.get('/api/auth/users');
      setUsersData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsersData([]); // Si hay error, dejar la lista vacía
    }
  };

  // ===== FILTRAR GRUPOS PARA LA BÚSQUEDA =====
  // Esta función filtra los grupos según lo que escriba el usuario en la búsqueda
  const filteredGrupos = gruposData.filter(grupo => {
    if (!grupo) return false; // Saltarse grupos vacíos
    
    // Buscar en el nombre y descripción del grupo (sin importar mayúsculas/minúsculas)
    return (
      (grupo.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (grupo.descripcion || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // ===== VALIDAR FORMULARIO =====
  // Verificar que todos los campos obligatorios estén completos
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // El nombre es obligatorio
    if (!formData.nombre?.trim()) {
      errors.nombre = 'Nombre del grupo es requerido';
      isValid = false;
    }

    // Debe tener al menos un rol
    if (!formData.roles || formData.roles.length === 0) {
      errors.roles = 'Debe asignar al menos un rol';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // ===== MANEJAR CAMBIOS EN EL FORMULARIO =====
  
  // Cuando el usuario escribe en los campos de texto
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar el mensaje de error cuando el usuario comience a escribir
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Cuando el usuario cambia los roles (separados por comas)
  const handleRolesChange = (e) => {
    // Convertir texto separado por comas en una lista
    const roles = e.target.value.split(',')
      .map(r => r.trim()) // Quitar espacios en blanco
      .filter(Boolean); // Quitar elementos vacíos
      
    setFormData(prev => ({ ...prev, roles }));
    
    // Limpiar error de roles si había uno
    if (formErrors.roles) {
      setFormErrors(prev => ({ ...prev, roles: '' }));
    }
  };

  // ===== EDITAR UN GRUPO =====
  // Preparar el formulario con los datos del grupo que queremos editar
  const handleEditGrupo = (grupo) => {
    // Llenar el formulario con la información actual del grupo
    setFormData({
      nombre: grupo.nombre || '',
      descripcion: grupo.descripcion || '',
      roles: Array.isArray(grupo.roles) ? grupo.roles : ['general'],
      miembros: Array.isArray(grupo.miembros) 
        ? grupo.miembros.map(m => typeof m === 'string' ? m : m._id) // Obtener solo los IDs
        : []
    });
    
    setEditingGrupoId(grupo._id); // Recordar cuál grupo estamos editando
    setIsEditMode(true); // Cambiar a modo edición
    setIsModalOpen(true); // Abrir la ventana emergente
    setErrorMessage(''); // Limpiar errores anteriores
  };

  // ===== ELIMINAR UN GRUPO =====
  const handleDeleteGrupo = async () => {
    if (!editingGrupoId) return; // No hacer nada si no hay grupo seleccionado
    
    setLoading(true); // Mostrar que está cargando
    try {
      await api.delete(`/api/grupos/${editingGrupoId}`); // Eliminar del servidor
      setIsModalOpen(false); // Cerrar ventana emergente
      fetchGrupos(); // Actualizar la lista de grupos
    } catch (error) {
      console.error('Delete error:', error);
      setErrorMessage(error.response?.data?.message || 'Error al eliminar grupo');
    } finally {
      setLoading(false); // Dejar de mostrar que está cargando
    }
  };

  // ===== GUARDAR GRUPO (CREAR O EDITAR) =====
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evitar que la página se recargue
    
    // Verificar que el formulario esté completo
    if (!validateForm()) {
      return;
    }

    setLoading(true); // Mostrar que está cargando
    setErrorMessage(''); // Limpiar errores anteriores

    try {
      // Preparar los datos para enviar al servidor
      const grupoData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        roles: formData.roles,
        miembros: formData.miembros
      };

      // Decidir si crear un grupo nuevo o actualizar uno existente
      if (isEditMode) {
        await api.put(`/api/grupos/${editingGrupoId}`, grupoData); // Actualizar
      } else {
        await api.post('/api/grupos', grupoData); // Crear nuevo
      }

      // Si todo salió bien, cerrar el formulario y actualizar la lista
      setIsModalOpen(false);
      setFormData({ nombre: '', descripcion: '', roles: ['general'], miembros: [] });
      fetchGrupos();
      
    } catch (error) {
      console.error('Save error:', {
        error: error.response?.data,
        request: error.config?.data
      });

      // Si el servidor envía errores específicos de validación, mostrarlos
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
      setLoading(false); // Dejar de mostrar que está cargando
    }
  };

  // ===== INTERFAZ DE USUARIO =====
  return (
    <div className="space-y-6 p-4">
      {/* ===== VENTANA EMERGENTE PARA CREAR/EDITAR GRUPOS ===== */}
      <div className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-4xl">
          <h3 className="font-bold text-lg mb-4">
            {isEditMode ? 'Editar Grupo' : 'Crear Nuevo Grupo'}
          </h3>
          
          {/* Mostrar mensaje de error si hay alguno */}
          {errorMessage && (
            <div className="alert alert-error mb-4">
              <div>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Campo: Nombre del Grupo */}
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
                {/* Mostrar error del nombre si existe */}
                {formErrors.nombre && (
                  <span className="text-error text-sm">{formErrors.nombre}</span>
                )}
              </div>

              {/* Campo: Descripción */}
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

              {/* Campo: Roles */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Roles* (separados por comas)</span>
                </label>
                <input
                  type="text"
                  value={formData.roles.join(', ')} // Convertir lista a texto
                  onChange={handleRolesChange}
                  className={`input input-bordered w-full ${
                    formErrors.roles ? 'input-error' : ''
                  }`}
                  placeholder="Ej: general, admin"
                />
                {/* Mostrar error de roles si existe */}
                {formErrors.roles && (
                  <span className="text-error text-sm">{formErrors.roles}</span>
                )}
                {/* Mostrar los roles como etiquetas */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {formData.roles.map((rol, i) => (
                    <span key={i} className="badge badge-outline">
                      {rol}
                    </span>
                  ))}
                </div>
              </div>

              {/* Campo: Miembros */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Miembros</span>
                </label>
                {/* Lista de selección múltiple de usuarios */}
                <select
                  multiple
                  className="select select-bordered w-full h-32"
                  value={formData.miembros}
                  onChange={(e) => {
                    // Obtener todos los usuarios seleccionados
                    const selected = Array.from(e.target.selectedOptions, opt => opt.value);
                    setFormData(prev => ({ ...prev, miembros: selected }));
                  }}
                >
                  {/* Mostrar cada usuario disponible */}
                  {usersData.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                {/* Mostrar miembros seleccionados como etiquetas */}
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

            {/* Botones del formulario */}
            <div className="modal-action mt-6">
              {/* Botón de eliminar (solo en modo edición) */}
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
              
              {/* Botón de cancelar */}
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
              
              {/* Botón de guardar */}
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

      {/* ===== CONTENIDO PRINCIPAL DE LA PÁGINA ===== */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          
          {/* Barra superior con búsqueda y botón de nuevo grupo */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            
            {/* Campo de búsqueda */}
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

            {/* Botón para crear nuevo grupo */}
            <button
              className="btn btn-outline w-full md:w-auto"
              onClick={() => {
                // Preparar formulario para crear nuevo grupo
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

          {/* Mostrar error general si hay alguno */}
          {errorMessage && !isModalOpen && (
            <div className="alert alert-error mb-4">
              <div>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* ===== TABLA DE GRUPOS ===== */}
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
                {/* Mostrar grupos filtrados o mensaje si no hay ninguno */}
                {filteredGrupos.length > 0 ? (
                  filteredGrupos.map(grupo => (
                    <tr key={grupo._id}>
                      {/* Nombre del grupo */}
                      <td className="font-medium">{grupo.nombre}</td>
                      
                      {/* Descripción del grupo */}
                      <td>{grupo.descripcion || '-'}</td>
                      
                      {/* Roles como etiquetas */}
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {grupo.roles?.map((rol, i) => (
                            <span key={i} className="badge badge-outline">
                              {rol}
                            </span>
                          ))}
                        </div>
                      </td>
                      
                      {/* Miembros como etiquetas */}
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {grupo.miembros?.map(miembro => {
                            // Obtener el ID del miembro (puede ser objeto o string)
                            const id = typeof miembro === 'string' ? miembro : miembro._id;
                            // Buscar el usuario correspondiente
                            const user = usersData.find(u => u._id === id);
                            return (
                              <span key={id} className="badge badge-primary">
                                {user?.name || id}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      
                      {/* Botón de editar */}
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
                  /* Mensaje cuando no hay grupos para mostrar */
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