import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session");

  // Liste des chemins publics qui ne nécessitent pas d'authentification
  const publicPaths = ["/"];
  
  // Vérifier si l'utilisateur est sur une page publique
  const isPublicPath = publicPaths.some((path) => 
    request.nextUrl.pathname.startsWith(path)
  );

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une page protégée
  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Si l'utilisateur est connecté et essaie d'accéder à login/register
  if (session && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Configurer les chemins sur lesquels le middleware doit s'exécuter
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/applications/:path*",
    "/settings/:path*",
  ],
}; 