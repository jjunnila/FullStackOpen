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

const mostLikes = (blogs) => {
    let authors = _.groupBy(blogs, 'author')
    authors = _.map(authors, (author) => ({author: author[0].author, likes: _.sumBy(author, 'likes')}))
    var maxAuthor = _.maxBy(authors, 'likes')
    return blogs.length === 0 
        ? 0
        : maxAuthor
}
  
  module.exports = {
    dummy, 
    totalLikes, 
    favoriteBlog,
    mostBlogs,
    mostLikes
  }