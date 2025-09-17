// Firestore service functions
import { 
  db, 
  collection, 
  doc, 
  addDoc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from './init.js'

// User collection operations
export const userService = {
  // Create user profile in Firestore
  async createUserProfile(userId, userData) {
    try {
      await setDoc(doc(db, 'users', userId), {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      console.log('User profile created successfully')
      return true
    } catch (error) {
      console.error('Error creating user profile:', error)
      throw error
    }
  },

  // Get user profile
  async getUserProfile(userId) {
    try {
      const docRef = doc(db, 'users', userId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return docSnap.data()
      } else {
        console.log('No user profile found')
        return null
      }
    } catch (error) {
      console.error('Error getting user profile:', error)
      throw error
    }
  },

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...updates,
        updatedAt: new Date()
      })
      console.log('User profile updated successfully')
      return true
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  },

  // Get all users
  async getAllUsers() {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'))
      const users = []
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() })
      })
      return users
    } catch (error) {
      console.error('Error getting users:', error)
      throw error
    }
  }
}

// Books collection operations
export const bookService = {
  // Add a new book
  async addBook(bookData) {
    try {
      const docRef = await addDoc(collection(db, 'books'), {
        ...bookData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      console.log('Book added with ID:', docRef.id)
      return docRef.id
    } catch (error) {
      console.error('Error adding book:', error)
      throw error
    }
  },

  // Get all books
  async getAllBooks() {
    try {
      const querySnapshot = await getDocs(collection(db, 'books'))
      const books = []
      querySnapshot.forEach((doc) => {
        books.push({ id: doc.id, ...doc.data() })
      })
      return books
    } catch (error) {
      console.error('Error getting books:', error)
      throw error
    }
  },

  // Get books by category
  async getBooksByCategory(category) {
    try {
      const q = query(collection(db, 'books'), where('category', '==', category))
      const querySnapshot = await getDocs(q)
      const books = []
      querySnapshot.forEach((doc) => {
        books.push({ id: doc.id, ...doc.data() })
      })
      return books
    } catch (error) {
      console.error('Error getting books by category:', error)
      throw error
    }
  },

  // Real-time listener for books
  onBooksSnapshot(callback) {
    return onSnapshot(collection(db, 'books'), (snapshot) => {
      const books = []
      snapshot.forEach((doc) => {
        books.push({ id: doc.id, ...doc.data() })
      })
      callback(books)
    })
  }
}

// Activity logs
export const activityService = {
  // Log user activity
  async logActivity(userId, activity) {
    try {
      await addDoc(collection(db, 'activities'), {
        userId,
        activity,
        timestamp: new Date(),
        type: activity.type || 'general'
      })
      console.log('Activity logged successfully')
    } catch (error) {
      console.error('Error logging activity:', error)
      throw error
    }
  },

  // Get user activities
  async getUserActivities(userId, limit = 10) {
    try {
      const q = query(
        collection(db, 'activities'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(limit)
      )
      const querySnapshot = await getDocs(q)
      const activities = []
      querySnapshot.forEach((doc) => {
        activities.push({ id: doc.id, ...doc.data() })
      })
      return activities
    } catch (error) {
      console.error('Error getting user activities:', error)
      throw error
    }
  }
}

console.log('Firestore services initialized successfully!')
console.log('Available services: userService, bookService, activityService');