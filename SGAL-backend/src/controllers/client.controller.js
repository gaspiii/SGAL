import Client from "../models/client.model.js";

// Crear un nuevo cliente
export const createClient = async (req, res) => {
    try {
        const { razonSocial, rut, giro, comuna, email, phone, address } = req.body;

        // Verificar si el cliente ya existe (por RUT o email)
        const existingClient = await Client.findOne({ 
            $or: [{ rut }]
            // $or: [{ rut }, { email }] // Eliminar una vez comrprobado.
        });
        
        if (existingClient) {
            return res.status(400).json({ 
                message: "Ya existe un cliente con ese RUT o email" 
            });
        }

        const newClient = new Client({
            razonSocial,
            rut,
            email,
            phone,
            address
        });

        await newClient.save();
        res.status(201).json({ 
            message: "Cliente creado exitosamente", 
            client: newClient 
        });
    } catch (error) {
        console.error("Error al crear cliente:", error);
        res.status(500).json({ 
            message: "Error interno del servidor", 
            error: error.message 
        });
    }
};

// Obtener todos los clientes
export const getClients = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const skip = (page - 1) * limit;

        let query = {};
        
        // Búsqueda por razón social, RUT o email
        if (search) {
            query = {
                $or: [
                    { razonSocial: { $regex: search, $options: 'i' } },
                    { rut: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const clients = await Client.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Client.countDocuments(query);

        res.json({
            clients,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalClients: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Obtener un cliente por ID
export const getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findById(id);

        if (!client) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        res.json(client);
    } catch (error) {
        console.error("Error al obtener cliente:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Actualizar un cliente
export const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { razonSocial, rut, email, phone, address } = req.body;

        // Verificar si el cliente existe
        const client = await Client.findById(id);
        if (!client) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        // Verificar unicidad de RUT y email (si se están cambiando)
        if (rut && rut !== client.rut) {
            const existingRut = await Client.findOne({ rut });
            if (existingRut) {
                return res.status(400).json({ message: "Ya existe un cliente con ese RUT" });
            }
        }

        if (email && email !== client.email) {
            const existingEmail = await Client.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ message: "Ya existe un cliente con ese email" });
            }
        }

        const updatedClient = await Client.findByIdAndUpdate(
            id,
            { razonSocial, rut, email, phone, address },
            { new: true, runValidators: true }
        );

        res.json({ 
            message: "Cliente actualizado exitosamente", 
            client: updatedClient 
        });
    } catch (error) {
        console.error("Error al actualizar cliente:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Eliminar un cliente
export const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;

        const client = await Client.findByIdAndDelete(id);
        if (!client) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        res.json({ message: "Cliente eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar cliente:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};