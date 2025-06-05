
import React, { useState } from 'react';
import { Search, Filter, Plus, MoreHorizontal, Users } from 'lucide-react';

const groupsData = [
  { id: 1, name: 'Administradores', description: 'Acceso completo al sistema', members: 3, createdAt: '2025-01-15' },
  { id: 2, name: 'Editores', description: 'Pueden crear y editar contenido', members: 5, createdAt: '2025-02-20' },
  { id: 3, name: 'Visualizadores', description: 'Solo pueden ver contenido', members: 12, createdAt: '2025-03-10' },
  { id: 4, name: 'Clientes', description: 'Acceso limitado a áreas específicas', members: 8, createdAt: '2025-04-05' },
  { id: 5, name: 'Técnicos', description: 'Acceso a herramientas técnicas', members: 6, createdAt: '2025-05-18' },
];

const TabGroups = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGroups = groupsData.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body p-0">
          <div className="flex justify-between items-center p-4 border-b border-base-200">
            <h2 className="card-title text-lg">Grupos</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Buscar grupos..." 
                  className="input input-sm input-bordered pl-9 pr-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn btn-sm btn-outline">
                <Filter className="w-4 h-4 mr-1" /> Filtros
              </button>
              <button className="btn btn-sm btn-primary">
                <Plus className="w-4 h-4 mr-1" /> Nuevo grupo
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="bg-base-200">
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Miembros</th>
                  <th>Creado el</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredGroups.map((group) => (
                  <tr key={group.id} className="hover:bg-base-200">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-8 h-8">
                            <Users className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="font-bold">{group.name}</div>
                      </div>
                    </td>
                    <td>{group.description}</td>
                    <td>
                      <span className="badge badge-neutral">{group.members} miembros</span>
                    </td>
                    <td>{group.createdAt}</td>
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
              Mostrando 1 al {filteredGroups.length} de {filteredGroups.length} registros
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

export default TabGroups;