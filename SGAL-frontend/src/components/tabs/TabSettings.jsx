import React, { useState } from 'react'
import { Settings, Monitor, Palette, Bell, Shield, Database, Code, Info } from 'lucide-react'

const TabSettings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    autoUpdates: true,
    analytics: false,
    developerMode: false,
    uiDensity: 'normal',
    language: 'es',
    version: '1.2.3'
  })

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const renderSettingsContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center">
                  <Palette className="mr-2" size={18} />
                  Tema de la interfaz
                </span>
              </label>
              <div className="flex gap-2">
                <button
                  className={`btn btn-outline ${settings.theme === 'light' ? 'btn-active' : ''}`}
                  onClick={() => handleSettingChange('theme', 'light')}
                >
                  Claro
                </button>
                <button
                  className={`btn btn-outline ${settings.theme === 'dark' ? 'btn-active' : ''}`}
                  onClick={() => handleSettingChange('theme', 'dark')}
                >
                  Oscuro
                </button>
                <button
                  className={`btn btn-outline ${settings.theme === 'system' ? 'btn-active' : ''}`}
                  onClick={() => handleSettingChange('theme', 'system')}
                >
                  Sistema
                </button>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center">
                  <Monitor className="mr-2" size={18} />
                  Densidad de la interfaz
                </span>
              </label>
              <div className="flex gap-2">
                <button
                  className={`btn btn-outline ${settings.uiDensity === 'compact' ? 'btn-active' : ''}`}
                  onClick={() => handleSettingChange('uiDensity', 'compact')}
                >
                  Compacta
                </button>
                <button
                  className={`btn btn-outline ${settings.uiDensity === 'normal' ? 'btn-active' : ''}`}
                  onClick={() => handleSettingChange('uiDensity', 'normal')}
                >
                  Normal
                </button>
                <button
                  className={`btn btn-outline ${settings.uiDensity === 'spacious' ? 'btn-active' : ''}`}
                  onClick={() => handleSettingChange('uiDensity', 'spacious')}
                >
                  Amplia
                </button>
              </div>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text flex items-center">
                  <Bell className="mr-2" size={18} />
                  Notificaciones del sistema
                </span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={settings.notifications}
                  onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                />
              </label>
            </div>
          </div>
        )
      case 'security':
        return (
          <div className="space-y-6">
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text flex items-center">
                  <Shield className="mr-2" size={18} />
                  Actualizaciones automáticas
                </span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={settings.autoUpdates}
                  onChange={(e) => handleSettingChange('autoUpdates', e.target.checked)}
                />
              </label>
              <div className="text-sm text-base-content/60 mt-1">
                Mantén tu software siempre actualizado con las últimas mejoras de seguridad.
              </div>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text flex items-center">
                  <Database className="mr-2" size={18} />
                  Compartir datos de uso
                </span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={settings.analytics}
                  onChange={(e) => handleSettingChange('analytics', e.target.checked)}
                />
              </label>
              <div className="text-sm text-base-content/60 mt-1">
                Ayúdanos a mejorar el software compartiendo datos de uso anónimos.
              </div>
            </div>
          </div>
        )
      case 'advanced':
        return (
          <div className="space-y-6">
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text flex items-center">
                  <Code className="mr-2" size={18} />
                  Modo desarrollador
                </span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={settings.developerMode}
                  onChange={(e) => handleSettingChange('developerMode', e.target.checked)}
                />
              </label>
              <div className="text-sm text-base-content/60 mt-1">
                Activa herramientas adicionales para desarrolladores.
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center">
                  <Info className="mr-2" size={18} />
                  Versión del software
                </span>
              </label>
              <div className="p-3 bg-base-200 rounded-lg">
                <div className="font-mono">{settings.version}</div>
                <button className="btn btn-outline btn-sm mt-2">
                  Buscar actualizaciones
                </button>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Settings className="mr-2 text-primary" size={24} />
        <h2 className="text-2xl font-bold">Configuración del Software</h2>
      </div>
      
      <p className="text-base-content/80 mb-8">
        Personaliza el comportamiento y apariencia del sistema según tus preferencias.
      </p>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Navegación lateral */}
        <div className="w-full md:w-64">
          <ul className="menu w-full  bg-base-100 rounded-box">
            <li>
              <button
                className={`flex items-center ${activeTab === 'general' ? 'active' : ''}`}
                onClick={() => setActiveTab('general')}
              >
                <Monitor className="mr-2" size={18} />
                Interfaz
              </button>
            </li>
            <li>
              <button
                className={`flex items-center ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <Shield className="mr-2" size={18} />
                Seguridad
              </button>
            </li>
            <li>
              <button
                className={`flex items-center ${activeTab === 'advanced' ? 'active' : ''}`}
                onClick={() => setActiveTab('advanced')}
              >
                <Code className="mr-2" size={18} />
                Avanzado
              </button>
            </li>
          </ul>
        </div>

        {/* Contenido de configuración */}
        <div className="flex-1 bg-base-100 p-6 rounded-box shadow-sm">
          {renderSettingsContent()}
        </div>
      </div>
    </div>
  )
}

export default TabSettings