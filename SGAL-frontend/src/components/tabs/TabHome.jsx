// src/components/tabs/TabHome.jsx
import React, { useState } from 'react'
import {
  BarChart2, FileCheck, AlertCircle, DollarSign,
  ClipboardList, Download, CheckCircle, Circle
} from 'lucide-react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Bar,
  BarChart, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'
import { motion } from 'framer-motion'
import { DatePicker } from 'antd'
import 'antd/dist/reset.css'

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

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <p className="text-4xl font-bold text-error">12</p>
            <button className="btn btn-outline btn-error btn-sm mt-3">
              <Download className="w-4 h-4 mr-1" /> Descargar detalle
            </button>
          </div>
        </motion.div>

        {/* Facturación */}
        <motion.div className="card bg-base-100 shadow-xl" whileHover={{ scale: 1.02 }}>
          <div className="card-body">
            <h2 className="card-title"><DollarSign className="w-5 h-5" /> Facturación</h2>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie data={facturacionData} dataKey="value" innerRadius={25} outerRadius={50}>
                  {facturacionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={facturacionColors[index % facturacionColors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
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
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Solicitudes de Cotización</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Solicitante</th>
                  <th>Correo</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Obra</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div>
                      <div className="font-bold">Juan Pérez</div>
                      <div className="text-sm opacity-50">Jefe Técnico</div>
                    </div>
                  </td>
                  <td>jperez@geolab.com</td>
                  <td>2025-05-21</td>
                  <td><span className="badge badge-warning">Pendiente</span></td>
                  <td>Puente Río Claro</td>
                  <td><button className="btn btn-sm btn-outline">Revisar</button></td>
                </tr>
                <tr>
                  <td>
                    <div>
                      <div className="font-bold">Carla Soto</div>
                      <div className="text-sm opacity-50">Ingeniera Civil</div>
                    </div>
                  </td>
                  <td>csoto@geolab.com</td>
                  <td>2025-05-20</td>
                  <td><span className="badge badge-success">Aprobada</span></td>
                  <td>Edificio Central</td>
                  <td><button className="btn btn-sm btn-outline">Revisar</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TabHome