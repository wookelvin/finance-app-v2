import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (_event) => {
  try {
    const institutions = await prisma.institution.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return institutions
  }
  catch (error) {
    console.error('Error fetching institutions:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch institutions',
    })
  }
})
