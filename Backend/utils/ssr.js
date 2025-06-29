import React from 'react';
import ReactDOMServer from 'react-dom/server';
import path from 'path';
import fs from 'fs';

export function renderApp(url, context = {}) {
  const app = React.createElement(
    'div',
    { className: 'app' },
    React.createElement('h1', null, 'LMS Platform'),
    React.createElement('p', null, 'Server-Side Rendered')
  );

  const html = ReactDOMServer.renderToString(app);
  
  // Read the index.html template
  const indexPath = path.resolve(process.cwd(), '../client/dist/index.html');
  let template = '';
  
  try {
    template = fs.readFileSync(indexPath, 'utf8');
  } catch (error) {
    // Fallback template if index.html doesn't exist
    template = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>LMS Platform</title>
          <script type="module" crossorigin src="/src/main.jsx"></script>
          <link rel="stylesheet" crossorigin href="/src/index.css">
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>
    `;
  }

  // Replace the root div with server-rendered content
  const finalHtml = template.replace(
    '<div id="root"></div>',
    `<div id="root">${html}</div>`
  );

  return finalHtml;
}

export function renderComponent(Component, props = {}) {
  const element = React.createElement(Component, props);
  return ReactDOMServer.renderToString(element);
} 