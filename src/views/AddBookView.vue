<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12 col-sm-10 offset-sm-1 col-md-6 offset-md-3">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center mb-0">Add Book</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="addBook">
              <div class="mb-3">
                <label for="isbn" class="form-label">ISBN:</label>
                <input 
                  type="text" 
                  class="form-control"
                  v-model="isbn" 
                  id="isbn" 
                  required 
                  placeholder="Enter ISBN number"
                />
              </div>
              
              <div class="mb-3">
                <label for="name" class="form-label">Name:</label>
                <input 
                  type="text" 
                  class="form-control"
                  v-model="name" 
                  id="name" 
                  required 
                  placeholder="Enter book name"
                />
              </div>
              
              <div class="d-grid">
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  :disabled="loading"
                >
                  {{ loading ? 'Adding Book...' : 'Add Book' }}
                </button>
              </div>
            </form>
            
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
    
    <!-- Advanced Query Component - WHERE, ORDER BY, LIMIT -->
    <div class="row mt-5">
      <div class="col-12">
        <AdvancedQuery ref="advancedQueryRef" />
      </div>
    </div>
    
    <!-- Query Book List Component - Books with ISBN > 1000 -->
    <div class="row mt-5">
      <div class="col-12">
        <QueryBookList ref="queryBookListRef" />
      </div>
    </div>
    
    <!-- All Books List Component with UPDATE/DELETE -->
    <div class="row mt-5" v-if="showBookList">
      <div class="col-12">
        <BookList ref="bookListRef" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { db, collection, addDoc } from '../Firebase/init.js'
import BookList from '../components/BookList.vue'
import QueryBookList from '../components/QueryBookList.vue'
import AdvancedQuery from '../components/AdvancedQuery.vue'

const isbn = ref('')
const name = ref('')
const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const showBookList = ref(true)

// References to child components
const bookListRef = ref(null)
const queryBookListRef = ref(null)
const advancedQueryRef = ref(null)

const addBook = async () => {
  error.value = ''
  successMessage.value = ''
  loading.value = true
  
  try {
    // Convert ISBN to number
    const isbnNumber = Number(isbn.value)
    
    if (isNaN(isbnNumber)) {
      error.value = 'ISBN must be a valid number'
      loading.value = false
      return
    }
    
    // Add book to Firestore
    await addDoc(collection(db, 'books'), {
      isbn: isbnNumber,
      name: name.value,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    // Clear form
    isbn.value = ''
    name.value = ''
    
    successMessage.value = 'Book added successfully!'
    console.log('Book added to Firestore successfully!')
    
    // Refresh all components to show the new book
    if (bookListRef.value && bookListRef.value.loadBooks) {
      bookListRef.value.loadBooks()
    }
    if (queryBookListRef.value && queryBookListRef.value.fetchBooks) {
      queryBookListRef.value.fetchBooks()
    }
    if (advancedQueryRef.value && advancedQueryRef.value.executeQuery) {
      advancedQueryRef.value.executeQuery()
    }
    
  } catch (error) {
    console.error('Error adding book:', error)
    error.value = `Error adding book: ${error.message}`
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.card {
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.card-header {
  background-color: #17a2b8;
  color: white;
  border-radius: 10px 10px 0 0;
  padding: 20px;
}

.btn-primary {
  background-color: #17a2b8;
  border-color: #17a2b8;
}

.btn-primary:hover {
  background-color: #138496;
  border-color: #117a8b;
}

.btn-primary:disabled {
  background-color: #6c757d;
  border-color: #6c757d;
}
</style>