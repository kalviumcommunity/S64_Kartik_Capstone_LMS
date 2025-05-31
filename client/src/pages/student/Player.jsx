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
  }, [courseId]);
  }, [allCourses, courseId]);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const extractYouTubeId = (url) => {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    // If no match found, try to extract ID directly (in case it's just the ID)
    if (!match) {
      // Check if it's just an 11-character video ID
      if (url.length === 11) {
        return url;
      }
      return null;
    }
    
    return (match && match[2].length === 11) ? match[2] : null;
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
    const chapter = courseData.courseContent[chapterIdx];
    const lecture = chapter.chapterContent[lectureIdx];
    const videoId = extractYouTubeId(lecture.videoUrl);
    setPlayerData({
      videoId,
      chapter: chapterIdx + 1,
      lecture: lectureIdx + 1,
      lectureTitle: lecture.lectureTitle,
      lectureUrl: lecture.videoUrl
    });
    setCurrentLecture({ chapterIndex: chapterIdx, lectureIndex: lectureIdx });
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
                        autoplay: 0,
                        modestbranding: 1,
                        rel: 0,
                        controls: 1,
                        showinfo: 0,
                        fs: 1,
                        playsinline: 1,
                        enablejsapi: 1,
                        origin: window.location.origin,
                        widgetid: Math.floor(Math.random() * 1000)
                      }
                    }} 
                    onError={onPlayerError}
                    onReady={onPlayerReady}
                    iframeClassName="w-full aspect-video"
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
              <div className="space-y-2">
                {courseData.courseContent?.map((chapter, chapterIdx) => {
                  const totalMinutes = chapter.chapterContent.reduce((sum, lec) => sum + (lec.lectureDuration || 0), 0);
                  return (
                    <div key={chapter.chapterId} className="border rounded-md mb-2">
                      <button
                        onClick={() => toggleSection(chapter.chapterId)}
                        className="w-full p-3 text-left font-medium flex justify-between items-center"
                      >
                        <span>{chapter.chapterTitle}</span>
                        <span className="text-xs text-gray-500">{chapter.chapterContent.length} lectures - {totalMinutes} minutes</span>
                        <span>{expandedSections[chapter.chapterId] ? '▼' : '▶'}</span>
                      </button>
                      {expandedSections[chapter.chapterId] && (
                        <div className="pl-4 pb-2">
                          {chapter.chapterContent.map((lecture, lectureIdx) => (
                            <div key={lecture.lectureId} className="py-2 flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400">▶</span>
                                <span className="text-sm">{lecture.lectureTitle}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  className="text-blue-600 text-xs hover:underline"
                                  onClick={() => handleWatch(chapterIdx, lectureIdx)}
                                >
                                  Watch
                                </button>
                                <span className="text-xs text-gray-500">{formatDuration(lecture.lectureDuration)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VideoPlayer;