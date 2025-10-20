import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const institutionId = getRouterParam(event, 'id')

  if (!institutionId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Institution ID is required',
    })
  }

  try {
    const institution = await prisma.institution.findUnique({
      where: { id: institutionId },
      include: {
        transactions: {
          orderBy: {
            date: 'desc',
          },
        },
      },
    })

    if (!institution) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Institution not found',
      })
    }

    return institution
  }
  catch (error) {
    console.error('Error fetching institution:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch institution',
    })
  }
})
