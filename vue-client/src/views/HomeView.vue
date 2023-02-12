<template>
  <div class="home">
    <!-- <ProductDisplay v-for="(book, index) in books" :key="index" :book="book"></ProductDisplay> -->
    <p v-if="!getBooks">No Book Found!!</p>
    <ProductDisplay v-else v-for="(book, index) in getBooks" :key="index" :book="book" @delete-book="deleteBook" msg="Products are displaying"/>
  </div>
</template>

<script>
// @ is an alias to /src
import ProductDisplay from '@/components/ProductDisplay.vue'
import { useProductStore } from '@/stores/ProductStore'
import { mapState } from 'pinia'

export default {
  name: 'HomeView',
  setup(){
    const productStore = useProductStore()
    productStore.fill()

    return {
      productStore
    }
  },
  components: {
    ProductDisplay
  },
  methods:{
    async deleteBook(book){
      console.log(book.title)

      await this.productStore.delete(book)
    }
  },
  computed:{
    ...mapState(useProductStore, {
      books: 'books'
    }),
    getBooks(){
      if(!this.productStore.isSearch) {
        return this.books
      }

      const searchedBook = this.productStore.searchedBook
      return searchedBook.length > 0 ? searchedBook : null
    }
  }
}
</script>
