export default (type, msg) => {
  hideAlert()
  const markup = `<div class='alert alert--${type}'>${msg}</div>`
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup)
  setTimeout(() => hideAlert(), 3000)
}

const hideAlert = () => {
  const el = document.querySelector('.alert')
  if (el) el.remove()
}
