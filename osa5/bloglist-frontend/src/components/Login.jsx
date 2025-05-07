import PropTypes from 'prop-types'
import Notification from './Notification'

const LoginForm = ({
  handleLogin,
  setUsername,
  setPassword,
  message,
  username,
  password
}) => {
  return(
    <div>
      <h1>log in to application</h1>
      <Notification message={message} />
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={setUsername}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={setPassword}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  message: PropTypes.string,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm