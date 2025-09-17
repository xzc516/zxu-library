<template>
  <div class="advanced-query mt-4">
    <div class="card">
      <div class="card-header">
        <h4 class="mb-0">🔍 Advanced Database Queries</h4>
        <small class="text-muted">Demonstrating WHERE, ORDER BY, and LIMIT</small>
      </div>
      <div class="card-body">
        <!-- Query Controls -->
        <div class="row mb-4">
          <div class="col-md-3">
            <label class="form-label">ISBN Filter:</label>
            <select v-model="queryParams.isbnFilter" class="form-select" @change="executeQuery">
              <option value="all">All Books</option>
              <option value="gt1000">ISBN > 1000</option>
              <option value="lt1000">ISBN < 1000</option>
              <option value="eq">ISBN = Specific</option>
            </select>
          </div>
          
          <div class="col-md-3" v-if="queryParams.isbnFilter === 'eq'">
            <label class="form-label">Specific ISBN:</label>
            <input 
              v-model="queryParams.specificIsbn" 
              type="number" 
              class="form-control"
              @input="executeQuery"
              placeholder="Enter ISBN"
            />
          </div>
          
          <div class="col-md-3">
            <label class="form-label">Sort by:</label>
            <select v-model="queryParams.sortBy" class="form-select" @change="executeQuery">
              <option value="createdAt">Date Added</option>
              <option value="name">Book Name</option>
              <option value="isbn">ISBN</option>
            </select>
          </div>
          
          <div class="col-md-3">
            <label class="form-label">Order:</label>
            <select v-model="queryParams.sortOrder" class="form-select" @change="executeQuery">
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
        
        <div class="row mb-4">
          <div class="col-md-3">
            <label class="form-label">Limit Results:</label>
            <select v-model="queryParams.limit" class="form-select" @change="executeQuery">
              <option :value="null">No Limit</option>
              <option :value="1">1 book</option>
              <option :value="3">3 books</option>
              <option :value="5">5 books</option>
              <option :value="10">10 books</option>
            </select>
          </div>
          
          <div class="col-md-9 d-flex align-items-end">
            <button @click="executeQuery" class="btn btn-primary me-2">
              🔍 Execute Query
            </button>
            <button @click="showQueryCode = !showQueryCode" class="btn btn-outline-info">
              {{ showQueryCode ? 'Hide' : 'Show' }} Query Code
            </button>
          </div>
        </div>
        
        <!-- Query Code Display -->
        <div v-if="showQueryCode" class="alert alert-info mb-4">
          <h6>Current Firestore Query Code:</h6>
          <pre class="mb-0"><code>{{ currentQueryCode }}</code></pre>
        </div>
        
        <!-- Results -->
        <div v-if="loading" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Executing query...</span>
          </div>
          <p class="mt-2">Executing advanced query...</p>
        </div>
        
        <div v-else-if="error" class="alert alert-danger">
          {{ error }}
        </div>
        
        <div v-else>
          <h5>Query Results ({{ books.length }} found)</h5>
          
          <div v-if="books.length === 0" class="alert alert-warning">
            No books match your query criteria.
          </div>
          
          <div v-else>
            <div class="table-responsive">
              <table class="table table-striped table-hover">
                <thead class="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Book Name</th>
                    <th>ISBN</th>
                    <th>Date Added</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(book, index) in books" :key="book.id">
                    <td>{{ index + 1 }}</td>
                    <td><strong>{{ book.name }}</strong></td>
                    <td>
                      <span class="badge bg-secondary">{{ book.isbn }}</span>
                    </td>
                    <td>{{ formatDate(book.createdAt) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { 
  db, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit, 
  getDocs 
} from '../Firebase/init.js'

const books = ref([])
const loading = ref(false)
const error = ref('')
const showQueryCode = ref(false)

const queryParams = ref({
  isbnFilter: 'all',
  specificIsbn: 1000,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  limit: null
})

const currentQueryCode = computed(() => {
  let code = 'const q = query(\n  collection(db, "books")'
  
  // Add WHERE clause
  if (queryParams.value.isbnFilter === 'gt1000') {
    code += ',\n  where("isbn", ">", 1000)'
  } else if (queryParams.value.isbnFilter === 'lt1000') {
    code += ',\n  where("isbn", "<", 1000)'
  } else if (queryParams.value.isbnFilter === 'eq') {
    code += `,\n  where("isbn", "==", ${queryParams.value.specificIsbn})`
  }
  
  // Add ORDER BY clause
  code += `,\n  orderBy("${queryParams.value.sortBy}", "${queryParams.value.sortOrder}")`
  
  // Add LIMIT clause
  if (queryParams.value.limit) {
    code += `,\n  limit(${queryParams.value.limit})`
  }
  
  code += '\n)'
  return code
})

const executeQuery = async () => {
  try {
    loading.value = true
    error.value = ''
    
    console.log('Executing advanced query with params:', queryParams.value)
    console.log('Query code:', currentQueryCode.value)
    
    let q = collection(db, 'books')
    let constraints = []
    
    // Add WHERE constraint
    if (queryParams.value.isbnFilter === 'gt1000') {
      constraints.push(where('isbn', '>', 1000))
    } else if (queryParams.value.isbnFilter === 'lt1000') {
      constraints.push(where('isbn', '<', 1000))
    } else if (queryParams.value.isbnFilter === 'eq' && queryParams.value.specificIsbn) {
      constraints.push(where('isbn', '==', Number(queryParams.value.specificIsbn)))
    }
    
    // Add ORDER BY constraint
    constraints.push(orderBy(queryParams.value.sortBy, queryParams.value.sortOrder))
    
    // Add LIMIT constraint
    if (queryParams.value.limit) {
      constraints.push(firestoreLimit(queryParams.value.limit))
    }
    
    // Build final query
    q = query(q, ...constraints)
    
    const querySnapshot = await getDocs(q)
    const booksArray = []
    
    querySnapshot.forEach((doc) => {
      const bookData = { id: doc.id, ...doc.data() }
      booksArray.push(bookData)
      console.log('Query result:', bookData)
    })
    
    books.value = booksArray
    console.log(`Advanced query completed. Found ${booksArray.length} books.`)
    
  } catch (err) {
    console.error('Error executing advanced query:', err)
    error.value = `Query error: ${err.message}`
  } finally {
    loading.value = false
  }
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString()
}

// Execute initial query when component mounts
onMounted(() => {
  executeQuery()
})

// Expose method for parent component
defineExpose({ executeQuery })
</script>

<style scoped>
.advanced-query {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #dee2e6;
}

.card {
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #17a2b8;
  color: white;
  border-radius: 10px 10px 0 0;
}

.card-header h4 {
  color: white;
}

pre {
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  font-size: 0.9em;
}

.table-responsive {
  max-height: 400px;
  overflow-y: auto;
}

.badge {
  font-size: 0.9em;
}
</style>