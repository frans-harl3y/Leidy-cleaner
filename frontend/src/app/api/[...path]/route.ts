import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { params } = await context;
  return proxyToBackend(request, params.path);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { params } = await context;
  return proxyToBackend(request, params.path);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { params } = await context;
  return proxyToBackend(request, params.path);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { params } = await context;
  return proxyToBackend(request, params.path);
}

async function proxyToBackend(request: NextRequest, path: string[]) {
  try {
    const url = new URL(request.url);
    const apiPath = `/${path.join('/')}`;
    const backendUrl = `http://localhost:3001/api/v1${apiPath}${url.search}`;

    const response = await fetch(backendUrl, {
      method: request.method,
      headers: {
        'Content-Type': request.headers.get('content-type') || 'application/json',
        'Authorization': request.headers.get('authorization') || '',
      },
      body: request.method !== 'GET' ? await request.text() : undefined,
    });

    const data = await response.text();
    const headers = new Headers();

    // Copy relevant headers from backend response
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'content-length') {
        headers.set(key, value);
      }
    });

    return new NextResponse(data, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Backend not available' }, { status: 503 });
  try {
    const url = new URL(request.url);
    const path = url.pathname.replace('/api', '');
    const backendUrl = `http://localhost:3001/api${path}${url.search}`;

    const response = await fetch(backendUrl, {
      method: request.method,
      headers: {
        'Content-Type': request.headers.get('content-type') || 'application/json',
        'Authorization': request.headers.get('authorization') || '',
      },
      body: request.method !== 'GET' ? await request.text() : undefined,
    });

    const data = await response.text();
    const headers = new Headers();

    // Copy relevant headers from backend response
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'content-length') {
        headers.set(key, value);
      }
    });

    return new NextResponse(data, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Backend not available' }, { status: 503 });
  }
}