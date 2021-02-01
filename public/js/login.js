const email = document.querySelector('#email')
const password = document.querySelector('#password')

document.querySelector('.form').addEventListener('submit', e => {
  e.preventDefault()
  login({ email: email.value, password: password.value })
})

const login = async data => {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://localhost:3000/api/v1/users/login',
      data,
    })
    if (res.status === 200) {
      alert('login successfully')
      setTimeout(() => {
        location.assign('/')
      }, 1500)
    }
  } catch (err) {
    console.log(err.response.data.message)
  }
}
