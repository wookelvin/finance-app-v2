import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const institutionId = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!institutionId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Institution ID is required',
    })
  }

  const { date, description, vendor, category, transactionAmount, confirmed, createdBy, updatedBy } = body

  if (!date || !description || !vendor || !category || transactionAmount === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required transaction fields',
    })
  }

  try {
    const transaction = await prisma.transaction.create({
      data: {
        institutionId,
        date: new Date(date),
        description,
        vendor,
        category,
        transactionAmount: parseFloat(transactionAmount),
        confirmed: confirmed ?? false,
        createdBy: createdBy || 'system',
        updatedBy: updatedBy || 'system',
      },
    })
    return transaction
  }
  catch (error) {
    console.error('Error creating transaction:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create transaction',
    })
  }
})
