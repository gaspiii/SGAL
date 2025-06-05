import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, MoreHorizontal, User, X, Check } from 'lucide-react';
import { Badge, Modal, message } from 'antd';
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    cargo: '',
    iniciales: '',
    username: ''
  });

  // Obtener usuarios al cargar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/auth/users');
      setUsersData(response.data);
    } catch (error) {
      message.error('Error al cargar los usuarios');
      console.error('Error fetching users:', error);
    }
  };

  const filteredUsers = usersData.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Generar iniciales automáticamente cuando se escribe el nombre
    if (name === 'name') {
      const initials = value.split(' ').map(n => n[0]).join('').toUpperCase();
      setFormData(prev => ({
        ...prev,
        iniciales: initials.substring(0, 2)
      }));
    }

    // Generar username automáticamente cuando se escribe el email
    if (name === 'email') {
      const usernamePart = value.split('@')[0];
      setFormData(prev => ({
        ...prev,
        username: usernamePart || ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/auth/register', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      message.success('Usuario creado correctamente');
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
      fetchUsers(); // Refrescar la lista de usuarios
    } catch (error) {
      console.error('Error creating user:', error);
      message.error(error.response?.data?.message || 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Modal para crear usuario */}
      <Modal
        title="Crear Nuevo Usuario"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nombre Completo</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Correo Electrónico</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Contraseña</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="input input-bordered"
                required
                minLength="6"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Rol</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="select select-bordered w-full"
                required
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
                <option value="editor">Editor</option>
              </select>
            </div>

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

            <div className="form-control">
              <label className="label">
                <span className="label-text">Iniciales</span>
              </label>
              <input
                type="text"
                name="iniciales"
                value={formData.iniciales}
                onChange={handleInputChange}
                className="input input-bordered"
                maxLength="2"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Nombre de Usuario</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="input input-bordered"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-ghost"
              disabled={loading}
            >
              <X className="w-4 h-4 mr-1" /> Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-1" /> Crear Usuario
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Tabla de usuarios */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body p-0">
          <div className="flex justify-between items-center p-4 border-b border-base-200">
            <h2 className="card-title text-lg">Usuarios</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Buscar usuarios..." 
                  className="input input-sm input-bordered pl-9 pr-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn btn-sm btn-outline">
                <Filter className="w-4 h-4 mr-1" /> Filtros
              </button>
              <button 
                className="btn btn-sm btn-primary"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-1" /> Nuevo usuario
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="bg-base-200">
                  <th>Nombre</th>
                  <th>Correo electrónico</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Último acceso</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-base-200">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-8 h-8">
                            <span className="text-xs">{user.iniciales || user.name.split(' ').map(n => n[0]).join('')}</span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{user.name}</div>
                          {user.cargo && <div className="text-xs text-gray-500">{user.cargo}</div>}
                        </div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className="badge">
                        {user.role === 'admin' ? 'Administrador' : 
                         user.role === 'editor' ? 'Editor' : 'Usuario'}
                      </span>
                    </td>
                    <td>
                      <Badge 
                        status={user.status === 'active' ? 'success' : 'error'} 
                        text={user.status === 'active' ? 'Activo' : 'Inactivo'}
                      />
                    </td>
                    <td>{user.lastLogin || 'Nunca'}</td>
                    <td>
                      <div className="flex gap-1">
                        <button className="btn btn-xs btn-outline">Editar</button>
                        <button className="btn btn-xs btn-ghost">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center p-4 border-t border-base-200">
            <div className="text-sm text-gray-500">
              Mostrando 1 al {filteredUsers.length} de {filteredUsers.length} registros
            </div>
            <div className="join">
              <button className="join-item btn btn-sm">«</button>
              <button className="join-item btn btn-sm btn-active">1</button>
              <button className="join-item btn btn-sm">2</button>
              <button className="join-item btn btn-sm">»</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabUsers;