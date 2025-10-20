import type { Institution, Transaction } from '@prisma/client'
import { ref } from 'vue'

type SerializedInstitution = Omit<Institution, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
  transactions?: (Omit<Transaction, 'date' | 'createdDate' | 'updatedDate'> & {
    date: string
    createdDate: string
    updatedDate: string
  })[]
}

export const useInstitutions = () => {
  const institutions = ref<SerializedInstitution[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedInstitution = ref<SerializedInstitution | null>(null)

  const fetchInstitutions = async () => {
    loading.value = true
    error.value = null
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = await $fetch('/api/institutions')
      institutions.value = data
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch institutions'
      console.error('Error fetching institutions:', err)
    }
    finally {
      loading.value = false
    }
  }

  const fetchInstitution = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = await $fetch(`/api/institutions/${id}`)
      selectedInstitution.value = data
      return data
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch institution'
      console.error('Error fetching institution:', err)
      return null
    }
    finally {
      loading.value = false
    }
  }

  const createInstitution = async (name: string, code: string) => {
    loading.value = true
    error.value = null
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = await $fetch('/api/institutions', {
        method: 'POST',
        body: { name, code },
      })
      institutions.value.unshift(data)
      return data
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create institution'
      console.error('Error creating institution:', err)
      return null
    }
    finally {
      loading.value = false
    }
  }

  return {
    institutions,
    loading,
    error,
    selectedInstitution,
    fetchInstitutions,
    fetchInstitution,
    createInstitution,
  }
}
