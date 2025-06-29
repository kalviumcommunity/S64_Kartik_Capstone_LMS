import express from 'express';
import { renderComponent } from '../utils/ssr.js';
import { getSSRData, getCourseData, getPlatformStats } from '../services/ssrDataService.js';
import SSRHome from '../components/SSRHome.js';

const router = express.Router();

// Main SSR route - renders the home page with dynamic data
router.get('/ssr', async (req, res) => {
  try {
    console.log('🔄 Rendering SSR home page...');
    
    // Fetch dynamic data on the server
    const { courses, testimonials, stats } = await getSSRData();
    
    // Render the React component to HTML on the server
    const html = renderComponent(SSRHome, {
      courses,
      testimonials,
      stats
    });

    // Create a complete HTML document
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>LMS Platform - Server Side Rendered</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          </style>
        </head>
        <body>
          <div id="root">${html}</div>
          <script>
            // Hydration script - this will be executed on the client
            console.log('🚀 SSR Demo: This page was rendered on the server!');
            console.log('📊 Server-fetched data:', ${JSON.stringify({ courses, testimonials, stats })});
            
            // Add a small indicator that the page is interactive
            document.addEventListener('DOMContentLoaded', function() {
              const indicator = document.createElement('div');
              indicator.style.cssText = 'position: fixed; top: 10px; right: 10px; background: #10B981; color: white; padding: 8px 12px; border-radius: 4px; font-size: 12px; z-index: 1000;';
              indicator.textContent = '✅ SSR + Hydrated';
              document.body.appendChild(indicator);
              
              setTimeout(() => {
                indicator.style.display = 'none';
              }, 3000);
            });
          </script>
        </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(fullHtml);
    
    console.log('✅ SSR home page rendered successfully');
  } catch (error) {
    console.error('❌ SSR rendering error:', error);
    res.status(500).send('Server rendering error');
  }
});

// SSR route for individual course pages
router.get('/ssr/course/:id', async (req, res) => {
  try {
    const courseId = req.params.id;
    console.log(`🔄 Rendering SSR course page for ID: ${courseId}`);
    
    // Fetch course data on the server
    const course = await getCourseData(courseId);
    
    if (!course) {
      return res.status(404).send('Course not found');
    }

    // Create a simple course detail component
    const courseHtml = `
      <div class="min-h-screen bg-gray-50 py-12">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h1 class="text-4xl font-bold text-gray-900 mb-6">${course.title}</h1>
            <p class="text-lg text-gray-600 mb-8">${course.description}</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="bg-blue-50 p-6 rounded-lg">
                <h3 class="text-xl font-semibold text-blue-900 mb-2">Course Details</h3>
                <p class="text-blue-700"><strong>Duration:</strong> ${course.duration}</p>
                <p class="text-blue-700"><strong>Price:</strong> $${course.price}</p>
              </div>
              <div class="bg-green-50 p-6 rounded-lg">
                <h3 class="text-xl font-semibold text-green-900 mb-2">Server-Side Rendered</h3>
                <p class="text-green-700">This course page was rendered on the server with dynamic data fetched from our API.</p>
                <p class="text-sm text-green-600 mt-2">Course ID: ${course.id}</p>
              </div>
            </div>
            <div class="mt-8 text-center">
              <a href="/api/ssr" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Back to SSR Home
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${course.title} - SSR Demo</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
          <div id="root">${courseHtml}</div>
          <script>
            console.log('🚀 SSR Course Page: Rendered on server with course data:', ${JSON.stringify(course)});
          </script>
        </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(fullHtml);
    
    console.log(`✅ SSR course page rendered successfully for ID: ${courseId}`);
  } catch (error) {
    console.error('❌ SSR course rendering error:', error);
    res.status(500).send('Server rendering error');
  }
});

// SSR route for platform statistics
router.get('/ssr/stats', async (req, res) => {
  try {
    console.log('🔄 Rendering SSR stats page...');
    
    // Fetch platform statistics on the server
    const stats = await getPlatformStats();
    
    const statsHtml = `
      <div class="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 py-12">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto text-center text-white">
            <h1 class="text-5xl font-bold mb-8">Platform Statistics</h1>
            <p class="text-xl mb-12">Real-time data rendered on the server</p>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="bg-white/20 backdrop-blur-sm p-8 rounded-lg">
                <h3 class="text-4xl font-bold mb-2">${stats.totalCourses}</h3>
                <p class="text-lg">Total Courses</p>
              </div>
              <div class="bg-white/20 backdrop-blur-sm p-8 rounded-lg">
                <h3 class="text-4xl font-bold mb-2">${stats.totalStudents.toLocaleString()}</h3>
                <p class="text-lg">Active Students</p>
              </div>
              <div class="bg-white/20 backdrop-blur-sm p-8 rounded-lg">
                <h3 class="text-4xl font-bold mb-2">${stats.totalEducators}</h3>
                <p class="text-lg">Expert Educators</p>
              </div>
            </div>
            
            <div class="mt-12 bg-white/10 backdrop-blur-sm p-8 rounded-lg">
              <h3 class="text-2xl font-bold mb-4">Server-Side Rendering Demo</h3>
              <p class="text-lg mb-4">These statistics were fetched and rendered on the server at:</p>
              <p class="text-xl font-mono">${new Date().toLocaleString()}</p>
            </div>
            
            <div class="mt-8">
              <a href="/api/ssr" class="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Back to SSR Home
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Platform Stats - SSR Demo</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
          <div id="root">${statsHtml}</div>
          <script>
            console.log('🚀 SSR Stats Page: Rendered on server with stats:', ${JSON.stringify(stats)});
          </script>
        </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(fullHtml);
    
    console.log('✅ SSR stats page rendered successfully');
  } catch (error) {
    console.error('❌ SSR stats rendering error:', error);
    res.status(500).send('Server rendering error');
  }
});

// API endpoint to get SSR data (for client-side consumption)
router.get('/api/ssr-data', async (req, res) => {
  try {
    const data = await getSSRData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch SSR data' });
  }
});

export default router; 