<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/addBook">Add Book</router-link>
    <div>
      <form action="">
        <input type="text" v-model="searchTitle" placeholder="search book">
        <button type="submit" @click.prevent="search">Search</button>
      </form>
    </div>
    <p v-if="productStore.searchedBook == ' not found!'">No Books</p>
    <!-- <section v-for="(book, index) in books" :key="index" class="book">
      <section v-if="!editable || index !== editIndex">
        <h2>{{ book.title }}</h2>
        <em>by {{ book.author }}</em>
        <p><b>Description </b>{{ book.description }}</p>
        <p><b>Copies </b>{{ book.copies }}</p>
      </section>
      <section v-else-if="index === editIndex">
        <h2>{{ book.title }}</h2>
        <em>by {{ book.author }}</em>
        <p><b>Copies </b> <input type="text" v-model="copies"></p>
      </section>
      <p>{{ book.coverImagePath }}</p>
      <img src="book.coverImagePath" alt="Book Image">
      <button class="btn delete-book" @click="deleteBook(book)">Delete</button>
      <button v-if="!editable || index !== editIndex" class="btn edit-book" @click="editBook(book, index)">Edit</button>
      <button v-else-if="index === editIndex" class="btn edit-book" @click="saveEditBook(book)">Save</button>
    </section> -->
  </nav>
  <router-view/>
</template>
<script>
import { useProductStore } from './stores/ProductStore';
export default {
  setup(){
    const productStore = useProductStore()

    return {
      productStore
    }
  },
  data(){
    return {
      searchTitle: '',
      books: null,
      editable: false,
      editIndex: null,
      copies: null
    }
  },
  methods: {
    async search(){
      await this.productStore.search(this.searchTitle)
      console.log(this.productStore.searchedBook.length)
      if(this.productStore.searchedBook.length > 0){
        this.books = this.productStore.searchedBook
        return
      }
      this.books = null
    },
    async deleteBook(book) {
      await this.productStore.delete(book)
      this.books = this.productStore.searchedBook
    },
    editBook(book, index){
      console.log(book.title)
      console.log(index)
      this.copies = book.copies
      this.editable = true
      this.editIndex = index
    },
    async saveEditBook(book){
      console.log(book.copies)
      book.copies = this.copies
      console.log(book.copies)
      await this.productStore.edit(book)

      this.editable = false
      this.copies = null
      this.editIndex = null
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
.book{
  border: #2c3e50 solid 1px;
}
.btn{
  border: none;
  background-color: transparent;
  cursor: pointer;
}
.delete-book{
  color: red;
}
.edit-book{
  color: blue;
}
</style>
