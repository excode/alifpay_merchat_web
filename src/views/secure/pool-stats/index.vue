<script setup>
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import config from '@/config/index'
import moment from 'moment'
import { convertArray } from '@/lib/functions';
import { useRewardStore } from '@/stores/modules/Reward'

const { stats, error, loading } = storeToRefs(useRewardStore())
const { getPoolStats } = useRewardStore()

const activeTab = ref('top10')

onMounted(async () => {
  await getPoolStats()
})

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount)
}

// Get rank badge color
const getRankColor = (index) => {
  const colors = [
    'bg-gradient-to-r from-yellow-400 to-yellow-500', // 1st
    'bg-gradient-to-r from-gray-400 to-gray-500',     // 2nd
    'bg-gradient-to-r from-orange-600 to-orange-700', // 3rd
    'bg-gradient-to-r from-blue-500 to-blue-600',     // 4th
    'bg-gradient-to-r from-blue-400 to-blue-500',     // 5th
    'bg-gradient-to-r from-green-500 to-green-600',   // 6th
    'bg-gradient-to-r from-green-400 to-green-500',   // 7th
    'bg-gradient-to-r from-purple-500 to-purple-600', // 8th
    'bg-gradient-to-r from-purple-400 to-purple-500', // 9th
    'bg-gradient-to-r from-pink-500 to-pink-600'      // 10th
  ]
  return colors[index] || 'bg-gradient-to-r from-gray-300 to-gray-400'
}

// Calculate your rank
const yourRank = computed(() => {
  if (!stats.value?.top || !stats.value?.my) return null
  return stats.value.top.findIndex(user => 
    user.contactNumber === stats.value.my.contactNumber
  ) + 1
})

// Generate recent achievements
const recentAchievements = computed(() => {
  if (!stats.value?.my?.totalAmount) return []
  
  const achievements = []
  const amounts = [15, 25, 35, 50, 75]
  
  // Generate milestones based on current amount
  const currentAmount = stats.value.my.totalAmount
  let milestone = 0
  
  for (let i = 0; i < 5; i++) {
    milestone = amounts[i]
    if (currentAmount >= milestone) {
      achievements.push({
        title: `Reached $${milestone} Bonus`,
        description: `Earned $${milestone} in total rewards`,
        date: `${5 - i} day${5 - i > 1 ? 's' : ''} ago`,
        icon: 'pi-star-fill',
        color: 'bg-gradient-to-r from-blue-500 to-purple-500'
      })
    } else {
      achievements.push({
        title: `Next Goal: $${milestone}`,
        description: `Only $${(milestone - currentAmount).toFixed(2)} to go`,
        date: 'In progress',
        icon: 'pi-flag-fill',
        color: 'bg-gradient-to-r from-gray-300 to-gray-400'
      })
    }
  }
  
  return achievements.slice(0, 3) // Show only 3
})
</script>

