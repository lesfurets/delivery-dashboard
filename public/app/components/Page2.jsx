import React from 'react'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'
import RawDataPanel from '../containers/RawDataPanel'

const Page2 = () => (
    <div>
        <AddTodo />
        <VisibleTodoList />
        <Footer />
        <RawDataPanel />
    </div>
)

export default Page2