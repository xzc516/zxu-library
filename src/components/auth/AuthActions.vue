<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'

const router = useRouter()
const { isAuthenticated, logout } = useAuth()

const goLogin = () => router.push('/login')
const doLogout = () => {
  logout()
  router.push('/login')
}

const label = computed(() => (isAuthenticated.value ? 'Logout' : 'Login'))
</script>

<template>
  <button
    v-if="!isAuthenticated"
    type="button"
    class="btn btn-outline-primary"
    @click="goLogin"
  >
    {{ label }}
  </button>
  <button
    v-else
    type="button"
    class="btn btn-outline-danger"
    @click="doLogout"
  >
    {{ label }}
  </button>
  
</template>

<style scoped>
</style>


