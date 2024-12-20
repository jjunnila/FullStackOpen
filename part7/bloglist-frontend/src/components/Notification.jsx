import PropTypes from 'prop-types'

const Notification = ({ message }) => {
    if (message === null || message === '') {
        return ''
    }
    return <div className="notification">{message}</div>
}

Notification.propTypes = {
    message: PropTypes.string.isRequired,
}

export default Notification
