<template>
  <div class="query-booklist mt-4">
    <div class="card">
      <div class="card-header">
        <h4 class="mb-0">📖 Books with ISBN > 1000</h4>
      </div>
      <div class="card-body">
        <div v-if="loading" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2">Querying books...</p>
        </div>
        
        <div v-else-if="error" class="alert alert-danger">
          {{ error }}
        </div>
        
        <div v-else-if="books.length === 0" class="alert alert-info">
          No books found with ISBN > 1000. Try adding some books with higher ISBN numbers!
        </div>
        
        <div v-else>
          <ul class="list-group list-group-flush">
            <li 
              v-for="book in books" 
              :key="book.id" 
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{{ book.name }}</strong>
                <br>
                <small class="text-muted">ISBN: {{ book.isbn }}</small>
              </div>
              <span class="badge bg-primary rounded-pill">
                {{ book.isbn }}
              </span>
            </li>
          </ul>
          
          <div class="mt-3">
            <small class="text-muted">
              Found {{ books.length }} book(s) with ISBN > 1000
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db, collection, query, where, getDocs } from '../Firebase/init.js'

const books = ref([])
const loading = ref(true)
const error = ref('')

const fetchBooks = async () => {
  try {
    loading.value = true
    error.value = ''
    
    console.log('Querying books with ISBN > 1000...')
    
    // Create query to find books with ISBN > 1000
    const q = query(
      collection(db, 'books'), 
      where('isbn', '>', 1000)
    )
    
    const querySnapshot = await getDocs(q)
    const booksArray = []
    
    querySnapshot.forEach((doc) => {
      const bookData = { id: doc.id, ...doc.data() }
      booksArray.push(bookData)
      console.log('Found book:', bookData)
    })
    
    books.value = booksArray
    console.log(`Total books found: ${booksArray.length}`)
    
  } catch (error) {
    console.error('Error fetching books:', error)
    error.value = `Error fetching books: ${error.message}`
  } finally {
    loading.value = false
  }
}

// Load books when component mounts
onMounted(() => {
  fetchBooks()
})

// Expose fetchBooks method for parent component to refresh data
defineExpose({ fetchBooks })
</script>

<style scoped>
.query-booklist {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #dee2e6;
}

.card {
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #6f42c1;
  color: white;
  border-radius: 10px 10px 0 0;
}

.card-header h4 {
  color: white;
}

.list-group-item {
  border: 1px solid #dee2e6;
  margin-bottom: 5px;
  border-radius: 5px;
  transition: background-color 0.2s;
}

.list-group-item:hover {
  background-color: #f8f9fa;
}

.badge {
  font-size: 0.9em;
}
</style>