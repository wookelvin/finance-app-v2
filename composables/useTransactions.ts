import { ref } from 'vue'

export const useTransactions = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const createTransaction = async (
    institutionId: string,
    data: {
      date: string | Date
      description: string
      vendor: string
      category: string
      transactionAmount: number
      confirmed?: boolean
      createdBy?: string
      updatedBy?: string
    },
  ) => {
    loading.value = true
    error.value = null
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transaction: any = await $fetch(
        `/api/institutions/${institutionId}/transactions`,
        {
          method: 'POST',
          body: data,
        },
      )
      return transaction
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create transaction'
      console.error('Error creating transaction:', err)
      return null
    }
    finally {
      loading.value = false
    }
  }

  const updateTransaction = async (
    transactionId: string,
    data: Partial<{
      description: string
      vendor: string
      category: string
      transactionAmount: number
      confirmed: boolean
      updatedBy: string
    }>,
  ) => {
    loading.value = true
    error.value = null
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transaction: any = await $fetch(
        `/api/transactions/${transactionId}`,
        {
          method: 'PATCH',
          body: data,
        },
      )
      return transaction
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update transaction'
      console.error('Error updating transaction:', err)
      return null
    }
    finally {
      loading.value = false
    }
  }

  const deleteTransaction = async (transactionId: string) => {
    loading.value = true
    error.value = null
    try {
      await $fetch(`/api/transactions/${transactionId}`, {
        method: 'DELETE',
      })
      return true
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete transaction'
      console.error('Error deleting transaction:', err)
      return false
    }
    finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  }
}
