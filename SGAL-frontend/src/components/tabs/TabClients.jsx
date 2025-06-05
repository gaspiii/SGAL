// src/components/tabs/TabClients.jsx
import React, { useState } from 'react';
import { Search, Filter, Plus, MoreHorizontal, Briefcase } from 'lucide-react';
import { Badge } from 'antd';

const clientsData = [
  { id: 1, name: 'Constructora Altamira S.A.', rut: '12.345.678-9', contact: 'Juan Pérez', email: 'juan.perez@altamira.com', status: 'active' },
  { id: 2, name: 'Ingeniería y Proyectos Ltda.', rut: '98.765.432-1', contact: 'María González', email: 'maria.gonzalez@inypro.com', status: 'active' },
  { id: 3, name: 'Edificaciones Modernas S.A.', rut: '23.456.789-0', contact: 'Carlos Fuentes', email: 'carlos.fuentes@emodernas.com', status: 'inactive' },
  { id: 4, name: 'Constructora del Pacífico', rut: '34.567.890-1', contact: 'Ana Silva', email: 'ana.silva@cpacifico.com', status: 'active' },
  { id: 5, name: 'Inmobiliaria Central S.A.', rut: '45.678.901-2', contact: 'Pedro Rojas', email: 'pedro.rojas@inmocentral.com', status: 'pending' },
];

const TabClients = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clientsData.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body p-0">
          <div className="flex justify-between items-center p-4 border-b border-base-200">
            <h2 className="card-title text-lg">Clientes</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Buscar clientes..." 
                  className="input input-sm input-bordered pl-9 pr-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn btn-sm btn-outline">
                <Filter className="w-4 h-4 mr-1" /> Filtros
              </button>
              <button className="btn btn-sm btn-primary">
                <Plus className="w-4 h-4 mr-1" /> Nuevo cliente
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="bg-base-200">
                  <th>Nombre/Razón Social</th>
                  <th>RUT</th>
                  <th>Contacto</th>
                  <th>Correo electrónico</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-base-200">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-8 h-8">
                            <Briefcase className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="font-bold">{client.name}</div>
                      </div>
                    </td>
                    <td>{client.rut}</td>
                    <td>{client.contact}</td>
                    <td>{client.email}</td>
                    <td>
                      <Badge 
                        status={
                          client.status === 'active' ? 'success' : 
                          client.status === 'inactive' ? 'error' : 'warning'
                        } 
                        text={client.status === 'active' ? 'Activo' : client.status === 'inactive' ? 'Inactivo' : 'Pendiente'}
                      />
                    </td>
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
              Mostrando 1 al {filteredClients.length} de {filteredClients.length} registros
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

export default TabClients;