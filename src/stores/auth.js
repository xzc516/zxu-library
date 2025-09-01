import { ref } from 'vue'

// Simple auth store using Composition API (no external dependency)
const isAuthenticated = ref(false)

const hardcodedUsername = 'admin'
const hardcodedPassword = 'password123'

export function useAuth() {
  const login = (username, password) => {
    if (username === hardcodedUsername && password === hardcodedPassword) {
      isAuthenticated.value = true
      return true
    }
    isAuthenticated.value = false
    return false
  }

  const logout = () => {
    isAuthenticated.value = false
  }

  return { isAuthenticated, login, logout }
}


