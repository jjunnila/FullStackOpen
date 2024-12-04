import PropTypes from 'prop-types'

const Error = ({ message }) => {
    if (message === null || message === '') {
        return ''
    }

    return <div className="error">{message}</div>
}

Error.propTypes = {
    message: PropTypes.string.isRequired,
}

export default Error
