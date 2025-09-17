<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12 col-sm-10 offset-sm-1 col-md-6 offset-md-3">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center mb-0">Logout</h3>
          </div>
          <div class="card-body text-center">
            <div v-if="currentUser" class="alert alert-info">
              <h5>Current User Information</h5>
              <p><strong>Email:</strong> {{ currentUser.email }}</p>
              <p><strong>UID:</strong> {{ currentUser.uid }}</p>
              <p><strong>Role:</strong> {{ userRole }}</p>
              <p><strong>Login Time:</strong> {{ loginTime }}</p>
            </div>
            
            <div v-if="!loggedOut">
              <p>Are you sure you want to logout?</p>
              <div class="d-grid gap-2">
                <button class="btn btn-danger" @click="logout">
                  Logout from Firebase
                </button>
                <router-link to="/" class="btn btn-outline-secondary">
                  Cancel
                </router-link>
              </div>
            </div>
            
            <div v-else class="alert alert-success">
              <h5>Successfully Logged Out!</h5>
              <p>You have been logged out from the system.</p>
              <router-link to="/firebase-signin" class="btn btn-primary">
                Sign In Again
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { auth, signOut } from "../Firebase/init.js"
import { useRouter } from "vue-router"

const currentUser = ref(null)
const userRole = ref("")
const loginTime = ref("")
const loggedOut = ref(false)
const router = useRouter()

onMounted(() => {
  // Get current user information
  currentUser.value = auth.currentUser
  userRole.value = localStorage.getItem('currentUserRole') || 'user'
  loginTime.value = localStorage.getItem('loginTime') || new Date().toLocaleString()
  
  console.log("=== LOGOUT PAGE - CURRENT USER INFO ===")
  console.log("Current User:", currentUser.value)
  console.log("User Email:", currentUser.value?.email)
  console.log("User UID:", currentUser.value?.uid)
  console.log("User Role:", userRole.value)
  console.log("Login Time:", loginTime.value)
  console.log("Page loaded at:", new Date().toLocaleString())
  console.log("======================================")
})

const logout = () => {
  console.log("=== LOGOUT PROCESS STARTED ===")
  console.log("User before logout:", auth.currentUser)
  
  signOut(auth)
    .then(() => {
      console.log("Firebase Logout Successful!")
      console.log("User after logout:", auth.currentUser)
      console.log("Logout timestamp:", new Date().toLocaleString())
      
      // Clear stored user data
      localStorage.removeItem('currentUserRole')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('loginTime')
      
      loggedOut.value = true
      
      console.log("User data cleared from localStorage")
      console.log("=== LOGOUT COMPLETED ===")
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/firebase-signin")
      }, 3000)
      
    }).catch((error) => {
      console.log("Logout Error:", error.code)
      console.log("Error Message:", error.message)
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
  background-color: #dc3545;
  color: white;
  border-radius: 10px 10px 0 0;
  padding: 20px;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
  border-color: #bd2130;
}

.alert-info {
  background-color: #d1ecf1;
  border-color: #bee5eb;
  color: #0c5460;
}

.alert-success {
  background-color: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
}
</style>