import jwt from 'jsonwebtoken';

/* jwt funciona en base a callbacks y no promesas asi que hacemos una conversion para que devuelva una promesa */


export const signToken = ( _id: string, email: string) => {
    if( !process.env.JWT_SECRET_SEED ) {
        throw new Error('No hay semilla de JWT - Revisar variables de entorno');
    }

    return jwt.sign(
        // payload, no meter info sensible aca
        { _id, email},

        // Seed
        process.env.JWT_SECRET_SEED,

        // Opciones
        { expiresIn: '30d' }
    )

}