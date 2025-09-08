document.addEventListener('DOMContentLoaded', () => {
  const video1 = document.getElementById('hero-video-1') as HTMLVideoElement
  const video2 = document.getElementById('hero-video-2') as HTMLVideoElement

  if (!video1 || !video2) return

  let activeVideo = video1
  let inactiveVideo = video2
  let isTransitioning = false

  // Start first video visible
  video1.style.opacity = '1'
  video2.style.opacity = '0'

  video1.play()
  video2.play()

  function crossfade () {
    if (isTransitioning) return
    isTransitioning = true

    console.log('Starting crossfade')

    // Reset the inactive video to start from beginning
    inactiveVideo.currentTime = 0
    inactiveVideo.play()

    // Crossfade: fade out current, fade in next
    activeVideo.style.opacity = '0'
    inactiveVideo.style.opacity = '1'

    // Swap references after transition
    setTimeout(() => {
      [activeVideo, inactiveVideo] = [inactiveVideo, activeVideo]
      isTransitioning = false
      console.log('Crossfade complete')
    }, 1000)
  }

  // Check video timing every 500ms
  setInterval(() => {
    if (isTransitioning) return

    const videoDuration = activeVideo.duration
    const currentTime = activeVideo.currentTime
    const timeLeft = videoDuration - currentTime

    // Start crossfade 1 second before video ends
    if (timeLeft <= 1 && timeLeft > 0.5) {
      crossfade()
    }
  }, 500)
})
