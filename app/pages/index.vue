<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Transaction } from '@prisma/client'
import { useInstitutions } from '../../composables/useInstitutions'
import { useTransactions } from '../../composables/useTransactions'

const { institutions, loading, fetchInstitutions, createInstitution } = useInstitutions()
const { createTransaction, deleteTransaction } = useTransactions()

const showInstitutionForm = ref(false)
const newInstitutionName = ref('')
const newInstitutionCode = ref('')
const selectedInstitutionId = ref<string | null>(null)
const institutionTransactions = ref<Transaction[]>([])
const institutionLoading = ref(false)

// Add transaction form state
const showAddTransactionRow = ref(false)
const newTransaction = ref({
  date: new Date().toISOString().split('T')[0],
  description: '',
  vendor: '',
  category: 'other',
  transactionAmount: 0,
})

const selectedInstitutionData = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return institutions.value.find((i: any) => i.id === selectedInstitutionId.value)
})

const handleCreateInstitution = async () => {
  if (!newInstitutionName.value || !newInstitutionCode.value) {
    console.error('Name and code are required')
    return
  }

  await createInstitution(newInstitutionName.value, newInstitutionCode.value)
  newInstitutionName.value = ''
  newInstitutionCode.value = ''
  showInstitutionForm.value = false
}

const handleSelectInstitution = async (institutionId: string) => {
  selectedInstitutionId.value = institutionId
  institutionLoading.value = true
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await $fetch(`/api/institutions/${institutionId}`)
    institutionTransactions.value = data.transactions || []
  }
  catch (error) {
    console.error('Error fetching institution transactions:', error)
  }
  finally {
    institutionLoading.value = false
  }
}

const handleAddTransaction = async () => {
  if (!selectedInstitutionId.value || !newTransaction.value.description || !newTransaction.value.vendor) {
    console.error('Description, vendor, and category are required')
    return
  }

  const transaction = await createTransaction(selectedInstitutionId.value, {
    date: new Date(newTransaction.value.date!),
    description: newTransaction.value.description,
    vendor: newTransaction.value.vendor,
    category: newTransaction.value.category,
    transactionAmount: newTransaction.value.transactionAmount,
  })

  if (transaction) {
    // Convert string dates to Date objects to match the Transaction type
    const transactionWithDates = {
      ...transaction,
      date: new Date(transaction.date),
      createdDate: new Date(transaction.createdDate),
      updatedDate: new Date(transaction.updatedDate),
    }
    institutionTransactions.value.unshift(transactionWithDates)
    newTransaction.value = {
      date: new Date().toISOString().split('T')[0],
      description: '',
      vendor: '',
      category: 'other',
      transactionAmount: 0,
    }
    showAddTransactionRow.value = false
  }
}

const handleDeleteTransaction = async (transactionId: string) => {
  const success = await deleteTransaction(transactionId)
  if (success) {
    institutionTransactions.value = institutionTransactions.value.filter(
      t => t.id !== transactionId,
    )
  }
}

