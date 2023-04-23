import React from 'react';
import '../styles/VideoPlayer.css';

const VideoPlayer = ({ url }) => {

  const getYoutubeVideoId = (url) => {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
  }

  const youtubeId = getYoutubeVideoId(url)

  return (
    <div className="video-player">
      {url && (
        <iframe
          className="video-player"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded video"
        />
      )}
    </div>
  );
};

export default VideoPlayer;
