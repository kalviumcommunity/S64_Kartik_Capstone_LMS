import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import YouTube from 'react-youtube';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { useContext } from 'react';
import Loading from '../../components/student/Loading';
import Footer from '../../components/student/Footer';
import Rating from '../../components/student/Rating';
import axios from 'axios';

const VideoPlayer = () => {
  const { courseId } = useParams();
  const { allCourses } = useContext(AppContext);
  const [playerData, setPlayerData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [currentLecture, setCurrentLecture] = useState({ chapterIndex: 0, lectureIndex: 0 });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(`/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const course = response.data;
        console.log('Fetched Course:', course);

        if (course) {
          setCourseData(course);
          // Initialize all sections as expanded
          if (course.courseContent) {
            const initialExpandState = {};
            course.courseContent.forEach(chapter => {
              initialExpandState[chapter._id] = true;
            });
            setExpandedSections(initialExpandState);
          }
          // Get the first lecture from the first chapter
          if (course.courseContent && course.courseContent.length > 0) {
            const firstChapter = course.courseContent[0];
            console.log('First Chapter:', firstChapter);
            
            if (firstChapter.lectures && firstChapter.lectures.length > 0) {
              const firstLecture = firstChapter.lectures[0];
              console.log('First Lecture:', firstLecture);
              
              const videoUrl = firstLecture.videoUrl || firstLecture.lectureUrl;
              if (videoUrl) {
                const videoId = extractYouTubeId(videoUrl);
                console.log('Extracted Video ID:', videoId);
                
                if (videoId) {
                  setPlayerData({
                    videoId,
                    chapter: 1,
                    lecture: 1,
                    lectureTitle: firstLecture.title || firstLecture.lectureTitle,
                    lectureUrl: videoUrl
                  });
                  setCurrentLecture({ chapterIndex: 0, lectureIndex: 0 });
                } else {
                  setError('Invalid YouTube video URL');
                }
              } else {
                setError('No video URL found for this lecture');
              }
            } else {
              setError('No lectures found in this chapter');
            }
          } else {
            setError('No chapters found in this course');
          }
        } else {
          setError('Course not found');
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
        setError(error.response?.data?.message || 'Error loading course data');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [allCourses, courseId]);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const extractYouTubeId = (url) => {
    if (!url) {
      console.error('No URL provided to extractYouTubeId');
      return null;
    }
    
    try {
      console.log('Attempting to extract YouTube ID from URL:', url);
      
      // Handle different YouTube URL formats
      const patterns = [
        // Standard watch URLs
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/watch\?.*&v=)([^#&?]*).*/,
        // Direct video ID
        /^([a-zA-Z0-9_-]{11})$/,
        // YouTube Shorts
        /youtube\.com\/shorts\/([^#&?]*)/,
        // Standard watch URL with additional parameters
        /youtube\.com\/watch\?.*v=([^#&?]*)/,
        // YouTube embed URLs
        /youtube\.com\/embed\/([^#&?]*)/,
        // YouTube-nocookie.com URLs
        /youtube-nocookie\.com\/embed\/([^#&?]*)/,
        // YouTube URLs with additional parameters
        /youtube\.com\/watch\?.*&v=([^#&?]*)/,
        // YouTube URLs with feature parameter
        /youtube\.com\/watch\?.*feature=.*&v=([^#&?]*)/,
        // YouTube URLs with time parameter
        /youtube\.com\/watch\?.*t=.*&v=([^#&?]*)/
      ];

      // Try each pattern
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
          const videoId = match[1];
          console.log('Successfully extracted YouTube ID:', videoId);
          return videoId;
        }
      }

      // If the URL is just the video ID
      if (url.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(url)) {
        console.log('URL is already a valid YouTube ID:', url);
        return url;
      }

      // If no pattern matches, try to extract ID from the last part of the URL
      const urlParts = url.split('/');
      const lastPart = urlParts[urlParts.length - 1];
      if (lastPart && lastPart.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(lastPart)) {
        console.log('Extracted YouTube ID from URL path:', lastPart);
        return lastPart;
      }

      console.error('Could not extract YouTube ID from URL:', url);
      return null;
    } catch (error) {
      console.error('Error extracting YouTube ID:', error);
      return null;
    }
  };

  const onPlayerError = (event) => {
    console.error('YouTube Player Error:', event.data);
    // Add user-friendly error message
    setError('Failed to load video. Please check if the video URL is valid.');
  };

  const onPlayerReady = (event) => {
    console.log('Player Ready');
    setError(null);
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  };

  const handleWatch = (chapterIdx, lectureIdx) => {
    try {
      if (!courseData?.courseContent?.[chapterIdx]?.lectures?.[lectureIdx]) {
        setError('Invalid chapter or lecture selection');
        return;
      }

      const chapter = courseData.courseContent[chapterIdx];
      const lecture = chapter.lectures[lectureIdx];
      
      console.log('Selected lecture:', lecture);
      
      const videoUrl = lecture.videoUrl || lecture.lectureUrl;
      if (!videoUrl) {
        setError('No video URL found for this lecture');
        return;
      }

      const videoId = extractYouTubeId(videoUrl);
      console.log('Extracted video ID:', videoId);
      
      if (!videoId) {
        setError('Invalid YouTube video URL. Please check the video link format.');
        return;
      }

      setPlayerData({
        videoId,
        chapter: chapterIdx + 1,
        lecture: lectureIdx + 1,
        lectureTitle: lecture.title || lecture.lectureTitle,
        lectureUrl: videoUrl
      });
      setCurrentLecture({ chapterIndex: chapterIdx, lectureIndex: lectureIdx });
      setError(null);
    } catch (error) {
      console.error('Error handling watch action:', error);
      setError('Error loading video');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!courseData) {
    return <div className="text-red-500 font-bold py-4">Course not found.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Video Player Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {playerData ? (
                <div className="relative">
                  <YouTube 
                    videoId={playerData.videoId} 
                    opts={{
                      width: '100%',
                      height: '100%',
                      playerVars: { 
                        autoplay: 1,
                        modestbranding: 1,
                        rel: 0,
                        controls: 1,
                        showinfo: 0,
                        fs: 1,
                        playsinline: 1,
                        enablejsapi: 1,
                        origin: window.location.origin,
                        host: 'https://www.youtube.com'
                      }
                    }} 
                    onError={(event) => {
                      console.error('YouTube Player Error:', event);
                      setError('Failed to load video. Please check if the video URL is valid.');
                    }}
                    onReady={(event) => {
                      console.log('YouTube Player Ready');
                      setError(null);
                    }}
                    iframeClassName="w-full aspect-video"
                    className="w-full aspect-video"
                  />
                  {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                      <div className="text-white text-center p-4">
                        <p className="text-lg font-semibold mb-2">Error Loading Video</p>
                        <p className="text-sm">{error}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center bg-gray-800 w-full aspect-video">
                  <img 
                    className="w-3.5" 
                    src={assets.time_left_clock_icon}
                    alt="time left clock icon" 
                  />
                </div>
              )}
              {/* Lecture Info and Mark Complete Button */}
              {playerData && (
                <>
                  <div className="flex justify-between items-center mt-2 px-4 pb-2">
                    <p className="text-sm text-gray-700 font-medium">
                      {playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}
                    </p>
                    <button className="text-blue-600 text-sm font-semibold">{false ? 'Completed' : 'Mark Complete'}</button>
                  </div>
                  <div className="px-4 pb-4">
                    <Rating />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Course Content Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h2 className="text-xl font-bold mb-4">Course Structure</h2>
              {courseData?.courseContent ? (
                <div className="space-y-2">
                  {courseData.courseContent.map((chapter, chapterIdx) => {
                    const totalMinutes = chapter.lectures?.reduce((sum, lec) => sum + (lec.duration || 0), 0) || 0;
                    const isCurrentChapter = currentLecture.chapterIndex === chapterIdx;
                    
                    return (
                      <div 
                        key={chapter._id} 
                        className={`border rounded-md mb-2 ${isCurrentChapter ? 'border-blue-500' : 'border-gray-200'}`}
                      >
                        <button
                          onClick={() => toggleSection(chapter._id)}
                          className="w-full p-3 text-left font-medium flex justify-between items-center hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">{chapterIdx + 1}.</span>
                            <span className="font-medium">{chapter.title}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500">
                              {chapter.lectures?.length || 0} lectures • {formatDuration(totalMinutes)}
                            </span>
                            <span className="text-gray-400">
                              {expandedSections[chapter._id] ? '▼' : '▶️'}
                            </span>
                          </div>
                        </button>
                        {expandedSections[chapter._id] && (
                          <div className="pl-4 pb-2">
                            {chapter.lectures?.map((lecture, lectureIdx) => {
                              const isCurrentLecture = 
                                currentLecture.chapterIndex === chapterIdx && 
                                currentLecture.lectureIndex === lectureIdx;
                              
                              return (
                                <div 
                                  key={lecture._id} 
                                  className={`py-2 px-2 rounded-md ${
                                    isCurrentLecture ? 'bg-blue-50' : 'hover:bg-gray-50'
                                  }`}
                                >
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                      <span className="text-gray-400">▶️</span>
                                      <span className="text-sm">
                                        {chapterIdx + 1}.{lectureIdx + 1} {lecture.title}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        className={`text-sm px-2 py-1 rounded ${
                                          isCurrentLecture 
                                            ? 'bg-blue-500 text-white' 
                                            : 'text-blue-600 hover:bg-blue-50'
                                        }`}
                                        onClick={() => handleWatch(chapterIdx, lectureIdx)}
                                      >
                                        {isCurrentLecture ? 'Playing' : 'Watch'}
                                      </button>
                                      <span className="text-xs text-gray-500">
                                        {formatDuration(lecture.duration)}
                                      </span>
                                    </div>
                                  </div>
                                  {lecture.isPreviewFree && (
                                    <span className="text-xs text-green-600 ml-6">Preview Available</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-4">No course content available</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VideoPlayer;