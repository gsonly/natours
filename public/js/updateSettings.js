import axios from 'axios'
import alert from './alert'

export default async (data, type) => {
  try {
    const url = type  === 'password' ? 'http://localhost:3000/api/v1/users/updatePassword' : 'http://localhost:3000/api/v1/users/updateMe'
    console.log(url);
    console.log(data);
    const res = await axios({
      method: 'PATCH',
      url,
      data
    })
     if (res.status === 200) {
      alert('success', `${type.toUpperCase()} updated successfully`)
    }
  } catch (err) {
    alert('error', err.response.data.message)
  }
}