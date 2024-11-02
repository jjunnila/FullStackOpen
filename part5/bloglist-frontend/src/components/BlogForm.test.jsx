import React, { useLayoutEffect } from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('BlogForm.jsx tests', () => {

  let container
  const mockHandler = vi.fn()
  const author = 'Maupertuis'
  const title = 'Essai de cosmologie'
  const url = 'urlhere'

  container = render(<BlogForm createBlog={mockHandler}/>).container

  test('form calls the handler with the correct data', async () => {

    //screen.debug()

    const user = userEvent.setup()

    const titleInput = container.querySelector('#title-input')
    const authorInput = container.querySelector('#author-input')
    const urlInput = container.querySelector('#url-input')

    await user.type(titleInput, title)
    await user.type(authorInput, author)
    await user.type(urlInput, url)

    const button = screen.getByText('create')
    await user.click(button)

    /* console.log(mockHandler.mock.lastCall)
    console.log(JSON.stringify(mockHandler.mock.lastCall))
    console.log(JSON.stringify({ title: title, author: author, url: url })) */

    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(JSON.stringify(mockHandler.mock.lastCall) === JSON.stringify({ title: title, author: author, url: url }))
  })

}
)