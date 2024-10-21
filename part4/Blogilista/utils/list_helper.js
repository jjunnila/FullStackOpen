var _ = require('lodash');

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

const mostBlogs = (blogs) => {
    let blogCount = _.countBy(blogs, 'author')
    var maxKey = _.max(Object.keys(blogCount), o => blogCount[o])
    return blogs.length === 0 
        ? 0
        : {author: maxKey, blogs: blogCount[maxKey]}
}
  
  module.exports = {
    dummy, 
    totalLikes, 
    favoriteBlog,
    mostBlogs
  }