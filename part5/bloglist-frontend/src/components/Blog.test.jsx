import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog.jsx tests', () => {

  let container
  const mockHandler = vi.fn()

  beforeEach(() => {
    const blog = {
      likes: 1,
      author: 'Maupertuis',
      title: 'Essai de cosmologie',
      url: 'urlhere',
      user: { name: 'Konowagahaisama' }
    }

    container = render(<Blog blog={blog} likeBlog={mockHandler}/>).container
  })

  test('by default renders only the title and author', () => {

    //screen.debug()

    const div = container.querySelector('.initiallyVisible')
    expect(div).not.toHaveStyle('display: none')
    const div2 = container.querySelector('.initiallyHidden')
    expect(div2).toHaveStyle('display: none')

    const title = screen.getByText('Essai de cosmologie Maupertuis')
    const url = screen.queryByText('urlhere')
    const likes = screen.queryByText(1)
    const username = screen.queryByText('Konowagahaisama')

    expect(title).toBeDefined()
    expect(url).toBeNull()
    expect(likes).toBeNull()
    expect(username).toBeNull()
  })

  test('show url, likes and user after clicking view', async () => {

    //screen.debug()

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.initiallyVisible')
    expect(div).toHaveStyle('display: none')
    const div2 = container.querySelector('.initiallyHidden')
    expect(div2).not.toHaveStyle('display: none')

    const title = screen.getByText('Essai de cosmologie Maupertuis')
    const url = screen.queryByText('urlhere')
    const likes = screen.queryByText(1)
    const username = screen.queryByText('Konowagahaisama')

    expect(title).toBeDefined()
    expect(url).toBeDefined()
    expect(likes).toBeDefined()
    expect(username).toBeDefined()
  })

  test('pressing like twice calls the event handler twice', async () => {

    //screen.debug()

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
