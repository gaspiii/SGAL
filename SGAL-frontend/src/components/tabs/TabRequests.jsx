import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Search, Filter, FileText, Plus, Download, MoreHorizontal } from 'lucide-react';

const requestsData = [
  { id: 1, solicitante: 'Juan Pérez', obra: 'Edificio Corporativo', fecha: '2025-05-20', estatus: 'Pendiente', prioridad: 'Alta' },
  { id: 2, solicitante: 'María González', obra: 'Puente Río Claro', fecha: '2025-05-18', estatus: 'En revisión', prioridad: 'Media' },
  { id: 3, solicitante: 'Carlos Fuentes', obra: 'Centro Comercial Norte', fecha: '2025-05-15', estatus: 'Completada', prioridad: 'Baja' },
  { id: 4, solicitante: 'Ana Silva', obra: 'Condominio Las Lomas', fecha: '2025-05-10', estatus: 'Pendiente', prioridad: 'Alta' },
  { id: 5, solicitante: 'Pedro Rojas', obra: 'Hospital Regional', fecha: '2025-05-05', estatus: 'Rechazada', prioridad: 'Media' },
];

const requestsByMonthData = [
  { name: 'Ene', solicitudes: 8, completadas: 5 },
  { name: 'Feb', solicitudes: 12, completadas: 9 },
  { name: 'Mar', solicitudes: 5, completadas: 4 },
  { name: 'Abr', solicitudes: 10, completadas: 7 },
  { name: 'May', solicitudes: 15, completadas: 10 },
];

const requestsByStatusData = [
  { name: 'Pendientes', value: 35 },
  { name: 'En revisión', value: 25 },
  { name: 'Completadas', value: 30 },
  { name: 'Rechazadas', value: 10 },
];

const STATUS_COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#EF4444'];

const RequestForm = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    solicitante: '',
    obra: '',
    descripcion: '',
    prioridad: 'Media',
    archivos: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para enviar la solicitud
    alert('Solicitud creada exitosamente!');
    onCancel();
  };

  return (
    <div className="bg-white shadow-lg rounded-lg mb-6">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Nueva Solicitud de Cotización</h2>
        <div onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Solicitante
            </label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={formData.solicitante}
              onChange={(e) => setFormData({...formData, solicitante: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Obra/Proyecto
            </label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={formData.obra}
              onChange={(e) => setFormData({...formData, obra: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea 
              className="w-full px-3 py-2 border border-gray-300 rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              required
            />
          </div>

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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Archivos adjuntos
            </label>
            <input 
              type="file" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              onChange={(e) => setFormData({...formData, archivos: e.target.files})}
              multiple
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button type="button" className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300" onClick={onCancel}>
              Cancelar
            </button>
            <button onClick={handleSubmit} className="px-4 py-2  border border-red-500 rounded-md hover:bg-red-50">
              Enviar Solicitud
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TabRequests = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      {showForm ? (
        <RequestForm onCancel={() => setShowForm(false)} />
      ) : (
        <div className="flex justify-center mb-6">
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center px-6 py-3  border border-red-500 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" /> Crear Nueva Solicitud
          </button>
        </div>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de barras - Solicitudes mensuales */}
        <div className="bg-white shadow-lg rounded-lg">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Solicitudes Mensuales</h2>
            <div className="mb-4">
              <input 
                type="date" 
                className="px-3 py-2 border border-gray-300 rounded-md mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input 
                type="date" 
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={requestsByMonthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="solicitudes" fill="#3B82F6" name="Total Solicitudes" />
                <Bar dataKey="completadas" fill="#10B981" name="Completadas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de torta - Distribución por estado */}
        <div className="bg-white shadow-lg rounded-lg">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Distribución por Estado</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={requestsByStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {requestsByStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
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
                  className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitante</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Obra/Proyecto</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ESTATUS</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OPCIONES</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requestsData.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.id}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{request.solicitante}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{request.obra}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{request.fecha}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        request.prioridad === 'Alta' ? 'bg-red-100 text-red-800' :
                        request.prioridad === 'Media' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {request.prioridad}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                        request.estatus === 'Completada' ? 'bg-green-100 text-green-800' :
                        request.estatus === 'En revisión' ? 'bg-blue-100 text-blue-800' :
                        request.estatus === 'Rechazada' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.estatus === 'En revisión' && <div className="w-2 h-2 bg-blue-400 rounded-full mr-1 animate-pulse"></div>}
                        {request.estatus}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-1">
                        <button className="flex items-center px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">
                          <FileText className="w-3 h-3 mr-1" /> Detalle
                        </button>
                        <button className="flex items-center px-2 py-1 text-xs text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center p-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Mostrando 1 al {requestsData.length} de {requestsData.length} registros
            </div>
            <div className="flex">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-l-md hover:bg-gray-50">«</button>
              <button className="px-3 py-1 text-sm border-t border-b border-gray-300 bg-blue-50 text-blue-600">1</button>
              <button className="px-3 py-1 text-sm border border-gray-300 hover:bg-gray-50">2</button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-r-md hover:bg-gray-50">»</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabRequests;