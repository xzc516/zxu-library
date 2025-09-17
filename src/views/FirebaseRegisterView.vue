<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12 col-sm-10 offset-sm-1 col-md-6 offset-md-3">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center mb-0">Create an Account</h3>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                type="text"
                class="form-control"
                id="email"
                placeholder="Email"
                v-model="email"
              />
            </div>
            
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                placeholder="Password"
                v-model="password"
              />
            </div>
            
            <div class="mb-3">
              <label for="role" class="form-label">User Role</label>
              <select class="form-select" id="role" v-model="selectedRole">
                <option value="user">User</option>
                <option value="developer">Developer</option>
              </select>
            </div>
            
            <div class="d-grid gap-2">
              <button 
                class="btn btn-success" 
                @click="register"
                :disabled="loading"
              >
                {{ loading ? 'Creating Account...' : 'Save to Firebase' }}
              </button>
              
              <router-link to="/firebase-signin" class="btn btn-outline-primary">
                Already have an account? Sign In
              </router-link>
            </div>
            
            <div v-if="error" class="alert alert-danger mt-3">
              {{ error }}
            </div>
            
            <div v-if="successMessage" class="alert alert-success mt-3">
              {{ successMessage }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { auth, createUserWithEmailAndPassword } from "../Firebase/init.js"
import { useRouter } from "vue-router"

const email = ref("")
const password = ref("")
const selectedRole = ref("user")
const loading = ref(false)
const error = ref("")
const successMessage = ref("")
const router = useRouter()

const register = () => {
  error.value = ""
  successMessage.value = ""
  loading.value = true
  
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
      console.log("Firebase Register Successful!")
      console.log("User Role:", selectedRole.value)
      console.log("User Email:", email.value)
      console.log("User Data:", data.user)
      
      // Store user role with email as key for demonstration
      const userRoles = JSON.parse(localStorage.getItem('userRoles') || '{}')
      userRoles[email.value] = selectedRole.value
      localStorage.setItem('userRoles', JSON.stringify(userRoles))
      localStorage.setItem('userEmail', email.value)
      
      successMessage.value = `Account created successfully! Role: ${selectedRole.value}`
      
      // Clear form
      email.value = ""
      password.value = ""
      selectedRole.value = "user"
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/firebase-signin")
      }, 2000)
      
    }).catch((err) => {
      console.log("Registration Error:", err.code)
      console.log("Error Message:", err.message)
      
      // Handle specific Firebase auth errors
      switch (err.code) {
        case 'auth/email-already-in-use':
          error.value = 'This email address is already registered. Please use a different email or sign in.'
          break
        case 'auth/invalid-email':
          error.value = 'Please enter a valid email address.'
          break
        case 'auth/weak-password':
          error.value = 'Password should be at least 6 characters long.'
          break
        case 'auth/network-request-failed':
          error.value = 'Network error. Please check your internet connection and try again.'
          break
        default:
          error.value = err.message || 'Registration failed. Please try again.'
      }
    }).finally(() => {
      loading.value = false
    })
}
</script>

<style scoped>
.card {
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.card-header {
  background-color: #28a745;
  color: white;
  border-radius: 10px 10px 0 0;
  padding: 20px;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

.btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
}
</style>