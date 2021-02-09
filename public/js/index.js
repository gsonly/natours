import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { login, logout } from './auth'
import map from './map'
import alert from './alert'
import updateSettings from './updateSettings'

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

const userDataForm = document.querySelector('.form-user-data')
if (userDataForm) {
  userDataForm.addEventListener('submit', e => {
    e.preventDefault()
    const form = new FormData()
    form.append('name', document.querySelector('#name').value)
    form.append('email', document.querySelector('#email').value)
    form.append('avatar', document.querySelector('#avatar').files[0])
    updateSettings(form, 'data')
  })
}

const userPasswordForm = document.querySelector('.form-user-settings')
if (userPasswordForm) {
  const btn = userPasswordForm.querySelector('.btn')
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault()
    btn.textContent = 'updating...'.toUpperCase()
    const oldPassword = document.querySelector('#password-current').value
    const newPassword = document.querySelector('#password').value
    const newPasswordConfirm = document.querySelector('#password-confirm').value
    await updateSettings(
      { oldPassword, newPassword, newPasswordConfirm },
      'password'
    )
    btn.textContent = 'save password'.toUpperCase()
    userPasswordForm.reset()
  })
}

const logoutBtn = document.querySelector('.nav__el--logout')
if (logoutBtn) {
  logoutBtn.addEventListener('click', logout)
}