onMounted(() => {
  fetchInstitutions()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Finance Manager
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Manage your institutions and transactions
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Sidebar - Institutions -->
        <div class="lg:col-span-1">
          <UCard class="sticky top-8">
            <template #header>
              <div class="flex justify-between items-center">
                <h2 class="text-lg font-semibold">
                  Institutions
                </h2>
                <UButton
                  icon="i-heroicons-plus"
                  size="sm"
                  color="primary"
                  @click="showInstitutionForm = !showInstitutionForm"
                />
              </div>
            </template>

            <!-- Institution Form -->
            <div
              v-if="showInstitutionForm"
              class="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div class="space-y-3">
                <UFormField label="Institution Name">
                  <UInput
                    v-model="newInstitutionName"
                    placeholder="e.g., Chase Bank"
                    size="sm"
                  />
                </UFormField>
                <UFormField label="Code">
                  <UInput
                    v-model="newInstitutionCode"
                    placeholder="e.g., CHASE"
                    size="sm"
                  />
                </UFormField>
                <div class="flex gap-2">
                  <UButton
                    size="sm"
                    :disabled="loading"
                    @click="handleCreateInstitution"
                  >
                    Create
                  </UButton>
                  <UButton
                    size="sm"
                    color="secondary"
                    variant="ghost"
                    @click="showInstitutionForm = false"
                  >
                    Cancel
                  </UButton>
                </div>
              </div>
            </div>

            <!-- Institutions List -->
            <div class="space-y-2">
              <div
                v-if="loading"
                class="text-center py-4"
              >
                <UIcon
                  name="i-heroicons-arrow-path"
                  class="w-5 h-5 animate-spin mx-auto"
                />
              </div>
              <div
                v-else-if="institutions.length === 0"
                class="text-center text-gray-500 py-4"
              >
                No institutions yet
              </div>
              <UButton
                v-for="institution in institutions"
                :key="institution.id"
                :label="institution.name"
                color="secondary"
                variant="ghost"
                class="w-full justify-start"
                :class="{ 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300': selectedInstitutionId === institution.id }"
                @click="handleSelectInstitution(institution.id)"
              />
            </div>
          </UCard>
        </div>

        <!-- Right Content - Transaction Management -->
        <div class="lg:col-span-2">
          <div
            v-if="!selectedInstitutionId"
            class="text-center py-12"
          >
            <UIcon
              name="i-heroicons-inbox"
              class="w-12 h-12 mx-auto text-gray-400 mb-4"
            />
            <p class="text-gray-500 dark:text-gray-400">
              Select an institution to view and manage transactions
            </p>
          </div>

          <div v-else>
            <!-- Institution Header -->
            <UCard class="mb-6">
              <template #header>
                <div>
                  <h2 class="text-2xl font-bold">
                    {{ selectedInstitutionData?.name }}
                  </h2>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {{ selectedInstitutionData?.code }}
                  </p>
                </div>
              </template>
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Total Transactions
                  </p>
                  <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                    {{ institutionTransactions.length }}
                  </p>
                </div>
                <UButton
                  icon="i-heroicons-plus"
                  color="primary"
                  :disabled="showAddTransactionRow"
                  @click="showAddTransactionRow = true"
                >
                  Add Transaction
                </UButton>
              </div>
            </UCard>

            <!-- Transactions Table -->
            <UCard>
              <div
                v-if="institutionLoading"
                class="text-center py-8"
              >
                <UIcon
                  name="i-heroicons-arrow-path"
                  class="w-5 h-5 animate-spin mx-auto"
                />
              </div>
              <div
                v-else-if="institutionTransactions.length === 0 && !showAddTransactionRow"
                class="text-center py-8"
              >
                <p class="text-gray-500 dark:text-gray-400">
                  No transactions yet
                </p>
              </div>
              <div v-else>
                <div class="overflow-x-auto">
                  <table class="w-full">
                    <thead>
                      <tr class="border-b border-gray-200 dark:border-gray-700">
                        <th class="px-4 py-3 text-left text-sm font-semibold">
                          Date
                        </th>
                        <th class="px-4 py-3 text-left text-sm font-semibold">
                          Description
                        </th>
                        <th class="px-4 py-3 text-left text-sm font-semibold">
                          Vendor
                        </th>
                        <th class="px-4 py-3 text-left text-sm font-semibold">
                          Category
                        </th>
                        <th class="px-4 py-3 text-right text-sm font-semibold">
                          Amount
                        </th>
                        <th class="px-4 py-3 text-center text-sm font-semibold">
                          Confirmed
                        </th>
                        <th class="px-4 py-3 text-right text-sm font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <!-- New Transaction Row -->
                      <tr
                        v-if="showAddTransactionRow"
                        class="border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20"
                      >
                        <td class="px-4 py-3">
                          <UInput
                            v-model="newTransaction.date"
                            type="date"
                            size="sm"
                          />
                        </td>
                        <td class="px-4 py-3">
                          <UInput
                            v-model="newTransaction.description"
                            placeholder="Description"
                            size="sm"
                          />
                        </td>
                        <td class="px-4 py-3">
                          <UInput
                            v-model="newTransaction.vendor"
                            placeholder="Vendor"
                            size="sm"
                          />
                        </td>
                        <td class="px-4 py-3">
                          <USelect
                            v-model="newTransaction.category"
                            :items="[
                              { value: 'groceries', label: 'Groceries' },
                              { value: 'utilities', label: 'Utilities' },
                              { value: 'entertainment', label: 'Entertainment' },
                              { value: 'transportation', label: 'Transportation' },
                              { value: 'other', label: 'Other' },
                            ]"
                            option-attribute="label"
                            value-attribute="value"
                            size="sm"
                            placeholder="Select category"
                          />
                        </td>
                        <td class="px-4 py-3">
                          <UInput
                            v-model.number="newTransaction.transactionAmount"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            size="sm"
                          />
                        </td>
                        <td class="px-4 py-3 text-center">
                          <span class="text-sm text-gray-500">
                            Pending
                          </span>
                        </td>
                        <td class="px-4 py-3 text-right space-x-2">
                          <UButton
                            size="xs"
                            color="primary"
                            @click="handleAddTransaction"
                          >
                            Save
                          </UButton>
                          <UButton
                            size="xs"
                            color="secondary"
                            variant="ghost"
                            @click="showAddTransactionRow = false"
                          >
                            Cancel
                          </UButton>
                        </td>
                      </tr>

                      <!-- Existing Transactions -->
                      <tr
                        v-for="transaction in institutionTransactions"
                        :key="transaction.id"
                        class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td class="px-4 py-3 text-sm">
                          {{ new Date(transaction.date).toLocaleDateString() }}
                        </td>
                        <td class="px-4 py-3 text-sm">
                          {{ transaction.description }}
                        </td>
                        <td class="px-4 py-3 text-sm">
                          {{ transaction.vendor }}
                        </td>
                        <td class="px-4 py-3 text-sm">
                          <UBadge color="primary">
                            {{ transaction.category }}
                          </UBadge>
                        </td>
                        <td class="px-4 py-3 text-sm text-right font-semibold">
                          {{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(transaction.transactionAmount) }}
                        </td>
                        <td class="px-4 py-3 text-center">
                          <UIcon
                            :name="transaction.confirmed ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
                            :class="transaction.confirmed ? 'text-green-500' : 'text-gray-400'"
                            class="w-5 h-5"
                          />
                        </td>
                        <td class="px-4 py-3 text-right">
                          <UButton
                            size="xs"
                            color="error"
                            variant="ghost"
                            icon="i-heroicons-trash"
                            @click="handleDeleteTransaction(transaction.id)"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
