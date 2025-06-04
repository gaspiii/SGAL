export const verifyRole = (requiredRole) => {
    return (req, res, next) => {
      try {
        const userRole = req.userRole; // Este valor debe ser asignado por el middleware authRequired
  
        if (!userRole || userRole !== requiredRole) {
          return res.status(403).json({ message: 'Acceso denegado: No tienes el rol requerido' });
        }
  
        next();
      } catch (error) {
        console.error('Error al verificar el rol:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
      }
    };
  };