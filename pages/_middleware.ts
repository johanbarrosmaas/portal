import { NextURL } from 'next/dist/server/web/next-url';
import { NextRequest, NextResponse } from 'next/server';

function redirect404(url: NextURL) {
    url.pathname = '/404';
    return NextResponse.rewrite(url);
} 

export default function middleware(req: NextRequest) {
    const url = req.nextUrl;

    if (url.pathname.includes('lista')) {
        if (!url.searchParams.has('token')) return redirect404(url);
        const token = url.searchParams.get('token');
        if (token == null) return redirect404(url);
    
        if (token !== 'kt5rWstx') return redirect404(url);
    }
}
