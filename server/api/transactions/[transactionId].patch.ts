import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const transactionId = getRouterParam(event, 'transactionId')
  const body = await readBody(event)

  if (!transactionId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Transaction ID is required',
    })
  }

  const { description, vendor, category, transactionAmount, confirmed, updatedBy } = body

  try {
    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        ...(description && { description }),
        ...(vendor && { vendor }),
        ...(category && { category }),
        ...(transactionAmount !== undefined && { transactionAmount: parseFloat(transactionAmount) }),
        ...(confirmed !== undefined && { confirmed }),
        ...(updatedBy && { updatedBy }),
        updatedDate: new Date(),
      },
    })
    return transaction
  }
  catch (error) {
    console.error('Error updating transaction:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update transaction',
    })
  }
})
