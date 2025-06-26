/**
 * Aquí eliminamos puntos y guiones, validamos el DV
 * por módulo 11 y retorna el RUT con el formato deseado
 * (“12345678-K”) o null si es inválido.
 */
export function validarFormatearRut(rutRaw) {
    const clean = rutRaw.replace(/[^0-9kK]/g, '').toUpperCase();
    if (clean.length < 2) return null;

    const cuerpo = clean.slice(0, -1);
    const dvIngresado = clean.slice(-1);

    let suma = 0;
    let mult = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += Number(cuerpo[i]) * mult;
        mult = mult < 7 ? mult + 1 : 2;
    }
    const resto = suma % 11;
    const dvEsperadoNum = 11 - resto;
    const dvEsperado =
        dvEsperadoNum === 11 ? '0' :
            dvEsperadoNum === 10 ? 'K' :
                String(dvEsperadoNum);

    if (dvEsperado !== dvIngresado) return null;
    return `${cuerpo}-${dvIngresado}`;
}
