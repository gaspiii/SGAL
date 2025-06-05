import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Search, Filter, FileText, Plus, Download, MoreHorizontal } from 'lucide-react';

const STATUS_COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#EF4444'];

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
    alert('Solicitud creada exitosamente!');
    onCancel();
  };

  return (
      <div className="bg-white shadow-lg rounded-lg mb-6">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Nueva Solicitud de Cotización</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Solicitante</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.solicitante} onChange={(e) => setFormData({ ...formData, solicitante: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Obra/Proyecto</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.obra} onChange={(e) => setFormData({ ...formData, obra: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md h-24" value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Prioridad</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formData.prioridad} onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Archivos adjuntos</label>
              <input type="file" className="w-full px-3 py-2 border border-gray-300 rounded-md" onChange={(e) => setFormData({ ...formData, archivos: e.target.files })} multiple />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button type="button" className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md" onClick={onCancel}>Cancelar</button>
              <button type="submit" className="px-4 py-2 border border-red-500 rounded-md hover:bg-red-50">Enviar Solicitud</button>
            </div>
          </form>
        </div>
      </div>
  );
};

const TabRequests = () => {
  const [requestsData, setRequestsData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/solicitudCotizacion/public");
        if (!res.ok) throw new Error("Error al obtener las solicitudes");
        const data = await res.json();

        const formattedData = data.map((item, index) => ({
          id: index + 1,
          solicitante: item.solicitante,
          obra: item.obra,
          fecha: new Date(item.createdAt).toISOString().split("T")[0],
          estatus: item.estado.charAt(0).toUpperCase() + item.estado.slice(1),
          prioridad: "Media"
        }));

        setRequestsData(formattedData);
      } catch (err) {
        console.error("Error al cargar las solicitudes:", err.message);
      }
    };

    fetchRequests();
  }, []);

  return (
      <div className="space-y-6">
        {showForm ? (
            <RequestForm onCancel={() => setShowForm(false)} />
        ) : (
            <div className="flex justify-center mb-6">
              <button onClick={() => setShowForm(true)} className="flex items-center px-6 py-3 border border-red-500 rounded-lg hover:bg-red-50">
                <Plus className="w-4 h-4 mr-2" /> Crear Nueva Solicitud
              </button>
            </div>
        )}

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Solicitudes Mensuales</h2>
            <div className="mb-4">
              <input type="date" className="px-3 py-2 border border-gray-300 rounded-md mr-2" onChange={(e) => setStartDate(e.target.value)} />
              <input type="date" className="px-3 py-2 border border-gray-300 rounded-md" onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={requestsByMonthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="solicitudes" fill="#3B82F6" />
                <Bar dataKey="completadas" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Distribución por Estado</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                    data={requestsByStatusData}
                    cx="50%"
                    cy="50%"
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

        {/* Tabla */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <div className="flex justify-between items-center border-b pb-3 mb-3">
            <h2 className="text-lg font-bold">Listado de Solicitudes</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Buscar..." className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md" />
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
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Solicitante</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Obra/Proyecto</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Fecha</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Prioridad</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Estatus</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Opciones</th>
              </tr>
              </thead>
              <tbody className="bg-white divide-y">
              {requestsData.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">{req.id}</td>
                    <td className="px-4 py-4">{req.solicitante}</td>
                    <td className="px-4 py-4">{req.obra}</td>
                    <td className="px-4 py-4">{req.fecha}</td>
                    <td className="px-4 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        req.prioridad === 'Alta' ? 'bg-red-100 text-red-800' :
                            req.prioridad === 'Media' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>{req.prioridad}</span>
                    </td>
                    <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                        req.estatus === 'Completada' ? 'bg-green-100 text-green-800' :
                            req.estatus === 'En revisión' ? 'bg-blue-100 text-blue-800' :
                                req.estatus === 'Rechazada' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {req.estatus === 'En revisión' && <div className="w-2 h-2 bg-blue-400 rounded-full mr-1 animate-pulse"></div>}
                      {req.estatus}
                    </span>
                    </td>
                    <td className="px-4 py-4">
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
        </div>
      </div>
  );
};

export default TabRequests;