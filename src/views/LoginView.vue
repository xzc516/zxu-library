<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'

const router = useRouter()
const { isAuthenticated, login } = useAuth()

const username = ref('')
const password = ref('')
const error = ref('')

const handleSubmit = () => {
  const ok = login(username.value, password.value)
  if (ok) {
    error.value = ''
    router.push('/about')
  } else {
    error.value = 'Invalid credentials. Try admin / password123'
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <h1 class="text-center">Member Login</h1>
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input id="username" type="text" class="form-control" v-model="username" />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input id="password" type="password" class="form-control" v-model="password" />
          </div>
          <div v-if="error" class="text-danger mb-3">{{ error }}</div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary">Login</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>


