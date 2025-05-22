import React from 'react'
import { Settings } from 'lucide-react'

const TabSettings = () => {
  return (
    <div>
      <div className="flex items-center mb-4">
        <Settings className="mr-2 text-primary" />
        <h2 className="text-2xl font-bold">Configuración</h2>
      </div>
      <p className="text-base-content/80">
        Desde aquí podrás ajustar las preferencias del sistema, los datos del usuario y otras configuraciones generales.
      </p>
    </div>
  )
}

export default TabSettings
