const https = require('https');
const fs = require('fs');
const path = require('path')
const express = require('express')

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const hostname = '0.0.0.0';
const port = 3100;
let bundleCounter = 0;

/**
 * Adds the options for SSL to run as HTTPS
 */
const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
};


/**
 * An incredibly basic auth mechanism that requires a
 * basic auth header with the following credentials:
 * - **username**: post
 * - **password**: password
 */
const validateAuth = (req) => {
  const auth = req.headers?.authorization;
  if (!auth) return false;

  const found = auth.match(/Basic (.+)/);
  if (found) {
    const details = Buffer.from(found[1], 'base64').toString('utf8');
    const creds = details.split(':');
    if (creds.length === 2) {
      return creds[0] === 'post' && creds[1] === 'password';
    }
  }

  return false;
};

/**
 * Setup serving of public files
 */
app.get('/*', (req, res) => {
  // serve index.html for the root URL
  if (req.url === '/') {
    req.url = '/index.html';
  } else if (req.url === '/favicon.ico') {
    // There is no favicon so short-circuit the response
    res.writeHead(404, 'Not Found');
    res.end();
    return;
  }

  const reqPath = __dirname + '/public' + req.url;
  const resolvedPath = path.resolve(reqPath)

  if (!resolvedPath.startsWith(__dirname + '/public')) {
    res.writeHead(401);
    res.end();
    return;
  }

  fs.readFile(resolvedPath, function (err,data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      console.log('File Fetch Error', err);
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

/**
 * Sets up a bundle endpoint for posting bundles from
 * the Acme SDK when they are created
 * 
 * Takes in the Acme Bundle object, adds a bundle id
 * based on a simple counter, and returns the updated
 * object
 */
app.post('/bundle', (req, res) => {
  if (!validateAuth(req)) {
    res.writeHead(401);
    res.end();
    return;
  }

  const bundle = req.body;
  bundle.acmeBundleId = ++bundleCounter;

  res.writeHead(201);
  res.end(JSON.stringify(bundle));
});

/** 
 * Create the server and start listening
 */
const server = https.createServer(options, app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});