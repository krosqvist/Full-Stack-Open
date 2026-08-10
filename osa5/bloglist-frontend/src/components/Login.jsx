import PropTypes from 'prop-types'
import Notification from './Notification'
import { TextField, Button } from '@mui/material'

const LoginForm = ({
  handleLogin,
  setUsername,
  setPassword,
  username,
  password
}) => {

  return(
    <div>
      <h1>log in to application</h1>
      <form onSubmit={handleLogin}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <TextField
            label="username"
            type="text"
            value={username}
            name="username"
            onChange={setUsername}
            placeholder="username"
            sx={{ width: 300 }}
          />

          <TextField
            label="password"
            type="password"
            value={password}
            name="password"
            onChange={setPassword}
            placeholder="password"
            sx={{ width: 300 }}
          />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>login</Button>
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