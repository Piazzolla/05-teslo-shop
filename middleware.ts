import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
 
 
export default async function middleware(req: NextRequest | any) {
 
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if( !session ) {
        const { pathname, origin } = req.nextUrl;

        return NextResponse.redirect(`${origin}/auth/login?p=${pathname}`);
    }

    return NextResponse.next();

    // try {
    //     await jose.jwtVerify(req.cookies.get('token') as string,
    //         new TextEncoder().encode(process.env.JWT_SECRET_SEED));
 
    //     return NextResponse.next();
 
 
    // } catch (error) {
 
    //     return NextResponse.redirect(`/auth/login?p=${config.matcher}`);
    // } ya no tengo mi sesion basada en cookies tengo next auth



 
 
}

export const config = {
    //matcher: '/about/:path*',
      matcher: ['/checkout/address', '/checkout/summary']
  }