import { NextURL } from 'next/dist/server/web/next-url';
import { NextRequest, NextResponse } from 'next/server';

function redirect404(url: NextURL) {
    url.pathname = '/404';
    return NextResponse.rewrite(url);
} 

export default function middleware(req: NextRequest) {
    const url = req.nextUrl;
    let token = url.searchParams.get('token');
}
