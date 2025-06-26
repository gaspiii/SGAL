// src/components/tabs/TabHome.jsx
import React, { useState, useEffect } from 'react'
import {
  BarChart2, FileCheck, AlertCircle, DollarSign,
  ClipboardList, Download, CheckCircle, Circle, ChevronRight, Search, Filter, MoreHorizontal
} from 'lucide-react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Bar,
  BarChart, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'
import { motion } from 'framer-motion'
import { DatePicker, Badge } from 'antd'
import 'antd/dist/reset.css'
import { solicitudService } from '../../api/services.js'

const cotizacionesData = [
  { name: 'Ene', value: 15 },
  { name: 'Feb', value: 22 },
  { name: 'Mar', value: 9 },
  { name: 'Abr', value: 18 },
  { name: 'May', value: 26 },
]

const facturacionData = [
  { name: 'Pendientes', value: 6 },
  { name: 'Vencidas', value: 2 },
  { name: 'Emitidas', value: 9 },
  { name: 'Sin factura', value: 3 },
]

const facturacionColors = ['#facc15', '#ef4444', '#10b981', '#a3a3a3']
const niveles = {
  imprescindible: { color: 'error', icon: <AlertCircle className="w-4 h-4" /> },
  importante: { color: 'warning', icon: <Circle className="w-4 h-4" /> },
  leve: { color: 'success', icon: <CheckCircle className="w-4 h-4" /> },
}

const objetivos = [
  { id: 1, texto: 'Revisión técnica de proyecto A', nivel: 'imprescindible' },
  { id: 2, texto: 'Reunión con supervisor B', nivel: 'importante' },
  { id: 3, texto: 'Completar informe semanal', nivel: 'leve' },
  { id: 4, texto: 'Actualizar documentos internos', nivel: 'leve' },
  { id: 5, texto: 'Verificar muestras de laboratorio', nivel: 'importante' },
  { id: 6, texto: 'Preparar presentación mensual', nivel: 'imprescindible' },
]

const TabHome = () => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSolicitudes();
  }, []);

  const loadSolicitudes = async () => {
    setLoading(true);
    try {
      const response = await solicitudService.getSolicitudes();
      setSolicitudes(response.solicitudes || []);
    } catch (error) {
      // Manejo de errores opcional
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-center gap-10">


        {/* Solicitudes Cotizaciones */}
        <motion.div className="card bg-base-100 shadow-xl" whileHover={{ scale: 1.02 }}>
          <div className="card-body">
            <h2 className="card-title"><BarChart2 className="w-5 h-5" /> Solicitudes</h2>
            <DatePicker.RangePicker onChange={(dates) => {
              setStartDate(dates?.[0]);
              setEndDate(dates?.[1]);
            }} className="mb-2" />
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={cotizacionesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Cotizaciones Aprobadas */}
        <motion.div className="card bg-base-100 shadow-xl" whileHover={{ scale: 1.02 }}>
          <div className="card-body">
            <h2 className="card-title"><FileCheck className="w-5 h-5" /> Aprobadas</h2>
            <DatePicker.RangePicker className="mb-2" />
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={cotizacionesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Probetas H.F */}
        <motion.div className="card bg-base-100 shadow-xl text-center  " whileHover={{ scale: 1.02 }}>
          <div className="card-body">
            <h2 className="card-title justify-center"><AlertCircle className="w-5 h-5" /> Probetas H.F</h2>
            <p className="text-4xl font-bold text-primary">12</p>
            <button className="btn btn-outline btn-error btn-sm mt-3">
              <Download className="w-4 h-4 mr-1" /> Descargar detalle
            </button>
          </div>
        </motion.div>

        {/* Facturación */}
        <motion.div className="card bg-base-100 shadow-xl" whileHover={{ scale: 1.02 }}>
  <div className="card-body w-full">
    <h2 className="card-title"><DollarSign className="w-5 h-5" /> Facturación</h2>

    <ResponsiveContainer width="100%" height={150}>
      <PieChart>
        <Pie
          label
          data={facturacionData}
          dataKey="value"
          innerRadius={15}
          outerRadius={50}
        >
          {facturacionData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={facturacionColors[index % facturacionColors.length]}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>

    {/* Leyenda personalizada */}
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {facturacionData.map((entry, index) => (
        <div key={index} className="flex items-center space-x-2 text-sm">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: facturacionColors[index % facturacionColors.length] }}
          />
          <span>{entry.name}</span>
        </div>
      ))}
    </div>
  </div>
</motion.div>


        {/* Objetivos */}
        <motion.div className="card bg-base-100 shadow-xl" whileHover={{ scale: 1.02 }}>
          <div className="card-body">
            <h2 className="card-title"><ClipboardList className="w-5 h-5" /> Objetivos</h2>
            <ul className="space-y-2 text-sm max-h-36 overflow-y-auto">
              {objetivos.slice(0, 5).map((obj) => (
                <li key={obj.id} className={`alert alert-${niveles[obj.nivel].color} flex items-center justify-between`}>
                  <span className="flex items-center gap-2">
                    {niveles[obj.nivel].icon} {obj.texto} 
                  </span>
                  <button className="btn btn-xs btn-outline">Finalizar</button>
                </li>
              ))}
            </ul>
            <div className="mt-3 text-center">
              <div className="join">
                <button className="join-item btn btn-sm">«</button>
                <button className="join-item btn btn-sm btn-active">1</button>
                <button className="join-item btn btn-sm">2</button>
                <button className="join-item btn btn-sm">»</button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabla inferior */}
      <motion.div 
        className="card bg-base-100 shadow-lg border border-base-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="card-body p-0">
          <div className="flex justify-between items-center p-4 border-b border-base-200">
            <h2 className="card-title text-lg">Solicitudes de Cotización</h2>
            <div className="flex justify-between items-center gap-2">
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
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="bg-base-200">
                  <th>Solicitante</th>
                  <th>Correo</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Obra</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">Cargando solicitudes...</td>
                  </tr>
                ) : solicitudes.map((solicitud) => (
                  <motion.tr 
                    key={solicitud._id}
                    whileHover={{ backgroundColor: 'rgba(243, 244, 246, 0.5)' }}
                    transition={{ duration: 0.2 }}
                  >
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-8 h-8 flex items-center justify-center">
                            <span className="text-md">
                              {solicitud.nombreContacto ? solicitud.nombreContacto.split(' ').map(n => n[0]).join('') : '?'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{solicitud.nombreContacto || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{solicitud.cargo || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm">{solicitud.email || 'N/A'}</td>
                    <td className="text-sm">{solicitud.createdAt ? new Date(solicitud.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <Badge 
                        status={
                          solicitud.status === 'aprobado' ? 'success' : 
                          solicitud.status === 'pendiente' ? 'warning' : 'error'
                        } 
                        text={solicitud.status || 'N/A'}
                      />
                    </td>
                    <td className="text-sm">{solicitud.nombreObra || 'N/A'}</td>
                    <td>
                      <div className="flex gap-1">
                        <button className="btn btn-xs btn-outline">Revisar</button>
                        <button className="btn btn-xs btn-ghost">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center p-4 border-t border-base-200">
            <div className="text-sm text-gray-500">
              Mostrando 1 al {solicitudes.length} de {solicitudes.length} registros
            </div>
            <div className="join">
              <button className="join-item btn btn-sm">«</button>
              <button className="join-item btn btn-sm btn-active">1</button>
              <button className="join-item btn btn-sm">2</button>
              <button className="join-item btn btn-sm">»</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default TabHome