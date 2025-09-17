import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import LogoutView from '../views/LogoutView.vue'
import AddBookView from '../views/AddBookView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: LoginForm
  },
  {
    path: '/firebase-signin',
    name: 'firebase-signin',
    component: FirebaseSigninView
  },
  {
    path: '/FireRegister',
    name: 'FireRegister',
    component: FirebaseRegisterView
  },
  {
    path: '/logout',
    name: 'logout',
    component: LogoutView
  },
  {
    path: '/add-book',
    name: 'add-book',
    component: AddBookView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router