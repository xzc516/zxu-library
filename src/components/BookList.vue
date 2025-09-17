<template>
  <div class="book-list">
    <h4>📚 Book Collection</h4>
    
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p>Loading books...</p>
    </div>
    
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    
    <div v-else-if="books.length === 0" class="alert alert-info">
      No books found. Add your first book above!
    </div>
    
    <div v-else>
      <div class="row">
        <div 
          v-for="book in books" 
          :key="book.id" 
          class="col-12 col-md-6 col-lg-4 mb-3"
        >
          <div class="card h-100">
            <div class="card-body">
              <div v-if="editingBook === book.id">
                <!-- Edit Mode -->
                <div class="mb-2">
                  <input 
                    v-model="editForm.name" 
                    class="form-control mb-2" 
                    placeholder="Book Name"
                  />
                  <input 
                    v-model="editForm.isbn" 
                    type="number" 
                    class="form-control" 
                    placeholder="ISBN"
                  />
                </div>
                <div class="d-flex gap-2">
                  <button 
                    @click="saveEdit(book.id)" 
                    class="btn btn-success btn-sm"
                    :disabled="updating"
                  >
                    {{ updating ? 'Saving...' : 'Save' }}
                  </button>
                  <button 
                    @click="cancelEdit()" 
                    class="btn btn-secondary btn-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              
              <div v-else>
                <!-- View Mode -->
                <h5 class="card-title">{{ book.name }}</h5>
                <p class="card-text">
                  <strong>ISBN:</strong> {{ book.isbn }}<br>
                  <small class="text-muted">
                    Added: {{ formatDate(book.createdAt) }}
                  </small>
                </p>
                <div class="d-flex gap-2 mt-2">
                  <button 
                    @click="startEdit(book)" 
                    class="btn btn-outline-primary btn-sm"
                  >
                    Edit
                  </button>
                  <button 
                    @click="deleteBook(book.id, book.name)" 
                    class="btn btn-outline-danger btn-sm"
                    :disabled="deleting === book.id"
                  >
                    {{ deleting === book.id ? 'Deleting...' : 'Delete' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-3">
        <small class="text-muted">Total books: {{ books.length }}</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { bookService } from '../Firebase/firestoreService.js'
import { db, doc, updateDoc, deleteDoc } from '../Firebase/init.js'

const books = ref([])
const loading = ref(true)
const error = ref('')

// Edit functionality
const editingBook = ref(null)
const editForm = ref({ name: '', isbn: '' })
const updating = ref(false)
const deleting = ref(null)

const loadBooks = async () => {
  try {
    loading.value = true
    books.value = await bookService.getAllBooks()
    console.log('Books loaded:', books.value)
  } catch (err) {
    console.error('Error loading books:', err)
    error.value = 'Failed to load books'
  } finally {
    loading.value = false
  }
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown'
  
  // Handle Firestore Timestamp
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString()
}

// Edit functionality
const startEdit = (book) => {
  editingBook.value = book.id
  editForm.value = {
    name: book.name,
    isbn: book.isbn
  }
  console.log('Started editing book:', book.id)
}

const cancelEdit = () => {
  editingBook.value = null
  editForm.value = { name: '', isbn: '' }
  console.log('Cancelled editing')
}

const saveEdit = async (bookId) => {
  try {
    updating.value = true
    
    const isbnNumber = Number(editForm.value.isbn)
    if (isNaN(isbnNumber)) {
      alert('ISBN must be a valid number')
      return
    }
    
    console.log('Updating book:', bookId, editForm.value)
    
    await updateDoc(doc(db, 'books', bookId), {
      name: editForm.value.name,
      isbn: isbnNumber,
      updatedAt: new Date()
    })
    
    console.log('Book updated successfully in Firestore')
    
    // Refresh the book list
    await loadBooks()
    
    // Exit edit mode
    editingBook.value = null
    editForm.value = { name: '', isbn: '' }
    
    alert('Book updated successfully!')
    
  } catch (error) {
    console.error('Error updating book:', error)
    alert('Error updating book: ' + error.message)
  } finally {
    updating.value = false
  }
}

const deleteBook = async (bookId, bookName) => {
  try {
    const confirmed = confirm(`Are you sure you want to delete "${bookName}"?`)
    if (!confirmed) return
    
    deleting.value = bookId
    console.log('Deleting book:', bookId)
    
    await deleteDoc(doc(db, 'books', bookId))
    
    console.log('Book deleted successfully from Firestore')
    
    // Refresh the book list
    await loadBooks()
    
    alert('Book deleted successfully!')
    
  } catch (error) {
    console.error('Error deleting book:', error)
    alert('Error deleting book: ' + error.message)
  } finally {
    deleting.value = null
  }
}

// Load books when component mounts
onMounted(() => {
  loadBooks()
})

// Expose loadBooks method for parent component
defineExpose({ loadBooks })
</script>

<style scoped>
.book-list {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #dee2e6;
}

.card {
  border: 1px solid #dee2e6;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  color: #17a2b8;
  font-weight: bold;
}

h4 {
  color: #17a2b8;
  margin-bottom: 20px;
}
</style>