import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaFlask } from 'react-icons/fa';

const AuthForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null); // Clear errors when user types
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulación de autenticación con delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validación básica (en producción usaría un backend real)
      if (form.username && form.password) {
        navigate('/dashboard');
      } else {
        setError('Por favor ingrese credenciales válidas');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-centerp-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-red-800 p-4 rounded-full mb-4 shadow-lg">
            <FaFlask className="text-4xl text-white" />
          </div>
          <h1 className="text-3xl font-bold text-red-900 text-center">S.G.A.L.</h1>
          <p className="text-black-700 mt-1 text-center font-medium">Sistema de Gestión Administrativa para Laboratorios</p>
        </div>

        <div className="card bg-white shadow-2xl rounded-xl overflow-hidden border border-red-100">
          <div className="card-body p-8">
            <h2 className="text-2xl font-bold text-center text-red-900 mb-6">
              Acceso al Sistema
            </h2>

            {error && (
              <div className="alert alert-error mb-6 py-3 px-4 rounded-lg bg-red-50 text-red-700 text-sm flex items-center border border-red-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="form-control">
                <label className="label block mb-2 text-sm font-medium text-red-800">
                  Usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-red-400" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="input pl-10 w-full py-3 px-4 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                    placeholder="Ingrese su usuario"
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label block mb-2 text-sm font-medium text-red-800">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-red-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="input pl-10 w-full py-3 px-4 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                    placeholder="Ingrese su contraseña"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className={`btn w-full py-3 px-4 rounded-lg bg-red-800 hover:bg-red-900 text-white font-medium focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 transition shadow-lg ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </>
                  ) : 'Iniciar Sesión'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-red-500">
                ¿Olvidó su contraseña? <span className="text-red-700 hover:text-red-800 cursor-pointer font-medium">Contacte al administrador</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-red-600">
          © {new Date().getFullYear()} S.G.A.L. - Sistema de Gestión Administrativa para Laboratorios
        </div>
        <div className="text-center text-xs text-red-500 mt-1">
          Todos los derechos reservados
        </div>
      </div>
    </div>
  );
};

export default AuthForm;