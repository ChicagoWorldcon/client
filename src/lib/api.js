import 'whatwg-fetch';

export default class API {
  constructor(root) {
    this.root = root;  // [scheme]://[host]:[port]/[path]/
  }

  static parse(response) {
    return response.json()
      .then( json => response.ok ? json : Promise.reject(json) );
  }

  static queryFromObj(obj) {
    return !obj ? '' : '?' + Object.keys(obj)
      .map(k => k + '=' + encodeURIComponent(obj[k]))
      .join('&');
  }

  path(cmd, params) {
    return this.root + cmd + API.queryFromObj(params);
  }

  DELETE(cmd) {
    const uri = this.path(cmd);
    return fetch(uri, { credentials: 'include', method: 'DELETE' })
      .then(response => API.parse(response));
  }

  GET(cmd, params) {
    const uri = this.path(cmd, params);
    return fetch(uri, { credentials: 'include' })
      .then(response => API.parse(response));
  }

  POST(cmd, body) {
    const uri = this.path(cmd);
    const opt = { credentials: 'include', method: 'POST' };
    if (typeof body == 'string') {
      opt.body = body;
    } else {
      opt.headers = { 'Content-Type': 'application/json' };
      opt.body = JSON.stringify(body);
    }
    return fetch(uri, opt)
      .then(response => API.parse(response));
  }

  PUT(cmd, body) {
    const uri = this.path(cmd);
    const opt = {
      body: JSON.stringify(body),
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'PUT'
    };
    return fetch(uri, opt)
      .then(response => API.parse(response));
  }
}
