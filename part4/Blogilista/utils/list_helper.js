const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    return blogs.length === 0 
        ? 0
        : blogs.reduce((sum, blog) => {return sum + blog.likes}, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.length === 0 
        ? 0
        : blogs.reduce((max, current) => {return max && max.likes > current.likes ? max : current})
}
  
  module.exports = {
    dummy, 
    totalLikes, 
    favoriteBlog
  }