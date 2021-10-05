import React, { useState, useEffect, useRef } from 'react'
import { ReactComponent as VideoIcon } from '../images/tutorial.svg'
import useFlameLinkApp from '../hooks/useFlamelinkApp'
import Loading from './Loading'
import '../styles/Info.scss'

function InfoVideo({ src, onClose }) {
  const videoRef = useRef(null) 

  const onCanPlay = () => {
    videoRef.current.volume = 0.7
  }

  useEffect(() => {
    const setVideoPlayed = () => {
      localStorage.setItem('intro-video-player', true)
    }
    if (videoRef.current) {
      videoRef.current.addEventListener('playing', setVideoPlayed)
      return () => {
        videoRef.current?.removeEventListener('playing', setVideoPlayed)
      }
    }
  }, [src])

  return ( src ?
    (
      <div className="info-video-container" onClick={onClose}>
        <video
          ref={videoRef}
          autoPlay
          controls
          onCanPlay={onCanPlay}
          onClick={e => e.stopPropagation()}
          onEnded={onClose}
          >
          <source src={src} type="video/mp4" />
        </video>
      </div>
    ) : <Loading />
  )
}

// Info action button displayed fixed on bottom-right of screen.
// Clicking on it will open run a overlay video.
export default function InfoOverlay() {
  const [isOpen, setIsOpen] = useState(false)
  const [videoSrc, setVideoSrc] = useState(null)
  const { getFolderFiles, getFileUrl } = useFlameLinkApp()

  //Check if the video has been played before or if it's the first time,
  // by reading localStorage.
  const checkFirstRun = () => {
    const firstRun = localStorage.getItem('intro-video-player')
    if (!firstRun) {
      setIsOpen(true)
    }
  }

  const getVideo = async () => {
    const files = await getFolderFiles('Root')
    const videoFile = Object.values(files).find(file => file.file === 'intro.mp4')
    if (videoFile) {
      const url = await getFileUrl(videoFile.id)
      if (url) {
        setVideoSrc(url)
      }
    }
  }

  // Catpure when user press ESC key to close the overlay.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.keyCode === 27) {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    checkFirstRun()
  }, [])

  useEffect(() => {
    if (isOpen) {
      getVideo()
    }
  }, [isOpen])
  
  return (
    <>
      { isOpen && (
        <InfoVideo src={videoSrc} onClose={() => setIsOpen(false)} />
      )}
      <div onClick={() => setIsOpen(true)} className='info-action-button'>
        <VideoIcon />
        <button className='btn'>Video bienvenida</button>
      </div>
    </>
  )
}
