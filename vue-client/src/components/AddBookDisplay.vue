<template>
    <div class="hello">
      <h2>Add Book Here</h2>
      <form action="http://localhost:9000/books/" method="POST" id="formAddBook" enctype="multipart/form-data">
        <div>
          <label class="label" for="name">Title</label>
          <input class="" type="text" name="title">
        </div>
        <label class="label" for="description">Description</label>
        <div>
          <textarea name="description" id="" cols="30" rows="5"></textarea>
        </div>
        <div>
          <label class="label" for="author">Author</label>
          <input class="" type="text" name="author">
        </div>
        <div>
          <label class="label" for="copies">Copies</label>
          <input class="" type="number" name="copies">
        </div>
        <div>
          <label class="label" for="cover">Cover</label>
          <input class="" type="file" name="cover" @change="onFileSelected">
        </div>
  
        <button type="submit" @click.prevent="addBook">Submit</button>
      </form>
      <p>{{ fetch_status }}</p>
      <section v-if="book.title" class="book">
        <h2>{{ book.title }}</h2>
        <em>by {{ book.author }}</em>
        <p><b>Description </b>{{ book.description }}</p>
        <p><b>Copies </b>{{ book.copies }}</p>
        <p>{{ book.coverImagePath }}</p>
        <img :src="book.coverImagePath" alt="Image of book">
      </section>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  import { useProductStore } from '@/stores/ProductStore'
  
  export default {
    name: 'AddBookDisplay',
    setup() {
      const productStore = useProductStore()
  
      return {
        productStore
      }
    },
    props: {
      msg: String
    },
    data(){
      return {
        fetch_status: 'Fetching...',
        book: 'No books',
        selectedFile: null
      }
    },
    created(){
      axios({
        method: 'get',
        url: 'http://localhost:9000/',
        responseType: 'stream'
      }).then( (response) => {
        console.log(response.data)
        this.fetch_status = 'success'
      }).catch( (error) => {
        this.fetch_status = 'failed'
        console.log(error.message)
      })
    },
    methods: {
      onFileSelected(event){
        console.log(event.target.files[0])
        this.selectedFile = event.target.files[0]
      },
      async addBook(){
        const form1 = document.forms['formAddBook']

        const formData = new FormData(form1)

        await this.productStore.setBook(formData)
  
        this.book = this.productStore.newBook
      }
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  .book{
    border: gray solid 1px;
  }
  </style>
  