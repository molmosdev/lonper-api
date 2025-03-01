export function getWelcomePage() {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Welcome</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Inter', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100dvh;
            margin: 0;
            background-color: #f4f4f9;
            text-align: center;
          }
          h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
          }
          p {
            font-size: 1.25rem;
          }
          a {
            color: #89bf04;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Lonper API</h1>
          <p>Visit <a href="/docs">/docs</a> for API documentation.</p>
        </div>
      </body>
    </html>
  `;
}
