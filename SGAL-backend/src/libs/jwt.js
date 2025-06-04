import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';
//json web token 
export function createToken(payload) {
    // Devolver una promesa para poder usar el token en el controlador
    return new Promise((resolve, reject) => { // Asegurarse de devolver la promesa
        jwt.sign(payload, TOKEN_SECRET, {
            expiresIn: '1h'
        }, (err, token) => {
            if (err) {
                console.error(err);
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }
        });
    });
}