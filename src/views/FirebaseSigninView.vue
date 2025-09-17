<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12 col-sm-10 offset-sm-1 col-md-6 offset-md-3">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center mb-0">Sign In</h3>
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
            
            <div class="d-grid gap-2">
              <button 
                class="btn btn-primary" 
                @click="signin"
                :disabled="loading"
              >
                {{ loading ? 'Signing in...' : 'Sign in via Firebase' }}
              </button>
              
              <router-link to="/FireRegister" class="btn btn-outline-success">
                Need an account? Register
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
import { auth, signInWithEmailAndPassword } from "../Firebase/init.js"
import { useRouter } from "vue-router"

const email = ref("")
const password = ref("")
const loading = ref(false)
const error = ref("")
const successMessage = ref("")
const router = useRouter()

const signin = () => {
  error.value = ""
  successMessage.value = ""
  loading.value = true
  
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
      console.log("Firebase Sign In Successful!")
      console.log("Current User:", auth.currentUser)
      console.log("User Email:", auth.currentUser?.email)
      console.log("User UID:", auth.currentUser?.uid)
      
      // Get user role based on current user's email
      const userEmail = auth.currentUser?.email
      const userRoles = JSON.parse(localStorage.getItem('userRoles') || '{}')
      const userRole = userRoles[userEmail] || 'user'
      const loginTime = new Date().toLocaleString()
      
      localStorage.setItem('currentUserRole', userRole)
      localStorage.setItem('loginTime', loginTime)
      
      console.log("User Role:", userRole)
      console.log("User Email from Auth:", userEmail)
      console.log("All User Roles:", userRoles)
      console.log("Sign in timestamp:", loginTime)
      
      successMessage.value = `Welcome back! Signed in as ${userRole}`
      
      // Redirect after showing success message
      setTimeout(() => {
        router.push("/")
      }, 1500)
      
    }).catch((err) => {
      console.log("Sign In Error:", err.code)
      console.log("Error Message:", err.message)
      
      // Handle specific Firebase auth errors
      switch (err.code) {
        case 'auth/user-not-found':
          error.value = 'No account found with this email address. Please register first.'
          break
        case 'auth/wrong-password':
          error.value = 'Incorrect password. Please try again.'
          break
        case 'auth/invalid-email':
          error.value = 'Please enter a valid email address.'
          break
        case 'auth/user-disabled':
          error.value = 'This account has been disabled.'
          break
        case 'auth/too-many-requests':
          error.value = 'Too many failed attempts. Please try again later.'
          break
        case 'auth/network-request-failed':
          error.value = 'Network error. Please check your internet connection.'
          break
        default:
          error.value = err.message || 'Sign in failed. Please try again.'
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
  background-color: #275fda;
  color: white;
  border-radius: 10px 10px 0 0;
  padding: 20px;
}

.btn-primary {
  background-color: #275fda;
  border-color: #275fda;
}

.btn-primary:hover {
  background-color: #1e4ba8;
  border-color: #1e4ba8;
}
</style>