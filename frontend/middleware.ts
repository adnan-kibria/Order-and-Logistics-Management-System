import { NextRequest, NextResponse } from "next/server";

function parseJwt(token: string) {
    try {
        const base64Payload = token.split('.')[1];
        return JSON.parse(Buffer.from(base64Payload, 'base64').toString());
    } catch {
        return null;
    }
}

export function middleware(request: NextRequest) {
    const token = request.cookies.get('jwt')?.value;
    console.log('Middleware - JWT Token:', token);

    if (!token) return NextResponse.redirect(new URL('/signin', request.url));

    const payload = parseJwt(token);
    if (!payload) return NextResponse.redirect(new URL('/signin', request.url));

    const pathname = request.nextUrl.pathname;


    if (pathname.startsWith('/customer')) {
        if (payload.role !== 'customer') {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/customer/:path*']
};