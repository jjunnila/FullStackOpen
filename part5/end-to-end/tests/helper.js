const login = async (page, username, password) => {
    await page.getByTestId('username').fill('dare')
    await page.getByTestId('password').fill('1234')
    await page.getByRole('button', { name: 'login' }).click()
}

const create = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'new blog' }).click()
    await page.getByTestId('title').fill(title)
    await page.getByTestId('author').fill(author)
    await page.getByTestId('url').fill(url)
    await page.getByRole('button', { name: 'create' }).click()
    await page.getByText(title).first().waitFor()
}

export { login, create }