import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import Error from "./components/Error";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState("");
  const [error, setError] = useState("");

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      setNotification(`Logged in as ${user.username}`);
      setTimeout(() => {
        setNotification("");
      }, 3000);
    } catch (exception) {
      console.log(exception);
      setError("Wrong username or password");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem("loggedBlogAppUser");
    blogService.setToken(null);
    setUser(null);
    setNotification("Logged out");
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  const handleCreate = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      const blog = await blogService.create(blogObject);
      setBlogs(await blogService.getAll());
      setNotification(`A new blog "${blog.title}" by ${blog.author} added`);
      setTimeout(() => {
        setNotification("");
      }, 3000);
    } catch (exception) {
      console.log(exception);
      setError("Blog field(s) invalid");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const handleLike = async (id, blogObject) => {
    try {
      const blog = await blogService.update(id, blogObject);
      setBlogs(await blogService.getAll());
      setNotification(`Liked "${blog.title}" by ${blog.author}`);
      setTimeout(() => {
        setNotification("");
      }, 3000);
    } catch (exception) {
      console.log(exception);
      setError("Error on like");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const handleDelete = async (id, title, author) => {
    try {
      await blogService.remove(id);
      setBlogs(await blogService.getAll());
      setNotification(`Removed "${title}" by ${author}`);
      setTimeout(() => {
        setNotification("");
      }, 3000);
    } catch (exception) {
      console.log(exception);
      setError("Delete unauthorized");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

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
              data-testid="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              data-testid="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Error message={error}></Error>
      <Notification message={notification}></Notification>
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
  );
};

export default App;
