import { cva } from 'class-variance-authority'

const mobileMenuVariants = cva([
  'grid max-h-0 overflow-hidden bg-black opacity-0 transition-all',
], {
  variants: {
    state: {
      // Hardcoded max height to accommodate the menu items, adjust as necessary
      open: 'max-h-[337px] opacity-100',
      closed: 'max-h-0 opacity-0',
    },
  },
  defaultVariants: {
    state: 'closed',
  },
},
)

document.addEventListener('DOMContentLoaded', (): void => {
  const mobileMenuButton: HTMLElement | null = document.getElementById('mobile-menu-button')
  const mobileMenu: HTMLElement | null = document.getElementById('mobile-menu')

  if (mobileMenu) {
    mobileMenu.className = mobileMenuVariants({
      state: 'closed',
    })
  }

  if (mobileMenuButton && mobileMenu) {
    let isOpen: boolean = false

    mobileMenuButton.addEventListener('click', (): void => {
      isOpen = !isOpen

      mobileMenu.className = mobileMenuVariants({
        state: isOpen ? 'open' : 'closed',
      })
    })
  }
})
