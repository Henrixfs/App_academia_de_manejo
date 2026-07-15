import { proxyAdminRequest } from '@/lib/admin-bff'

interface RouteContext {
  params: Promise<{ path: string[] }>
}

const handle = async (request: Request, context: RouteContext): Promise<Response> => {
  const { path } = await context.params
  return proxyAdminRequest(request, path)
}

export const GET = handle
export const POST = handle
export const PUT = handle
export const DELETE = handle
