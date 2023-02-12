import { defineStore } from 'pinia'
import axios from 'axios'

export const useProductStore = defineStore('ProductStore', {
    state: () =>{
        return {
            books: [],
            newBook: {},
            isSearch: false,
            searchedBook: []
        }
    },
    actions: {
        async fill(){
            try{
                const res = await axios.get('http://localhost:9000/books/')
                this.books = res.data.books
                
            }catch(error) {
                console.error(error.message)
                return error
            }
        },
        async setBook(book){
            console.log(book.copies)
            await axios.post('http://localhost:9000/books/', book).then( response => {
                console.log(response.data)
                this.newBook = response.data
                console.log(this.newBook)
                return 'success saved'
            }).catch( error => {
                console.log(error.message)
                return 'Error while creating !!'
            })

            return this.newBook
        },
        async search(title){
            console.log(title)
            // Have to improve it on server side
            if(title == 'C++') title = 'C+'
            this.isSearch = true
            if(title === '' && this.books.length !== 0) {
                this.searchedBook = this.books
                return
            }
            try{
                const res = await axios.get(`http://localhost:9000/books`, {
                    params: {
                        title: title
                    }
                })
                console.log(res)
                console.log(res.data.books)
                this.searchedBook = res.data.books
                // this.searchedBook = res.data.books.length === 0 ? `${title} not found!` : res.data.books
            }catch (error) {
                this.searchedBook = error
                console.log('error : ', error.message)
            }
        },
        async delete(book){
            try{
                await axios.delete('http://localhost:9000/books/', {
                    headers: {
                        Authorization: 'YUP'
                    },
                    data: {
                        // source: book,
                        book: book
                    }
                })
                console.log('Successfully deleted.')
                await this.fill()
            }catch (error) {
                console.error(error.message)
            }
        },
        async edit(book) {
            try{
                const res = await axios.put('http://localhost:9000/books/', {
                    book: book
                })

                console.log(res.data.copies)
                await this.fill()
            }catch (error) {
                console.error(error)
            }
        }
    }
})