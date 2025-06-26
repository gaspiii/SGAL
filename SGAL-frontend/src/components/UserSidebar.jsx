import React from 'react';
import {
  Home, FileText, ChevronDown, ChevronRight,
  Users, Settings, HelpCircle, User, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const UserSidebar = ({ activeTab, setActiveTab, activeSubTab, setActiveSubTab }) => {
  // Obtener datos del usuario desde localStorage
  const userData = JSON.parse(localStorage.getItem('user')) || {
    name: 'Invitado',
    role: 'Sin rol'
  };
const navigate = useNavigate();

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const isAccountsActive = activeTab === 'accounts';

  return (
    <div className="w-64 bg-base-100 border-r border-base-200 flex flex-col h-full">
      {/* Perfil del usuario */}
      <div className="p-4 border-b border-base-200">
        <div className="flex items-center gap-3">
          <div className=" placeholder">
           <div className="bg-neutral text-neutral-content rounded-full text-center w-10 h-10 flex items-center justify-center">
  <span className="text-md font-bold leading-none">
    {userData.name?.charAt(0).toUpperCase()}
  </span>
</div>



          </div>
          <div>
            <div className="font-bold">{userData.name}</div>
            <div className="text-xs text-gray-500">{userData.role}</div>
          </div>
        </div>
      </div>

      {/* Navegación principal */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
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

        {/* Cotizaciones */}
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
            {activeTab === 'quotes'
              ? <ChevronDown className="w-4 h-4 ml-auto" />
              : <ChevronRight className="w-4 h-4 ml-auto" />
            }
          </button>
         {activeTab === 'quotes' && (
  <ul className="menu menu-sm pl-4 w-full space-y-1">
    {/*
    <li>
      <button
        className={`w-full text-left px-4 py-2 rounded ${
          activeSubTab === 'quotations'
            ? 'bg-primary/10 text-primary font-semibold'
            : 'hover:bg-base-200'
        }`}
        onClick={() => setActiveSubTab('quotations')}
      >
        Lista de cotizaciones
      </button>
    </li>
    */}
    <li>
      <button
        className={`w-full text-left px-4 py-2 rounded ${
          activeSubTab === 'requests'
            ? 'bg-primary/10 text-primary font-semibold'
            : 'hover:bg-base-200'
        }`}
        onClick={() => setActiveSubTab('requests')}
      >
        Solicitudes
      </button>
    </li>
  </ul>
)}

        </div>

        {/* Administración */}
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
            {isAccountsActive
              ? <ChevronDown className="w-4 h-4 ml-auto" />
              : <ChevronRight className="w-4 h-4 ml-auto" />
            }
          </button>
          {isAccountsActive && (
            <ul className="menu menu-sm pl-4 w-full space-y-1">
              <li>
                <button
                  className={`w-full text-left px-4 py-2 rounded ${
                    activeSubTab === 'users'
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'hover:bg-base-200'
                  }`}
                  onClick={() => setActiveSubTab('users')}
                >
                  Usuarios
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-4 py-2 rounded ${
                    activeSubTab === 'groups'
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'hover:bg-base-200'
                  }`}
                  onClick={() => setActiveSubTab('groups')}
                >
                  Grupos
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-4 py-2 rounded ${
                    activeSubTab === 'clients'
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'hover:bg-base-200'
                  }`}
                  onClick={() => setActiveSubTab('clients')}
                >
                  Clientes
                </button>
              </li>
            </ul>
            )}

        </div>
      </div>

      {/* Navegación inferior */}
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

        <button
          className={`btn btn-ghost justify-start w-full ${activeTab === 'help' ? 'btn-active' : ''}`}
          onClick={() => {
            setActiveTab('help');
            setActiveSubTab(null);
          }}
        >
          <HelpCircle className="w-5 h-5" />
          <span>Ayuda</span>
        </button>

        <div className="dropdown dropdown-top dropdown-end w-full">
          <button className="btn btn-ghost justify-start w-full">
            <User className="w-5 h-5" />
            <span>Mi cuenta</span>
          </button>
          <ul className="dropdown-content menu menu-sm p-2 shadow bg-base-100 rounded-box w-52 mb-2">
            <li><button>Perfil</button></li>
            <li><button>Preferencias</button></li>
            <li>
              <button className="text-error" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;
