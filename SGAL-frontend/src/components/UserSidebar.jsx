import React, { useState } from 'react';
import { UserCircle, ChevronDown, ChevronRight } from 'lucide-react';

const UserSidebar = ({ activeTab, setActiveTab, activeSubTab, setActiveSubTab }) => {
  const [isQuotesOpen, setIsQuotesOpen] = useState(false);

  const tabs = [
    { id: 'home', label: 'Inicio' },
    { 
      id: 'quotes', 
      label: 'Cotizaciones',
      subtabs: [
        { id: 'quotations', label: 'Cotizaciones' },
        { id: 'requests', label: 'Solicitudes' }
      ]
    },
    { id: 'settings', label: 'Configuración' },
  ];

  const toggleQuotesDropdown = () => {
    setIsQuotesOpen(!isQuotesOpen);
    if (!isQuotesOpen) {
      setActiveTab('quotes');
      setActiveSubTab('quotations');
    }
  };

  return (
    <aside className="w-64 bg-base-100 shadow-lg flex flex-col justify-between">
      <div>
        <div className="p-6 flex items-center space-x-3 border-b border-base-300">
          <UserCircle className="w-8 h-8 text-primary" />
          <span className="font-semibold text-lg">Admin</span>
        </div>
        <nav className="menu p-4">
          {tabs.map((tab) => (
            <div key={tab.id}>
              {tab.subtabs ? (
                <>
                  <button
                    onClick={toggleQuotesDropdown}
                    className={`btn btn-ghost justify-between w-full text-left mb-1 ${
                      activeTab === tab.id ? 'bg-base-200 text-primary font-bold' : ''
                    }`}
                  >
                    <span>{tab.label}</span>
                    {isQuotesOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  {isQuotesOpen && (
                    <div className="ml-4 space-y-1">
                      {tab.subtabs.map((subtab) => (
                        <button
                          key={subtab.id}
                          onClick={() => setActiveSubTab(subtab.id)}
                          className={`btn btn-ghost justify-start w-full text-left text-sm ${
                            activeSubTab === subtab.id ? 'bg-base-200 text-primary font-bold' : ''
                          }`}
                        >
                          {subtab.label}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setActiveSubTab(null);
                  }}
                  className={`btn btn-ghost justify-start w-full text-left mb-1 ${
                    activeTab === tab.id ? 'bg-base-200 text-primary font-bold' : ''
                  }`}
                >
                  {tab.label}
                </button>
              )}
            </div>
          ))}
        </nav>
      </div>
      <div className="p-4 text-xs text-gray-400">
        © 2025 - S.G.A.L. Todos los derechos reservados.
      </div>
    </aside>
  );
};

export default UserSidebar;