import Grupo from "../models/grupo.model.js";
import User from "../models/user.model.js";

// Crear un nuevo grupo
export const createGrupo = async (req, res) => {
    try {
        const { nombre, descripcion, miembros, roles } = req.body;

        // Verificar que el nombre del grupo no esté en uso
        const existingGrupo = await Grupo.findOne({ nombre });
        if (existingGrupo) {
            return res.status(400).json({ message: "Ya existe un grupo con ese nombre" });
        }

        // Verificar que los miembros existen (si se proporcionan)
        if (miembros && miembros.length > 0) {
            const users = await User.find({ _id: { $in: miembros } });
            if (users.length !== miembros.length) {
                return res.status(400).json({ message: "Algunos usuarios no fueron encontrados" });
            }
        }

        const newGrupo = new Grupo({
            nombre,
            descripcion,
            miembros: miembros || [],
            roles: roles || ["general"]
        });

        await newGrupo.save();
        await newGrupo.populate('miembros', 'name email role cargo iniciales');

        res.status(201).json({ 
            message: "Grupo creado exitosamente", 
            grupo: newGrupo 
        });
    } catch (error) {
        console.error("Error al remover miembro:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Eliminar un grupo
export const deleteGrupo = async (req, res) => {
    try {
        const { id } = req.params;

        const grupo = await Grupo.findByIdAndDelete(id);
        if (!grupo) {
            return res.status(404).json({ message: "Grupo no encontrado" });
        }

        // Remover la referencia del grupo de todos los usuarios que lo tenían
        await User.updateMany(
            { grupos: id },
            { $pull: { grupos: id } }
        );

        res.json({ message: "Grupo eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar grupo:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Obtener todos los grupos
export const getGrupos = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const skip = (page - 1) * limit;

        let query = {};
        
        // Búsqueda por nombre o descripción
        if (search) {
            query = {
                $or: [
                    { nombre: { $regex: search, $options: 'i' } },
                    { descripcion: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const grupos = await Grupo.find(query)
            .populate('miembros', 'name email role cargo iniciales')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Grupo.countDocuments(query);

        res.json({
            grupos,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalGrupos: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error("Error al obtener grupos:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Obtener un grupo por ID
export const getGrupoById = async (req, res) => {
    try {
        const { id } = req.params;
        const grupo = await Grupo.findById(id)
            .populate('miembros', 'name email role cargo iniciales');

        if (!grupo) {
            return res.status(404).json({ message: "Grupo no encontrado" });
        }

        res.json(grupo);
    } catch (error) {
        console.error("Error al obtener grupo:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Actualizar un grupo
export const updateGrupo = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, miembros, roles } = req.body;

        // Verificar que el grupo existe
        const grupo = await Grupo.findById(id);
        if (!grupo) {
            return res.status(404).json({ message: "Grupo no encontrado" });
        }

        // Verificar unicidad del nombre (si se está cambiando)
        if (nombre && nombre !== grupo.nombre) {
            const existingNombre = await Grupo.findOne({ nombre });
            if (existingNombre) {
                return res.status(400).json({ message: "Ya existe un grupo con ese nombre" });
            }
        }

        // Verificar que los miembros existen (si se proporcionan)
        if (miembros && miembros.length > 0) {
            const users = await User.find({ _id: { $in: miembros } });
            if (users.length !== miembros.length) {
                return res.status(400).json({ message: "Algunos usuarios no fueron encontrados" });
            }
        }

        const updatedGrupo = await Grupo.findByIdAndUpdate(
            id,
            { nombre, descripcion, miembros, roles },
            { new: true, runValidators: true }
        ).populate('miembros', 'name email role cargo iniciales');

        res.json({ 
            message: "Grupo actualizado exitosamente", 
            grupo: updatedGrupo 
        });
    } catch (error) {
        console.error("Error al actualizar grupo:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Agregar miembro a un grupo
export const addMiembroToGrupo = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        // Verificar que el grupo existe
        const grupo = await Grupo.findById(id);
        if (!grupo) {
            return res.status(404).json({ message: "Grupo no encontrado" });
        }

        // Verificar que el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Verificar que el usuario no esté ya en el grupo
        if (grupo.miembros.includes(userId)) {
            return res.status(400).json({ message: "El usuario ya es miembro del grupo" });
        }

        grupo.miembros.push(userId);
        await grupo.save();
        await grupo.populate('miembros', 'name email role cargo iniciales');

        res.json({ 
            message: "Miembro agregado exitosamente", 
            grupo 
        });
    } catch (error) {
        console.error("Error al agregar miembro:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Remover miembro de un grupo
export const removeMiembroFromGrupo = async (req, res) => {
    try {
        const { id, userId } = req.params;

        const grupo = await Grupo.findById(id);
        if (!grupo) {
            return res.status(404).json({ message: "Grupo no encontrado" });
        }

        // Verificar que el usuario es miembro del grupo
        if (!grupo.miembros.includes(userId)) {
            return res.status(400).json({ message: "El usuario no es miembro del grupo" });
        }

        grupo.miembros = grupo.miembros.filter(miembro => miembro.toString() !== userId);
        await grupo.save();
        await grupo.populate('miembros', 'name email role cargo iniciales');

        res.json({ 
            message: "Miembro removido exitosamente", 
            grupo 
        });
    } catch (error) {
        console.error("Error al remover miembro:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}