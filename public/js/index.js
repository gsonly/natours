// import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { login, logout } from './auth'
import map from './map'
import alert from './alert'

const mapDiv = document.querySelector('#map')
if (mapDiv) {
  const locations = JSON.parse(mapDiv.dataset.locations)
  map(locations)
}

const form = document.querySelector('.form--login')
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault()
    const email = document.querySelector('#email').value
    const password = document.querySelector('#password').value
    if (email === '' || password === '')
      return alert('error', 'please provide your email and password')
    login({ email, password })
  })
}

const logoutBtn = document.querySelector('.nav__el--logout')
if (logoutBtn) {
  logoutBtn.addEventListener('click', logout)
}
