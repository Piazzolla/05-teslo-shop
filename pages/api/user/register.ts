import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { User } from '../../../models'
import bcrypt from 'bcryptjs';
import { jwt, validations } from '../../../utils';

type Data = | { message: string }
    | {
        token: string,
        user: {
            email: string;
            name: string;
            role: string;
        }
    }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {


    switch (req.method) {
        case 'POST':
            return registerUser(req, res)


        default:
            return res.status(400).json({ message: 'Bad request ' })
    }
}

async function registerUser(req: NextApiRequest, res: NextApiResponse<Data>) {
    const { email = '', password = '', name = '' } = req.body as { email: string, password: string, name: string };

    await db.connect();
    const user = await User.findOne({ email });

    if (password.length < 6) {
        return res.status(400).json({
            message: 'La password debe ser de 6 caracteres'
        })
    }

    if (name.length < 2) {
        return res.status(400).json({
            message: 'El nombre debe tener por lo menos 2 caracteres'
        })
    }

    if (!validations.isValidEmail(email)) {
        return res.status(400).json({
            message: 'El correo no es valido'
        })

    }
    if (user) {
        await db.disconnect();
        return res.status(400).json({ message: 'Ese correo ya esta registrado' });
    }

    const newUser = new User({
        email: email.toLowerCase(),
        password: bcrypt.hashSync(password),
        role: 'client',
        name,

    })


    try {
        await newUser.save({ validateBeforeSave: true })

    } catch (error) {
        console.log(error); // este log se muestra solo del lado del servidor
        return res.status(500).json({
            message: 'Revistar log del servidor'
        })
    }


    const { _id } = newUser;

    const token = jwt.signToken(_id, email)

    return res.status(200).json({
        token, //jwt
        user: {
            email, role: 'client', name
        }
    })
}
