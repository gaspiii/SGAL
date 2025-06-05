// src/components/UserSidebar.jsx
import React from 'react';
import { 
  Home, FileText, FilePlus, Settings, Users, 
  UserPlus, Folder, Briefcase, ChevronDown, 
  ChevronRight, HelpCircle, User, LogOut 
} from 'lucide-react';

const UserSidebar = ({ activeTab, setActiveTab, activeSubTab, setActiveSubTab }) => {
  const isAccountsActive = activeTab === 'accounts';
  const userData = {
    name: "Juan Pérez",
    role: "Administrador"
  };

  return (
    <div className="w-64 bg-base-100 border-r border-base-200 flex flex-col h-full">
      {/* User Profile Section */}
      <div className="p-4 border-b border-base-200">
        <div className="flex items-center gap-3">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-10 h-10">
              <span className="text-lg">JP</span>
            </div>
          </div>
          <div>
            <div className="font-bold">{userData.name}</div>
            <div className="text-xs text-gray-500">{userData.role}</div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Home */}
        <button
          className={`btn btn-ghost justify-start w-full ${activeTab === 'home' ? 'btn-active' : ''}`}
          onClick={() => {
            setActiveTab('home');
            setActiveSubTab(null);
          }}
        >
          <Home className="w-5 h-5" />
          <span>Inicio</span>
        </button>

        {/* Quotes */}
        <div className="dropdown dropdown-end w-full">
          <button
            className={`btn btn-ghost justify-start w-full ${activeTab === 'quotes' ? 'btn-active' : ''}`}
            onClick={() => {
              setActiveTab('quotes');
              setActiveSubTab('quotations');
            }}
          >
            <FileText className="w-5 h-5" />
            <span>Cotizaciones</span>
            {activeTab === 'quotes' ? (
              <ChevronDown className="w-4 h-4 ml-auto" />
            ) : (
              <ChevronRight className="w-4 h-4 ml-auto" />
            )}
          </button>
          {activeTab === 'quotes' && (
            <ul className="menu menu-sm pl-4 w-full">
              <li>
                <button
                  className={`${activeSubTab === 'quotations' ? 'active' : ''}`}
                  onClick={() => setActiveSubTab('quotations')}
                >
                  Lista de cotizaciones
                </button>
              </li>
              <li>
                <button
                  className={`${activeSubTab === 'requests' ? 'active' : ''}`}
                  onClick={() => setActiveSubTab('requests')}
                >
                  Solicitudes
                </button>
              </li>
            </ul>
          )}
        </div>

        {/* Accounts */}
        <div className="dropdown dropdown-end w-full">
          <button
            className={`btn btn-ghost justify-start w-full ${isAccountsActive ? 'btn-active' : ''}`}
            onClick={() => {
              setActiveTab('accounts');
              setActiveSubTab('users');
            }}
          >
            <Users className="w-5 h-5" />
            <span>Administración</span>
            {isAccountsActive ? (
              <ChevronDown className="w-4 h-4 ml-auto" />
            ) : (
              <ChevronRight className="w-4 h-4 ml-auto" />
            )}
          </button>
          {isAccountsActive && (
            <ul className="menu menu-sm pl-4 w-full">
              <li>
                <button
                  className={`${activeSubTab === 'users' ? 'active' : ''}`}
                  onClick={() => setActiveSubTab('users')}
                >
                  Usuarios
                </button>
              </li>
              <li>
                <button
                  className={`${activeSubTab === 'groups' ? 'active' : ''}`}
                  onClick={() => setActiveSubTab('groups')}
                >
                  Grupos
                </button>
              </li>
              <li>
                <button
                  className={`${activeSubTab === 'clients' ? 'active' : ''}`}
                  onClick={() => setActiveSubTab('clients')}
                >
                  Clientes
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-base-200 space-y-2">
        <button
          className={`btn btn-ghost justify-start w-full ${activeTab === 'settings' ? 'btn-active' : ''}`}
          onClick={() => {
            setActiveTab('settings');
            setActiveSubTab(null);
          }}
        >
          <Settings className="w-5 h-5" />
          <span>Configuración</span>
        </button>

        <button className="btn btn-ghost justify-start w-full">
          <HelpCircle className="w-5 h-5" />
          <span>Ayuda</span>
        </button>

        <div className="dropdown dropdown-top dropdown-end w-full">
          <button className="btn btn-ghost justify-start w-full">
            <User className="w-5 h-5" />
            <span>Mi cuenta</span>
          </button>
          <ul className="dropdown-content menu menu-sm p-2 shadow bg-base-100 rounded-box w-52 mb-2">
            <li><a>Perfil</a></li>
            <li><a>Preferencias</a></li>
            <li><a className="text-error">
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;