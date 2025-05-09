// src/VideoScreen.jsx
import React from 'react';
import YouTube from 'react-youtube';

function parseYouTubeVideoId(url = '') {
  const patterns = [
    /youtu\.be\/([^?]+)/,
    /v=([^?&]+)/,
    /embed\/([^?&]+)/,
    /shorts\/([^?]+)/,
  ];
  for (const pat of patterns) {
    const m = url.match(pat);
    if (m && m[1]) return m[1];
  }
  return '';
}

function isDirectVideoUrl(url = '') {
  // Check if the URL points to a video file or storage service
  const patterns = [
    /\.(mp4|webm|ogg|mov)(\?|$)/i,
    /storage\.yandexcloud\.net.*\.(mp4|webm|ogg|mov)(\?|$)/i,
    /cdn\..*\.(mp4|webm|ogg|mov)(\?|$)/i
  ];
  
  return patterns.some(pattern => url.match(pattern));
}

function VideoScreen({ videoLink, onClose, onVideoEnd }) {
  if (!videoLink) return null;

  const videoId = parseYouTubeVideoId(videoLink);
  const isDirectVideo = isDirectVideoUrl(videoLink);
  
  const opts = {
    width: '100%',
    height: '200',
    playerVars: {
      autoplay: 1,
      controls: 1,
    },
  };

  // Called when the YouTube video ends
  function handleEnd() {
    if (onVideoEnd) {
      onVideoEnd();
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 9999,
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '90%',
          maxWidth: '400px',
          background: '#333',
          borderRadius: '10px',
          padding: '10px',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            background: 'none',
            color: '#fff',
            border: '1px solid #fff',
            borderRadius: '5px',
            marginBottom: '8px',
            cursor: 'pointer'
          }}
        >
          Закрыть
        </button>

        {/* Render either YouTube player or direct video player */}
        {isDirectVideo ? (
          <video 
            src={videoLink} 
            controls 
            autoPlay 
            style={{ width: '100%', borderRadius: '5px' }}
            onEnded={handleEnd}
          />
        ) : (
          /* The YouTube player */
          <YouTube
            videoId={videoId}
            opts={opts}
            onEnd={handleEnd}
          />
        )}
      </div>
    </div>
  );
}

export default VideoScreen;
