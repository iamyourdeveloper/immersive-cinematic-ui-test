import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/useAppStore'

// Close icon
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Play icon
const PlayIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="23" stroke="currentColor" strokeWidth="2"/>
    <path d="M19 16L34 24L19 32V16Z" fill="currentColor"/>
  </svg>
)

// Pause icon
const PauseIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="23" stroke="currentColor" strokeWidth="2"/>
    <rect x="17" y="15" width="5" height="18" fill="currentColor"/>
    <rect x="26" y="15" width="5" height="18" fill="currentColor"/>
  </svg>
)

export default function VideoModal() {
  const videoModalData = useAppStore((state) => state.videoModalData)
  const closeVideoModal = useAppStore((state) => state.closeVideoModal)
  const videoRef = useRef(null)
  const progressRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [isProgressHovered, setIsProgressHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && videoModalData) {
        closeVideoModal()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [videoModalData, closeVideoModal])

  // Auto-play when modal opens
  useEffect(() => {
    if (videoModalData && videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true)
      }).catch(console.log)
    }
  }, [videoModalData])

  // Update progress
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateProgress = () => {
      const progressValue = (video.currentTime / video.duration) * 100
      setProgress(progressValue || 0)
      setCurrentTime(video.currentTime || 0)
      setDuration(video.duration || 0)
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration || 0)
    }

    video.addEventListener('timeupdate', updateProgress)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    return () => {
      video.removeEventListener('timeupdate', updateProgress)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [videoModalData])

  // Show/hide controls on mouse move
  useEffect(() => {
    let timeout
    const handleMouseMove = () => {
      setShowControls(true)
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        if (isPlaying) setShowControls(false)
      }, 2500)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(timeout)
    }
  }, [isPlaying])

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
    setIsPlaying(false)
    setProgress(0)
    closeVideoModal()
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const handleProgressClick = (e) => {
    const rect = progressRef.current.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = percent * videoRef.current.duration
    }
  }

  const handleProgressDragStart = (e) => {
    e.preventDefault()
    setIsDragging(true)
    handleProgressClick(e)
  }

  const handleProgressDrag = (e) => {
    if (isDragging && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect()
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      if (videoRef.current && videoRef.current.duration) {
        videoRef.current.currentTime = percent * videoRef.current.duration
      }
    }
  }

  const handleProgressDragEnd = () => {
    setIsDragging(false)
  }

  // Handle mouse drag for progress bar
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleProgressDrag)
      window.addEventListener('mouseup', handleProgressDragEnd)
      return () => {
        window.removeEventListener('mousemove', handleProgressDrag)
        window.removeEventListener('mouseup', handleProgressDragEnd)
      }
    }
  }, [isDragging])

  // Format time helper
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <AnimatePresence>
      {videoModalData && (
        <motion.div
          className="video-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="video-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {/* Modal Frame */}
            <div className="video-modal-frame">
              {/* Corner Accents */}
              <div className="modal-corner top-left" />
              <div className="modal-corner top-right" />
              <div className="modal-corner bottom-left" />
              <div className="modal-corner bottom-right" />

              {/* Header */}
              <motion.div 
                className="video-modal-header"
                initial={{ opacity: 0 }}
                animate={{ opacity: showControls ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="video-modal-title">
                  <h3>{videoModalData.name}</h3>
                  <span className="video-modal-subtitle">{videoModalData.title}</span>
                </div>
                <button className="video-close-btn" onClick={handleClose}>
                  <CloseIcon />
                </button>
              </motion.div>

              {/* Video Container */}
              <div className="video-container" onClick={togglePlayPause}>
                <video
                  ref={videoRef}
                  src={videoModalData.videoUrl}
                  playsInline
                  onEnded={() => setIsPlaying(false)}
                />
                
                {/* Play/Pause Overlay */}
                <motion.div 
                  className="video-play-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: !isPlaying ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="play-button-wrapper">
                    <PlayIcon />
                  </div>
                </motion.div>

              </div>

              {/* Controls */}
              <motion.div 
                className="video-modal-controls"
                initial={{ opacity: 0 }}
                animate={{ opacity: showControls ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Progress Bar */}
                <div 
                  ref={progressRef}
                  className={`video-progress ${isProgressHovered || isDragging ? 'hovered' : ''}`}
                  onClick={handleProgressClick}
                  onMouseDown={handleProgressDragStart}
                  onMouseEnter={() => setIsProgressHovered(true)}
                  onMouseLeave={() => setIsProgressHovered(false)}
                >
                  <div className="video-progress-track">
                    <motion.div 
                      className="video-progress-fill"
                      style={{ width: `${progress}%` }}
                      layout
                    />
                    {/* Scrubber Thumb */}
                    <motion.div 
                      className="video-progress-thumb"
                      style={{ left: `${progress}%` }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: isProgressHovered || isDragging ? 1 : 0,
                        opacity: isProgressHovered || isDragging ? 1 : 0
                      }}
                      transition={{ duration: 0.15 }}
                    />
                  </div>
                  {/* Hover Preview Indicator */}
                  <div className="video-progress-hover-zone" />
                </div>

                {/* Control Buttons */}
                <div className="video-controls-row">
                  <div className="video-controls-left">
                    <motion.button 
                      className="video-control-btn"
                      onClick={togglePlayPause}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </motion.button>
                    <div className="video-time-display">
                      <span className="current-time">{formatTime(currentTime)}</span>
                      <span className="time-separator">/</span>
                      <span className="total-time">{formatTime(duration)}</span>
                    </div>
                  </div>
                  <div className="video-creator-info">
                    <span className="wakanda-text">{videoModalData.wakandaText}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

