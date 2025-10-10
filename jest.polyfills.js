const { TextEncoder, TextDecoder } = require('util');

// Polyfill for TextEncoder/TextDecoder (needed for Next.js API routes and JWT)
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock ReadableStream for fetch API
global.ReadableStream = class ReadableStream {
  constructor() {}
};

// Mock Request if needed
if (typeof Request === 'undefined') {
  global.Request = class Request {
    constructor(url, init) {
      this.url = url;
      this.init = init;
    }
  };
}

// Mock Response if needed  
if (typeof Response === 'undefined') {
  global.Response = class Response {
    constructor(body, init) {
      this.body = body;
      this.init = init;
    }
  };
}

// Mock Headers if needed
if (typeof Headers === 'undefined') {
  global.Headers = class Headers {
    constructor() {
      this.map = new Map();
    }
    append(key, value) {
      this.map.set(key, value);
    }
    delete(key) {
      this.map.delete(key);
    }
    get(key) {
      return this.map.get(key) || null;
    }
    has(key) {
      return this.map.has(key);
    }
    set(key, value) {
      this.map.set(key, value);
    }
  };
}
