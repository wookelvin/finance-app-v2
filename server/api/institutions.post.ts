import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { name, code } = body

  if (!name || !code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name and code are required',
    })
  }

  try {
    const institution = await prisma.institution.create({
      data: {
        name,
        code,
      },
    })
    return institution
  }
  catch (error) {
    console.error('Error creating institution:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create institution',
    })
  }
})
