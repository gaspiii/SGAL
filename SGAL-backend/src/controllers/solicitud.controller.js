import Solicitud from "../models/solicitud.model.js";
import Client from "../models/client.model.js";
import Cotizacion from "../models/cotizacion.model.js";

// Crear una nueva solicitud
export const createSolicitud = async (req, res) => {
    try {
        const { 
            clientId, 
            nombreContacto, 
            telefono, 
            email, 
            nombreObra, 
            ubicacionObra, 
            descripcionServicios, 
            prioridad 
        } = req.body;

        // Verificar que el cliente existe
        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        const newSolicitud = new Solicitud({
            client: clientId,
            nombreContacto,
            telefono,
            email,
            nombreObra,
            ubicacionObra,
            descripcionServicios,
            prioridad: prioridad || "Media",
            status: "en-revisión"
        });

        await newSolicitud.save();
        
        // Poblar la información del cliente
        await newSolicitud.populate('client');

        res.status(201).json({ 
            message: "Solicitud registrada exitosamente", 
            solicitud: newSolicitud 
        });
    } catch (error) {
        console.error("Error al crear solicitud:", error);
        res.status(500).json({ 
            message: "Error interno del servidor", 
            error: error.message 
        });
    }
};

// Obtener todas las solicitudes
export const getSolicitudes = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, clientId } = req.query;
        const skip = (page - 1) * limit;

        let filter = {};
        
        // Filtrar por estado
        if (status) {
            filter.status = status;
        }
        
        // Filtrar por cliente
        if (clientId) {
            filter.client = clientId;
        }

        const solicitudes = await Solicitud.find(filter)
            .populate('client')
            .populate('aprobadoPor', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Solicitud.countDocuments(filter);

        res.json({
            solicitudes,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalSolicitudes: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error("Error al obtener solicitudes:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Obtener una solicitud por ID
export const getSolicitudById = async (req, res) => {
    try {
        const { id } = req.params;
        const solicitud = await Solicitud.findById(id)
            .populate('client')
            .populate('aprobadoPor', 'name')
            .populate('cotizacionGenerada');

        if (!solicitud) {
            return res.status(404).json({ message: "Solicitud no encontrada" });
        }

        res.json(solicitud);
    } catch (error) {
        console.error("Error al obtener solicitud:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Aprobar una solicitud
export const aprobarSolicitud = async (req, res) => {
    try {
        const { id } = req.params;
        const { observaciones } = req.body;
        const userId = req.userId; // Del middleware de autenticación

        // Verificar que la solicitud existe
        const solicitud = await Solicitud.findById(id);
        if (!solicitud) {
            return res.status(404).json({ message: "Solicitud no encontrada" });
        }

        if (solicitud.status !== "en-revisión") {
            return res.status(400).json({ 
                message: "Solo se pueden aprobar solicitudes en revisión" 
            });
        }

        // Crear cotización automáticamente
        const nuevaCotizacion = new Cotizacion({
            client: solicitud.client,
            items: [{
                servicio: solicitud.descripcionServicios,
                telefono: solicitud.telefono,
                nombreContacto: solicitud.nombreContacto,
                obra: solicitud.nombreObra
            }],
            totalAmount: 0,
            status: "pendiente"
        });

        await nuevaCotizacion.save();

        // Actualizar solicitud
        const solicitudActualizada = await Solicitud.findByIdAndUpdate(
            id,
            { 
                status: "aprobado",
                observaciones,
                cotizacionGenerada: nuevaCotizacion._id,
                aprobadoPor: userId,
                fechaAprobacion: new Date()
            },
            { new: true, runValidators: true }
        ).populate('client').populate('aprobadoPor', 'name').populate('cotizacionGenerada');

        res.json({ 
            message: "Solicitud aprobada exitosamente", 
            solicitud: solicitudActualizada,
            cotizacion: nuevaCotizacion
        });
    } catch (error) {
        console.error("Error al aprobar solicitud:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Rechazar una solicitud
export const rechazarSolicitud = async (req, res) => {
    try {
        const { id } = req.params;
        const { observaciones } = req.body;
        const userId = req.userId; // Del middleware de autenticación

        // Verificar que la solicitud existe
        const solicitud = await Solicitud.findById(id);
        if (!solicitud) {
            return res.status(404).json({ message: "Solicitud no encontrada" });
        }

        if (solicitud.status !== "en-revisión") {
            return res.status(400).json({ 
                message: "Solo se pueden rechazar solicitudes en revisión" 
            });
        }

        // Actualizar solicitud
        const solicitudActualizada = await Solicitud.findByIdAndUpdate(
            id,
            { 
                status: "rechazado",
                observaciones,
                aprobadoPor: userId,
                fechaAprobacion: new Date()
            },
            { new: true, runValidators: true }
        ).populate('client').populate('aprobadoPor', 'name');

        res.json({ 
            message: "Solicitud rechazada exitosamente", 
            solicitud: solicitudActualizada
        });
    } catch (error) {
        console.error("Error al rechazar solicitud:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Obtener estadísticas de solicitudes
export const getSolicitudesStats = async (req, res) => {
    try {
        const stats = await Solicitud.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalSolicitudes = await Solicitud.countDocuments();

        res.json({
            totalSolicitudes,
            statusBreakdown: stats
        });
    } catch (error) {
        console.error("Error al obtener estadísticas:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}; 