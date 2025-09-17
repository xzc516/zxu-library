<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">
        📚 ZXU Library
      </router-link>
      
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
        aria-controls="navbarNav" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link 
              class="nav-link" 
              to="/"
              :class="{ active: $route.path === '/' }"
            >
              Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link 
              class="nav-link" 
              to="/firebase-signin"
              :class="{ active: $route.path === '/firebase-signin' }"
            >
              Sign In
            </router-link>
          </li>
          <li class="nav-item">
            <router-link 
              class="nav-link" 
              to="/FireRegister"
              :class="{ active: $route.path === '/FireRegister' }"
            >
              Register
            </router-link>
          </li>
          <li class="nav-item">
            <router-link 
              class="nav-link" 
              to="/add-book"
              :class="{ active: $route.path === '/add-book' }"
            >
              Add Book
            </router-link>
          </li>
          <li class="nav-item">
            <router-link 
              class="nav-link" 
              to="/logout"
              :class="{ active: $route.path === '/logout' }"
            >
              Logout
            </router-link>
          </li>
        </ul>
        
        <ul class="navbar-nav">
          <li class="nav-item">
            <span class="navbar-text">
              Welcome to ZXU Library System
            </span>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
// No reactive data needed for this simple navigation component
</script>

<style scoped>
.navbar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  font-weight: bold;
  font-size: 1.5rem;
}

.nav-link {
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #ffffff !important;
}

.nav-link.active {
  color: #ffffff !important;
  font-weight: bold;
}

.navbar-text {
  color: rgba(255, 255, 255, 0.8) !important;
  font-style: italic;
}
</style>