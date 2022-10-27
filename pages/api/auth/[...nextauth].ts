import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credentials from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [

        Credentials({
            name: 'Custom Login ',
            credentials: {
                email: { label: 'Correo', type: 'email', placeholder: 'correo@google.com' },
                password: { label: 'Password', type: 'password', placeholder: 'Password' },
            },
            async authorize(credentials) {

                console.log({ credentials });

                //TODO: validar contra base de datos
                return { name: 'Juan', email: 'jan@google.com', role: 'admin' }
            }
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID || '',
            clientSecret: process.env.GITHUB_SECRET || '',
        }),
    ],

    // Callbacks

    jwt: {
        //    secret: process.env DEPRECATED


    },
    callbacks: {
        async jwt({ token, account, user }) {

            if (account) {
                token.accessToken = account.access_token;
                switch (account.type) {
                    case 'oauth':
                        //TODO: crear usuario o verificar si existe en db
                        break;
                    case 'credentials':
                        token.user = user;
                        break;
                }
            }
            return token;
        },

        async session({ session, token, user }) {
            session.accessToken = token.accessToken;
            session.user = token.user as any;
            return session;
        }
    }

}
export default NextAuth(authOptions)