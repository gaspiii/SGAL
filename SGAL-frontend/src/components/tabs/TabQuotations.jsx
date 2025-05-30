import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Search, Filter, FileText, Plus, Download, MoreHorizontal } from 'lucide-react';
import { Badge, DatePicker } from 'antd';
import 'antd/dist/reset.css';

const quotationsData = [
  { id: 1, rut: '12.345.678-9', razonSocial: 'Constructora Altamira S.A.', fechaIngreso: '2025-05-15', registradoPor: 'Juan Pérez', estatus: 'Aprobada' },
  { id: 2, rut: '98.765.432-1', razonSocial: 'Ingeniería y Proyectos Ltda.', fechaIngreso: '2025-05-10', registradoPor: 'María González', estatus: 'Pendiente' },
  { id: 3, rut: '23.456.789-0', razonSocial: 'Edificaciones Modernas S.A.', fechaIngreso: '2025-05-05', registradoPor: 'Carlos Fuentes', estatus: 'Rechazada' },
  { id: 4, rut: '34.567.890-1', razonSocial: 'Constructora del Pacífico', fechaIngreso: '2025-04-28', registradoPor: 'Ana Silva', estatus: 'Aprobada' },
  { id: 5, rut: '45.678.901-2', razonSocial: 'Inmobiliaria Central S.A.', fechaIngreso: '2025-04-20', registradoPor: 'Pedro Rojas', estatus: 'Pendiente' },
];

const monthlyQuotesData = [
  { name: 'Ene', cotizaciones: 15, aprobadas: 10 },
  { name: 'Feb', cotizaciones: 22, aprobadas: 18 },
  { name: 'Mar', cotizaciones: 9, aprobadas: 7 },
  { name: 'Abr', cotizaciones: 18, aprobadas: 12 },
  { name: 'May', cotizaciones: 26, aprobadas: 20 },
];

const statusDistributionData = [
  { name: 'Aprobadas', value: 45 },
  { name: 'Pendientes', value: 30 },
  { name: 'Rechazadas', value: 25 },
];

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

const TabQuotations = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <div className="space-y-6">
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de barras - Cotizaciones mensuales */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Cotizaciones Mensuales</h2>
            <DatePicker.RangePicker 
              onChange={(dates) => {
                setStartDate(dates?.[0]);
                setEndDate(dates?.[1]);
              }} 
              className="mb-4"
            />
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyQuotesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cotizaciones" fill="#3B82F6" name="Total Cotizaciones" />
                <Bar dataKey="aprobadas" fill="#10B981" name="Aprobadas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de torta - Distribución por estado */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Distribución por Estado</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabla de cotizaciones */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body p-0">
          <div className="flex justify-between items-center p-4 border-b border-base-200">
            <h2 className="card-title text-lg">Listado de Cotizaciones</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  className="input input-sm input-bordered pl-9 pr-4"
                />
              </div>
              <button className="btn btn-sm btn-outline">
                <Filter className="w-4 h-4 mr-1" /> Filtros
              </button>
              <button className="btn btn-sm  btn-outline">
                <Download className="w-4 h-4 mr-1 " /> Exportar
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="bg-base-200">
                  <th>ID</th>
                  <th>RUT</th>
                  <th>RAZÓN SOCIAL</th>
                  <th>Ingresado el</th>
                  <th>Registrado por</th>
                  <th>ESTATUS</th>
                  <th>OPCIONES</th>
                </tr>
              </thead>
              <tbody>
                {quotationsData.map((quote) => (
                  <tr key={quote.id} className="hover:bg-base-200">
                    <td className="font-medium">{quote.id}</td>
                    <td>{quote.rut}</td>
                    <td>{quote.razonSocial}</td>
                    <td>{quote.fechaIngreso}</td>
                    <td>{quote.registradoPor}</td>
                    <td>
                      <Badge 
                        status={
                          quote.estatus === 'Aprobada' ? 'success' : 
                          quote.estatus === 'Pendiente' ? 'warning' : 'error'
                        } 
                        text={quote.estatus}
                      />
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button className="btn btn-xs btn-outline">
                          <FileText className="w-3 h-3 mr-1" /> Detalle
                        </button>
                        <button className="btn btn-xs btn-ghost">
                          <MoreHorizontal className="w-3 h-3" />
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
              Mostrando 1 al {quotationsData.length} de {quotationsData.length} registros
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

export default TabQuotations;