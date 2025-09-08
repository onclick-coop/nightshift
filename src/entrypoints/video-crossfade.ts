document.addEventListener('DOMContentLoaded', async () => {
  const video1 = document.getElementById('hero-video-1') as HTMLVideoElement
  const video2 = document.getElementById('hero-video-2') as HTMLVideoElement

  if (!video1 || !video2) return

  // Get video URL from data attribute or source element
  const videoUrl = video1.dataset.videoUrl || video1.querySelector('source')?.src
  if (!videoUrl) {
    console.error('No video URL found')
    return
  }

  console.log('Loading video blob:', videoUrl)

  try {
    // Fetch video once as blob
    const response = await fetch(videoUrl)
    if (!response.ok) throw new Error(`Failed to fetch video: ${response.status}`)

    const videoBlob = await response.blob()
    const blobUrl = URL.createObjectURL(videoBlob)

    console.log('Video blob loaded, setting sources')

    // Set both videos to use the same blob URL
    video1.src = blobUrl
    video2.src = blobUrl

    // Wait for both videos to load
    await Promise.all([
      new Promise(resolve => video1.addEventListener('loadeddata', resolve, { once: true })),
      new Promise(resolve => video2.addEventListener('loadeddata', resolve, { once: true })),
    ])

    console.log('Both videos loaded, starting crossfade logic')

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

    // Cleanup blob URL when page unloads
    window.addEventListener('beforeunload', () => {
      URL.revokeObjectURL(blobUrl)
    })
  }
  catch (error) {
    console.error('Failed to load video blob:', error)
    // Fallback: set video sources directly (original behavior)
    if (videoUrl) {
      video1.src = videoUrl
      video2.src = videoUrl
      video1.play()
    }
  }
})
