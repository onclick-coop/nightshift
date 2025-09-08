// Product page specific JavaScript
console.log('Product page loaded')

// Product form handling
document.addEventListener('DOMContentLoaded', () => {
  const productForm = document.querySelector('form[action*="/cart/add"]')

  if (productForm) {
    productForm.addEventListener('submit', (e) => {
      e.preventDefault()

      const formData = new FormData(productForm)

      fetch('/cart/add.js', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then((data) => {
          console.log('Product added to cart:', data)
          // Update cart counter or show notification
        })
        .catch((error) => {
          console.error('Error adding to cart:', error)
        })
    })
  }
})