<template>
  <div class="min-h-screen bg-white p-4 md:p-6">
    
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
        Pool Bonus Dashboard
      </h1>
      <p class="text-gray-600">Track your achievements and top performers in real-time</p>
    </div>

    <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
      <div class="text-center">
        <i class="pi pi-spin pi-cog text-blue-500" style="font-size: 4rem"></i>
        <p class="mt-4 text-gray-600">Loading bonus data...</p>
      </div>
    </div>

    <div v-else class="space-y-8">
      <!-- Achievement Cards - Horizontal Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Your Achievement Card -->
        <div class="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Your Achievement</h3>
              <p class="text-sm text-gray-600">Current Position</p>
            </div>
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-full shadow-md">
              <i class="pi pi-trophy text-white text-2xl"></i>
            </div>
          </div>
          
          <div class="mb-6">
            <div class="text-3xl font-bold text-gray-900 mb-2">
              {{ formatCurrency(stats?.my?.totalAmount || 0) }}
            </div>
            <p class="text-sm text-gray-600">Total Bonus Earned</p>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-blue-200">
            <div>
              <div class="text-2xl font-bold text-gray-900">{{ yourRank || 'N/A' }}</div>
              <p class="text-sm text-gray-600">Current Rank</p>
            </div>
            <div v-if="yourRank" class="text-right">
              <div class="text-lg font-semibold text-gray-900">{{ stats?.my?.contactNumber }}</div>
              <p class="text-sm text-gray-600">Your Username</p>
            </div>
          </div>
        </div>

        <!-- Total Pool Bonus Card -->
        <div class="bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Total Pool Bonus</h3>
              <p class="text-sm text-gray-600">Community Achievement</p>
            </div>
            <div class="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-full shadow-md">
              <i class="pi pi-chart-line text-white text-2xl"></i>
            </div>
          </div>
          
          <div class="mb-6">
            <div class="text-3xl font-bold text-gray-900 mb-2">
              {{ formatCurrency(stats?.total?.totalAmount || 0) }}
            </div>
            <p class="text-sm text-gray-600">Total Distributed</p>
          </div>

          <div class="pt-4 border-t border-green-200">
            <div class="text-sm text-gray-600">Pool ID: {{ stats?.total?.productid?.slice(-8) || 'N/A' }}</div>
          </div>
        </div>

        <!-- Performance Summary Card -->
        <div class="bg-gradient-to-r from-purple-50 to-indigo-100 border border-purple-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Performance Insights</h3>
              <p class="text-sm text-gray-600">Your standing</p>
            </div>
            <div class="bg-gradient-to-r from-purple-500 to-indigo-600 p-3 rounded-full shadow-md">
              <i class="pi pi-chart-bar text-white text-2xl"></i>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Top Player Score</span>
              <span class="font-bold text-gray-900">
                {{ formatCurrency(stats?.top?.[0]?.totalAmount || 0) }}
              </span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Average Score</span>
              <span class="font-bold text-gray-900">
                {{ formatCurrency((stats?.total?.totalAmount || 0) / (stats?.top?.length || 1)) }}
              </span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Active Players</span>
              <span class="font-bold text-gray-900">{{ stats?.top?.length || 0 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Combined Section: Distribution Chart + Recent Achievements -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Bonus Distribution Chart -->
        <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-xl font-bold text-gray-900">Bonus Distribution</h3>
              <p class="text-gray-600">Visual breakdown of pool distribution</p>
            </div>
            <div class="bg-gradient-to-r from-blue-100 to-blue-200 p-2 rounded-lg">
              <i class="pi pi-chart-pie text-blue-600 text-xl"></i>
            </div>
          </div>
          
          <div class="h-[300px] flex flex-col items-center justify-center">
            <!-- Doughnut Chart Visualization -->
            <div class="relative w-48 h-48 mb-6">
              <!-- Chart center -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-900">{{ stats?.top?.length || 0 }}</div>
                  <div class="text-sm text-gray-600">Players</div>
                </div>
              </div>
              
              <!-- Chart segments -->
              <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <!-- Background circle -->
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" stroke-width="15"/>
                
                <!-- Dynamic segments based on top 3 players -->
                <circle 
                  v-for="(user, index) in (stats?.top || []).slice(0, 3)" 
                  :key="index"
                  cx="50" cy="50" r="40" fill="none"
                  :stroke="['#f59e0b', '#9ca3af', '#ea580c'][index]"
                  stroke-width="15"
                  :stroke-dasharray="`${(user.totalAmount / (stats?.total?.totalAmount || 1)) * 251.2} 251.2`"
                  stroke-dashoffset="0"
                  stroke-linecap="round"
                />
              </svg>
            </div>
            
            <div class="w-full space-y-3">
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center">
                  <div class="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                  <span class="text-gray-700">Top Player</span>
                </div>
                <span class="font-medium text-gray-900">
                  {{ formatCurrency(stats?.top?.[0]?.totalAmount || 0) }}
                </span>
              </div>
              
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center">
                  <div class="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                  <span class="text-gray-700">2nd Place</span>
                </div>
                <span class="font-medium text-gray-900">
                  {{ formatCurrency(stats?.top?.[1]?.totalAmount || 0) }}
                </span>
              </div>
              
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center">
                  <div class="w-3 h-3 rounded-full bg-orange-600 mr-2"></div>
                  <span class="text-gray-700">3rd Place</span>
                </div>
                <span class="font-medium text-gray-900">
                  {{ formatCurrency(stats?.top?.[2]?.totalAmount || 0) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Achievements -->
        <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-xl font-bold text-gray-900">Recent Achievements</h3>
              <p class="text-gray-600">Your progress and milestones</p>
            </div>
            <div class="bg-gradient-to-r from-green-100 to-emerald-200 p-2 rounded-lg">
              <i class="pi pi-award text-green-600 text-xl"></i>
            </div>
          </div>
          
          <div class="space-y-4">
            <div 
              v-for="(achievement, index) in recentAchievements" 
              :key="index"
              class="flex items-start p-4 bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-white rounded-lg transition-all duration-300"
            >
              <div class="flex-shrink-0">
                <div :class="['w-12 h-12 rounded-xl flex items-center justify-center shadow-sm', achievement.color]">
                  <i :class="`pi ${achievement.icon} text-white text-lg`"></i>
                </div>
              </div>
              <div class="ml-4 flex-1">
                <h4 class="font-semibold text-gray-900">{{ achievement.title }}</h4>
                <p class="text-sm text-gray-600 mt-1">{{ achievement.description }}</p>
              </div>
              <div class="ml-4 text-right">
                <div class="text-sm text-gray-500">{{ achievement.date }}</div>
                <div v-if="achievement.icon === 'pi-star-fill'" class="mt-1">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <i class="pi pi-check mr-1"></i>
                    Achieved
                  </span>
                </div>
                <div v-else class="mt-1">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <i class="pi pi-clock mr-1"></i>
                    In Progress
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Progress Bar -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">Your Progress</span>
                <span class="text-sm font-bold text-blue-600">
                  {{ ((stats?.my?.totalAmount || 0) / 100 * 100).toFixed(0) }}%
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  :style="{ width: `${Math.min((stats?.my?.totalAmount || 0) / 100 * 100, 100)}%` }"
                ></div>
              </div>
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>$0</span>
                <span>$100 Goal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Performers Section -->
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Top Performers Leaderboard</h2>
              <p class="text-gray-600">Ranking of highest bonus earners this period</p>
            </div>
            <div class="flex items-center space-x-2">
              <button 
                @click="activeTab = 'top10'"
                :class="[
                  'px-4 py-2 rounded-lg font-medium transition-colors',
                  activeTab === 'top10' 
                    ? 'bg-blue-500 text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                Top 10
              </button>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="py-4 px-6 text-left text-sm font-semibold text-gray-900">Rank</th>
                <th class="py-4 px-6 text-left text-sm font-semibold text-gray-900">Username</th>
                <th class="py-4 px-6 text-left text-sm font-semibold text-gray-900">Total Bonus</th>
                <th class="py-4 px-6 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr 
                v-for="(user, index) in stats?.top || []" 
                :key="index"
                :class="[
                  'hover:bg-gray-50 transition-colors',
                  user.contactNumber === stats?.my?.contactNumber ? 'bg-blue-50' : ''
                ]"
              >
                <td class="py-4 px-6">
                  <div class="flex items-center">
                    <div 
                      :class="[
                        'w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-sm',
                        getRankColor(index)
                      ]"
                    >
                      {{ index + 1 }}
                    </div>
                    <div class="ml-3">
                      <div class="text-sm text-gray-500">
                        {{ index === 0 ? '🥇 Champion' : index === 1 ? '🥈 Runner-up' : index === 2 ? '🥉 3rd Place' : `Rank ${index + 1}` }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <div class="flex items-center">
                    <div :class="[
                      'w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-sm',
                      index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                      index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                      index === 2 ? 'bg-gradient-to-r from-orange-600 to-orange-700' :
                      'bg-gradient-to-r from-blue-500 to-blue-600'
                    ]">
                      {{ user.contactNumber.charAt(0).toUpperCase() }}
                    </div>
                    <div class="ml-3">
                      <div class="font-medium text-gray-900">
                        {{ user.contactNumber }}
                        <span 
                          v-if="user.contactNumber === stats?.my?.contactNumber"
                          class="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          <i class="pi pi-user mr-1"></i>
                          You
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <div class="font-bold text-lg text-gray-900">
                    {{ formatCurrency(user.totalAmount) }}
                  </div>
                  <div class="text-sm text-gray-500">Bonus earned</div>
                </td>
                <td class="py-4 px-6">
                  <span class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <i class="pi pi-check-circle mr-1.5"></i>
                    Active
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="!stats?.top?.length" class="py-16 text-center">
          <div class="text-gray-400 mb-4">
            <i class="pi pi-users text-6xl"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No data available</h3>
          <p class="text-gray-500">Pool bonus data will appear here once available</p>
        </div>

        <!-- Footer Stats -->
        <div v-if="stats?.top?.length" class="px-6 py-4 bg-gray-50 border-t">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 gap-2">
            <div class="flex items-center">
              <i class="pi pi-info-circle mr-2"></i>
              <span>Updated: {{ moment().format('MMM D, YYYY HH:mm') }}</span>
            </div>
            <div class="flex items-center space-x-4">
              <div>
                <span class="font-medium">{{ stats?.top?.length || 0 }}</span> total participants
              </div>
              <div>
                Pool value: <span class="font-medium">{{ formatCurrency(stats?.total?.totalAmount || 0) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Table row hover effect */
tbody tr {
  transition: all 0.2s ease;
}

/* Card hover effects */
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>