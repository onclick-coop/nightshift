import { cva } from 'class-variance-authority';

console.log('Product gallery with CVA loaded');

// Define thumbnail variants using CVA
const thumbnailVariants = cva([
  "thumbnail-btn",
  "aspect-[8/10]",
  "bg-black",
  "relative",
  "overflow-hidden",
  "transition-all",
  "duration-200"
], {
  variants: {
    state: {
      active: "border-2 border-red-500",
      inactive: "border-2 border-transparent"
    }
  },
  defaultVariants: {
    state: "inactive"
  }
});

// Define overlay variants
const overlayVariants = cva([
  "thumbnail-overlay",
  "absolute",
  "inset-0",
  "bg-red-600",
  "bg-opacity-30",
  "transition-opacity",
  "duration-200"
], {
  variants: {
    state: {
      active: "opacity-100",
      inactive: "opacity-0"
    }
  },
  defaultVariants: {
    state: "inactive"
  }
});

// Product gallery functionality
export const initProductGallery = () => {
  const setActiveThumb = (activeButton) => {
    console.log('setActiveThumb called with:', activeButton);
    const allButtons = document.querySelectorAll('.thumbnail-btn');
    console.log('Found buttons:', allButtons.length);
    
    allButtons.forEach(btn => {
      const overlay = btn.querySelector('.thumbnail-overlay');
      const isActive = btn === activeButton;
      
      console.log('Processing button:', btn, 'isActive:', isActive, 'has overlay:', !!overlay);
      
      // Use CVA to generate class strings
      const buttonClasses = thumbnailVariants({ 
        state: isActive ? 'active' : 'inactive' 
      });
      
      console.log('Generated classes:', buttonClasses);
      btn.className = buttonClasses;
      
      if (overlay) {
        const overlayClasses = overlayVariants({ 
          state: isActive ? 'active' : 'inactive' 
        });
        console.log('Overlay classes:', overlayClasses);
        overlay.className = overlayClasses;
      }
    });
  }

  const changeMainImage = (src) => {
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) {
      mainImage.src = src;
    }
  }

  const initializeThumbnails = () => {
    document.querySelectorAll('.thumbnail-btn').forEach((btn, index) => {
      const overlay = btn.querySelector('.thumbnail-overlay');
      const isFirst = index === 0;

      // Set initial classes using CVA
      btn.className = thumbnailVariants({
        state: isFirst ? 'active' : 'inactive'
      });

      if (overlay) {
        overlay.className = overlayVariants({
          state: isFirst ? 'active' : 'inactive'
        });
      }
    });
  }

  // Export functions to global scope for Liquid onclick handlers
  window.setActiveThumb = setActiveThumb;
  window.changeMainImage = changeMainImage;

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeThumbnails);
  } else {
    initializeThumbnails();
  }
}

// Auto-initialize if this script is loaded
initProductGallery();
