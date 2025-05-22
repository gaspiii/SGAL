import React from 'react'
import { UserCircle } from 'lucide-react'

const UserSidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'Inicio' },
    { id: 'settings', label: 'Configuración' },
    // Puedes agregar más tabs aquí
  ]

  return (
    <aside className="w-64 bg-base-100 shadow-lg flex flex-col justify-between">
      <div>
        <div className="p-6 flex items-center space-x-3 border-b border-base-300">
          <UserCircle className="w-8 h-8 text-primary" />
          <span className="font-semibold text-lg">Admin</span>
        </div>
        <nav className="menu p-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn btn-ghost justify-start w-full text-left mb-1 ${
                activeTab === tab.id ? 'bg-base-200 text-primary font-bold' : ''
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-4 text-xs text-gray-400">
        © 2025 - S.G.A.L. Todos los derechos reservados.
      </div>
    </aside>
  )
}

export default UserSidebar
