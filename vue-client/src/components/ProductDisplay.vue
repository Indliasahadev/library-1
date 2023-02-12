<template>
  <div class="">
    <input type="text" v-model="some">
    <section class="book-content">
      <section v-if="!editable" class="book-box">
        <div class="book-image">
          <img :src="book.coverImagePath" alt="Book Image">
        </div>
        <div class="book-info">
          <h3>{{ book.title }}</h3>
          <em>by {{ book.author }}</em>
          <p>Description {{ book.description }}</p>
          <p>Copies {{ book.copies }}</p>
        </div>
        <!-- <p>{{ book.coverImagePath }}</p> -->
      </section>
      <section v-else>
        <form id="editForm" action="" enctype="multipart/form-data">
          <h3><input name="title" type="text" :value="book.title" placeholder="Title"></h3>
          <em><input name="author" type="text" :value="book.author" placeholder="Author"></em>
          <p><textarea name="description" id="" :value="book.description" placeholder="Description" cols="30" rows="10"></textarea></p>
          <p><input name="copies" type="number" :value="book.copies" placeholder="Copies"></p>
          <img :src="book.coverImagePath" alt="Book Image">

          <section class="book-op-btn">
            <button type="submit" @click.prevent="saveEdit">Save</button>
            <button type="submit" class="btn-none" @click.prevent="cancelEdit">Cancel</button>
          </section>
        </form>
      </section>

      <section v-if="!editable" class="book-op-btn">
        <button class="btn-none btn-delete" @click="deleteBtn">Delete</button>
        <button class="btn-none btn-edit" @click="editBook">Edit</button>
      </section>
    </section>
  </div>
</template>

<script>
import { useProductStore } from '@/stores/ProductStore'

export default{
  setup(){
    const productStore = useProductStore()

    return {
      productStore
    }
  },
  props:{
    book: {
      type: Object,
      require: true
    }
  },
  data(){
    return {
      editable: false,
      some: 'aa'
    }
  },
  emits: {
    deleteBook({ _id, id, coverImageName, coverImagePath, title, author, description, copies }){
      console.log('emitting...')
      console.log(_id && id && coverImageName && coverImagePath && title && author && description && copies ? true : false)
      return _id && id && coverImageName && coverImagePath && title && author && description && copies ? true : false
    }
  },
  watch: {
    some(value){
      console.log('Value has changes ', value)
    }
  },
  mounted(){
    setTimeout( () => {
      this.some = 'Hey Bro!!'
    }, 2200)
  },
  methods: {
    editBook(){
      this.editable = true
    },
    cancelEdit(){
      this.editable = false
    },
    deleteBtn(){
      console.log('Delete book', this.book)
      this.$emit('deleteBook', {
        ...this.book
      })
      // await this.productStore.delete(this.book)
    },
    async saveEdit(){
      const form = document.forms['editForm']
      console.log(form.title.value)

      // title: formData.get('title'),
      //     author: formData.get('author'),
      //     description: formData.get('description'),
      //     copies: formData.get('copies')
      // const editedBook = new FormData(form)
      await this.productStore.edit({
        title: form.title.value,
        author: form.author.value,
        description: form.description.value,
        copies: form.copies.value,
      })
      this.editable = false
    }
  },
  computed: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.book-content{
  border: grey solid 1px;
  /* display: flex; */
}
.book-box{
  /* border: red solid 1px; */
  display: flex;
  align-items: center;
  justify-content: baseline;
  /* gap: 2; */
}
.book-image img{
  width: 200px;
}
.book-info{
  align-self: flex-start;
  margin-left: 10px;
}
.book-op-btn{
  /* text-align: left; */
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
}
.book-op-btn button{
  /* flex-grow: 1; */
  /* border: green solid 2px; */
  font-size: 1.2rem;
  width: 45%;
  /* height: 30px; */
}
button{
  cursor: pointer;
}
.btn-none{
  border: none;
  background-color: transparent;
}
.btn-delete{
  color: white;
  background-color: red;
  border: red solid 1px;
}
.btn-edit{
  color: white;
  background-color: blue;
  border: blue solid 1px;
}
.btn-delete:hover{
  color: red;
  background-color: white;
}
.btn-edit:hover{
  color: blue;
  background-color: white;
}
</style>