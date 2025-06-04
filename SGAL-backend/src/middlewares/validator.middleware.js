export const validateSchema = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            message: "Errores de validación",
            errors: error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }))
        });
    }
};