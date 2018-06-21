const path = require('path');
const mime = require('mime-types');

const helper = require('../../lib/helper.js');

let filepath = './build';
let staticFiles = helper.readFiles(filepath);

/**
 * This endpoint handles all routes to `/static` over HTTP, and maps them to the
 *  `./static` service folder
 * @returns {object.http}
 */
module.exports = async context => {
  // Hot reload for local development
  if (context.service && context.service.environment === 'local') {
    staticFiles = helper.readFiles(filepath);
  }

  let staticFilepath = context.path.slice(1).join('/');
  let file = staticFiles[staticFilepath];
  if (!file) {
    return {
      statusCode: 404,
      body: '404 - Not Found',
      headers: {
        'Content-Type': 'text/plain'
      }
    };
  }

  let cacheControl = context.service.environment === 'release'
    ? 'max-age=31536000'
    : 'max-age=0';

  return {
    statusCode: 200,
    body: Buffer.from(file),
    headers: {
      'Content-Type': mime.lookup(staticFilepath),
      'Cache-Control': cacheControl
    }
  };
};