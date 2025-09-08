import morphdom from 'morphdom'

class ShopifySectionManager {
  constructor () {
    this.container = null
    this.loadedSections = new Set()
    this.init()
  }

  init () {
    // Create or find the dynamic sections container
    this.container = document.getElementById('dynamic-sections') || this.createContainer()
  }

  createContainer () {
    const container = document.createElement('div')
    container.id = 'dynamic-sections'
    container.className = 'dynamic-sections'
    
    // Insert after main content
    const main = document.querySelector('main') || document.querySelector('.max-w-7xl') || document.body
    if (main.nextSibling) {
      main.parentNode.insertBefore(container, main.nextSibling)
    } else {
      main.parentNode.appendChild(container)
    }
    
    return container
  }

  /**
   * Load a single section using Shopify's Section Rendering API
   * @param {string} sectionId - The section ID (e.g., 'product-grid', 'newsletter')
   * @param {string} context - URL context (default: current page)
   */
  loadSection = async (sectionId, context = window.location.pathname) => {
    try {
      this.showLoadingState(sectionId)
      
      const url = `${context}?section_id=${sectionId}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Failed to load section ${sectionId}: ${response.status}`)
      }
      
      const html = await response.text()
      await this.insertSectionWithAnimation(sectionId, html)
      this.loadedSections.add(sectionId)
      
      return html
    } catch (error) {
      console.error('Error loading section:', error)
      this.hideLoadingState(sectionId)
      return null
    }
  }

  /**
   * Load multiple sections at once using Shopify's Section Rendering API
   * @param {string[]} sectionIds - Array of section IDs
   * @param {string} context - URL context (default: current page)
   */
  loadSections = async (sectionIds, context = window.location.pathname) => {
    try {
      const sectionsParam = sectionIds.join(',')
      const url = `${context}?sections=${sectionsParam}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Failed to load sections: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Insert each section with staggered animation
      for (let i = 0; i < sectionIds.length; i++) {
        const sectionId = sectionIds[i]
        const html = data[sectionId]
        
        if (html) {
          // Stagger animations by 100ms each
          setTimeout(async () => {
            await this.insertSectionWithAnimation(sectionId, html)
            this.loadedSections.add(sectionId)
          }, i * 100)
        } else {
          console.warn(`Section ${sectionId} returned null`)
        }
      }
      
      return data
    } catch (error) {
      console.error('Error loading sections:', error)
      return null
    }
  }

  /**
   * Show loading spinner for a section
   */
  showLoadingState = (sectionId) => {
    const loadingDiv = document.createElement('div')
    loadingDiv.id = `loading-${sectionId}`
    loadingDiv.className = 'section-loading flex justify-center items-center py-16'
    loadingDiv.innerHTML = `
      <div class="loading-spinner animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      <span class="ml-3 text-gray-600">Loading ${sectionId}...</span>
    `
    this.container.appendChild(loadingDiv)
  }

  /**
   * Hide loading spinner for a section
   */
  hideLoadingState = (sectionId) => {
    const loadingDiv = document.getElementById(`loading-${sectionId}`)
    if (loadingDiv) {
      loadingDiv.remove()
    }
  }

  /**
   * Insert section HTML with fade-in animation (only for dynamic sections)
   * @param {string} sectionId - The section ID
   * @param {string} html - The section HTML
   */
  insertSectionWithAnimation = async (sectionId, html) => {
    this.hideLoadingState(sectionId)
    
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html
    
    const sectionElement = tempDiv.firstElementChild
    if (!sectionElement) {
      console.warn(`No valid HTML for section ${sectionId}`)
      return
    }

    // Add fade-in animation classes for dynamic sections only
    sectionElement.classList.add('opacity-0', 'translate-y-5', 'transition-all', 'duration-600', 'ease-out')
    
    // Check if section already exists
    const existingSection = document.getElementById(sectionElement.id)
    
    if (existingSection) {
      // Update existing section with morphdom
      morphdom(existingSection, sectionElement)
    } else {
      // Append new section
      this.container.appendChild(sectionElement)
    }

    // Trigger fade-in animation
    await this.triggerFadeIn(sectionElement)
  }

  /**
   * Trigger fade-in animation
   */
  triggerFadeIn = async (element) => {
    // Small delay to ensure DOM is ready
    await new Promise(resolve => setTimeout(resolve, 50))
    
    element.classList.remove('opacity-0', 'translate-y-5')
    element.classList.add('opacity-100', 'translate-y-0')
  }

  /**
   * Remove a section from the DOM
   * @param {string} sectionId - The section ID
   */
  removeSection = (sectionId) => {
    const sectionElement = document.getElementById(`shopify-section-${sectionId}`)
    if (sectionElement) {
      sectionElement.remove()
      this.loadedSections.delete(sectionId)
    }
  }

  /**
   * Reload a section (useful for updates)
   * @param {string} sectionId - The section ID
   * @param {string} context - URL context
   */
  reloadSection = async (sectionId, context = window.location.pathname) => {
    return await this.loadSection(sectionId, context)
  }

  /**
   * Check if a section is already loaded
   * @param {string} sectionId - The section ID
   */
  isSectionLoaded = (sectionId) => {
    return this.loadedSections.has(sectionId)
  }

  /**
   * Get all loaded section IDs
   */
  getLoadedSections = () => {
    return Array.from(this.loadedSections)
  }
}

// Initialize and expose globally
const sectionManager = new ShopifySectionManager()
window.sectionManager = sectionManager

export default sectionManager