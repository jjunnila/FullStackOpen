import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Error from './components/Error'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import { Alert, Form, Button } from 'react-bootstrap'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [user, setUser] = useState(null)
    const [notification, setNotification] = useState('')
    const [error, setError] = useState('')

    const blogFormRef = useRef()

    useEffect(() => {
        blogService.getAll().then((blogs) => setBlogs(blogs))
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
                username,
                password,
            })
            window.localStorage.setItem(
                'loggedBlogAppUser',
                JSON.stringify(user)
            )
            blogService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
            setNotification(`Logged in as ${user.username}`)
            setTimeout(() => {
                setNotification('')
            }, 3000)
        } catch (exception) {
            console.log(exception)
            setError('Wrong username or password')
            setTimeout(() => {
                setError('')
            }, 3000)
        }
    }

    const handleLogout = (event) => {
        event.preventDefault()
        window.localStorage.removeItem('loggedBlogAppUser')
        blogService.setToken(null)
        setUser(null)
        setNotification('Logged out')
        setTimeout(() => {
            setNotification('')
        }, 3000)
    }

    const handleCreate = async (blogObject) => {
        try {
            blogFormRef.current.toggleVisibility()
            const blog = await blogService.create(blogObject)
            setBlogs(await blogService.getAll())
            setNotification(
                `A new blog "${blog.title}" by ${blog.author} added`
            )
            setTimeout(() => {
                setNotification('')
            }, 3000)
        } catch (exception) {
            console.log(exception)
            setError('Blog field(s) invalid')
            setTimeout(() => {
                setError('')
            }, 3000)
        }
    }

    const handleLike = async (id, blogObject) => {
        try {
            const blog = await blogService.update(id, blogObject)
            setBlogs(await blogService.getAll())
            setNotification(`Liked "${blog.title}" by ${blog.author}`)
            setTimeout(() => {
                setNotification('')
            }, 3000)
        } catch (exception) {
            console.log(exception)
            setError('Error on like')
            setTimeout(() => {
                setError('')
            }, 3000)
        }
    }

    const handleDelete = async (id, title, author) => {
        try {
            await blogService.remove(id)
            setBlogs(await blogService.getAll())
            setNotification(`Removed "${title}" by ${author}`)
            setTimeout(() => {
                setNotification('')
            }, 3000)
        } catch (exception) {
            console.log(exception)
            setError('Delete unauthorized')
            setTimeout(() => {
                setError('')
            }, 3000)
        }
    }

    if (user === null) {
        return (
            <div className="container">
                <h2>Log in to the application</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {notification && (
                    <Alert variant="success">{notification}</Alert>
                )}
                <Form onSubmit={handleLogin}>
                    <Form.Group>
                        <Form.Label>username:</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            value={username}
                            onChange={({ target }) => setUsername(target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>password:</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={password}
                            onChange={({ target }) => setPassword(target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        login
                    </Button>
                </Form>
            </div>
        )
    }

    return (
        <div className="container">
            <h2>Blogs</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {notification && <Alert variant="success">{notification}</Alert>}
            <p>
                {user.name} logged in
                <button onClick={handleLogout}>log out</button>
            </p>

            <Togglable buttonLabel="new blog" ref={blogFormRef}>
                <BlogForm createBlog={handleCreate} />
            </Togglable>
            {blogs
                .sort((blog1, blog2) => blog2.likes - blog1.likes)
                .map((blog) => (
                    <Blog
                        key={blog.id}
                        blog={blog}
                        likeBlog={handleLike}
                        deleteBlog={handleDelete}
                        user={user}
                    />
                ))}
        </div>
    )
}

export default App
