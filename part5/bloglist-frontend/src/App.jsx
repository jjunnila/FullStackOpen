import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Error from './components/Error'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [title, setTitle] = useState('') 
  const [author, setAuthor] = useState('') 
  const [url, setUrl] = useState('') 
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification(`Logged in as ${user.username}`);
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    } catch (exception) {
      console.log(exception)
      setError("Wrong username or password");
      setTimeout(() => {
        setError(null)
      }, 3000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
    setNotification(`Logged out`);
      setTimeout(() => {
        setNotification(null)
      }, 3000)
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    try {
      const blog = await blogService.create({
        title, author, url,
      })
      setBlogs(await blogService.getAll())  
      setTitle('')
      setAuthor('')
      setUrl('')
      setNotification(`A new blog "${blog.title}" by ${blog.author} added`);
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    } catch (exception) {
      console.log(exception)
      setError("Blog field(s) invalid");
      setTimeout(() => {
        setError(null)
      }, 3000)
    }
  }

  if (user === null) {
    return (
      <div>
      <h2>Log in to the application</h2>
      <Error message={error}></Error>
      <Notification message={notification}></Notification>
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
      </div>   
    )
  }

  return (
    <div>

      <h2>Blogs</h2>
      <Error message={error}></Error>
      <Notification message={notification}></Notification>
      <p>{user.name} logged in
      <button onClick={handleLogout}>log out</button></p>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}

      <h2>Create a new blog</h2>
      <form onSubmit={handleCreate}>
        <div>
          title:
            <input
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
            <input
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
            <input
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default App