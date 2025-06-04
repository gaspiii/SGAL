import Cotizacion from "../models/cotizacion.model.js";
import Client from "../models/client.model.js";

// Crear una nueva cotización
export const createCotizacion = async (req, res) => {
    try {
        const { clientId, items, totalAmount } = req.body;

        // Verificar que el cliente existe
        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        const newCotizacion = new Cotizacion({
            client: clientId,
            items,
            totalAmount,
            status: "pendiente"
        });

        await newCotizacion.save();
        
        // Poblar la información del cliente
        await newCotizacion.populate('client');

        res.status(201).json({ 
            message: "Cotización creada exitosamente", 
            cotizacion: newCotizacion 
        });
    } catch (error) {
        console.error("Error al crear cotización:", error);
        res.status(500).json({ 
            message: "Error interno del servidor", 
            error: error.message 
        });
    }
};

// Obtener todas las cotizaciones
export const getCotizaciones = async (req, res) => {
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

        const cotizaciones = await Cotizacion.find(filter)
            .populate('client')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Cotizacion.countDocuments(filter);

        res.json({
            cotizaciones,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalCotizaciones: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error("Error al obtener cotizaciones:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Obtener una cotización por ID
export const getCotizacionById = async (req, res) => {
    try {
        const { id } = req.params;
        const cotizacion = await Cotizacion.findById(id).populate('client');

        if (!cotizacion) {
            return res.status(404).json({ message: "Cotización no encontrada" });
        }

        res.json(cotizacion);
    } catch (error) {
        console.error("Error al obtener cotización:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Actualizar una cotización
export const updateCotizacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { clientId, items, totalAmount, status } = req.body;

        // Verificar que la cotización existe
        const cotizacion = await Cotizacion.findById(id);
        if (!cotizacion) {
            return res.status(404).json({ message: "Cotización no encontrada" });
        }

        // Si se está cambiando el cliente, verificar que existe
        if (clientId && clientId !== cotizacion.client.toString()) {
            const client = await Client.findById(clientId);
            if (!client) {
                return res.status(404).json({ message: "Cliente no encontrado" });
            }
        }

        const updatedCotizacion = await Cotizacion.findByIdAndUpdate(
            id,
            { 
                ...(clientId && { client: clientId }),
                ...(items && { items }),
                ...(totalAmount !== undefined && { totalAmount }),
                ...(status && { status })
            },
            { new: true, runValidators: true }
        ).populate('client');

        res.json({ 
            message: "Cotización actualizada exitosamente", 
            cotizacion: updatedCotizacion 
        });
    } catch (error) {
        console.error("Error al actualizar cotización:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Cambiar estado de cotización
export const updateCotizacionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ["pendiente", "aprobado", "rechazado"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                message: "Estado inválido. Los estados válidos son: " + validStatuses.join(", ") 
            });
        }

        const cotizacion = await Cotizacion.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        ).populate('client');

        if (!cotizacion) {
            return res.status(404).json({ message: "Cotización no encontrada" });
        }

        res.json({ 
            message: `Cotización ${status} exitosamente`, 
            cotizacion 
        });
    } catch (error) {
        console.error("Error al actualizar estado de cotización:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Eliminar una cotización
export const deleteCotizacion = async (req, res) => {
    try {
        const { id } = req.params;

        const cotizacion = await Cotizacion.findByIdAndDelete(id);
        if (!cotizacion) {
            return res.status(404).json({ message: "Cotización no encontrada" });
        }

        res.json({ message: "Cotización eliminada exitosamente" });
    } catch (error) {
        console.error("Error al eliminar cotización:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Obtener estadísticas de cotizaciones
export const getCotizacionesStats = async (req, res) => {
    try {
        const stats = await Cotizacion.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    totalAmount: { $sum: "$totalAmount" }
                }
            }
        ]);

        const totalCotizaciones = await Cotizacion.countDocuments();

        res.json({
            totalCotizaciones,
            statusBreakdown: stats
        });
    } catch (error) {
        console.error("Error al obtener estadísticas:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};