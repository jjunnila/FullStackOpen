import { useState } from 'react'

const Remove = ({ user, blog, remove }) => {
    if (user && user.username === blog.user.username)
        return (
            <div>
                <button onClick={remove}>remove</button>
            </div>
        )
    return null
}

const Blog = ({ blog, likeBlog, deleteBlog, user }) => {
    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    const like = (event) => {
        event.preventDefault()
        likeBlog(blog.id, {
            id: blog.id,
            user: blog.user.id,
            likes: blog.likes + 1,
            author: blog.author,
            title: blog.title,
            url: blog.url,
        })
    }

    const remove = (event) => {
        event.preventDefault()
        if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`))
            deleteBlog(blog.id, blog.title, blog.author)
    }

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5,
    }

    return (
        <div style={blogStyle}>
            <div style={hideWhenVisible} className="initiallyVisible">
                {blog.title} {blog.author}
                <button onClick={toggleVisibility}>view</button>
            </div>
            <div style={showWhenVisible} className="initiallyHidden">
                {blog.title} {blog.author}
                <button onClick={toggleVisibility}>hide</button>
                <br />
                {blog.url}
                <br />
                likes {blog.likes}
                <button onClick={like}>like</button>
                <br />
                {blog.user.name}
                <Remove user={user} blog={blog} remove={remove}></Remove>
            </div>
        </div>
    )
}

export default Blog
