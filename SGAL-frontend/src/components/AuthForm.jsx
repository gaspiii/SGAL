import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthForm = ({ hasAccounts, setHasAccounts }) => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleLogin = (e) => {
    e.preventDefault()
    // Simulamos login exitoso
    navigate('/dashboard')
  }

  const handleCreateFounder = () => {
    // Simulamos creación exitosa
    alert('Cuenta de fundador creada correctamente')
    setHasAccounts(true)
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="text-2xl font-bold text-center">Iniciar Sesión</h2>

        {error && (
          <div className="alert alert-error text-sm mt-2">{error}</div>
        )}

        {!hasAccounts ? (
          <div className="text-center mt-4">
            <p className="mb-2 text-sm text-gray-400">No hay cuentas creadas</p>
            <button
              onClick={handleCreateFounder}
              className="btn btn-primary w-full"
            >
              Crear cuenta Adm fundador con credenciales
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Usuario</span>
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Contraseña</span>
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="input input-bordered"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary hover:btn-primary-hover w-full">
              Iniciar sesión
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default AuthForm
