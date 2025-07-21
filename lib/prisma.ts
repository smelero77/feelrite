import { PrismaClient } from "@prisma/client"

// Declarar una variable global para la instancia de PrismaClient
// Esto es necesario para evitar instanciar múltiples clientes en desarrollo
// que pueden agotar las conexiones a la base de datos.
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

export default prisma
