import { useState } from 'react'

const Blog = ({ blog, likeBlog }) => {

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
      likes: blog.likes+1,
      author: blog.author,
      title: blog.title, 
      url: blog.url,
    })
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} 
        {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
          {blog.title} {blog.author}
          <button onClick={toggleVisibility}>hide</button>
          <br />
          {blog.url}
          <br />
          likes {blog.likes}
          <button onClick={like}>like</button>
          <br />
          {blog.user.name}
      </div>
    </div>
  )
}

export default Blog