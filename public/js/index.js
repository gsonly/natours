import 'core-js/stable'
import 'regenerator-runtime/runtime'
import login from './login'
import map from './map'

const mapDiv = document.querySelector('#map')
if (mapDiv) {
  const locations = JSON.parse(mapDiv.dataset.locations)
  map(locations)
}

const form = document.querySelector('.form')
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault()
    const email = document.querySelector('#email').value
    const password = document.querySelector('#password').value
    login({ email, password })
  })
}
