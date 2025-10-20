import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const transactionId = getRouterParam(event, 'transactionId')

  if (!transactionId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Transaction ID is required',
    })
  }

  try {
    await prisma.transaction.delete({
      where: { id: transactionId },
    })
    return { success: true }
  }
  catch (error) {
    console.error('Error deleting transaction:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete transaction',
    })
  }
})
