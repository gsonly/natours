import axios from 'axios'
import alert from './alert'

const login = async data => {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://localhost:3000/api/v1/users/login',
      data,
    })
    if (res.status === 200) {
      alert('success', 'successfully logged in')
      setTimeout(() => location.assign('/'), 2500)
    }
  } catch (err) {
    alert('error', 'error')
  }
}

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:3000/api/v1/users/logout',
    })
    if (res.status === 200) location.reload(true)
  } catch (err) {
    alert('error', 'error logging out, try again!')
  }
}

export { login, logout }
