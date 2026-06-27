const { expect } = require('chai');
const sinon = require('sinon');
const forceHttps = require('./index');

describe('forceHttps middleware', () => {
  let req, res, next, middleware;

  beforeEach(() => {
    req = {
      hostname: 'example.com',
      headers: {},
      url: '/path?query=1'
    };
    res = {
      redirect: sinon.stub()
    };
    next = sinon.stub();
  });

  it('should call next() if no x-forwarded-proto and hostname is correct', () => {
    middleware = forceHttps();
    middleware(req, res, next);
    expect(next.calledOnce).to.be.true;
    expect(res.redirect.called).to.be.false;
  });

  it('should redirect if x-forwarded-proto is http', () => {
    req.headers['x-forwarded-proto'] = 'http';
    middleware = forceHttps();
    middleware(req, res, next);
    expect(res.redirect.calledOnceWith(301, 'https://example.com/path?query=1')).to.be.true;
    expect(next.called).to.be.false;
  });

  it('should strip www if stripWWW is true', () => {
    req.hostname = 'www.example.com';
    middleware = forceHttps({ stripWWW: true });
    middleware(req, res, next);
    expect(res.redirect.calledOnceWith(301, 'https://example.com/path?query=1')).to.be.true;
    expect(next.called).to.be.false;
  });

  it('should redirect to redirectHostname if configured', () => {
    middleware = forceHttps({ redirectHostnames: { 'old.com': 'new.com' } });
    req.hostname = 'old.com';
    middleware(req, res, next);
    expect(res.redirect.calledOnceWith(301, 'https://new.com/path?query=1')).to.be.true;
    expect(next.called).to.be.false;
  });

  it('should not redirect if already on redirectHostname and no x-forwarded-proto', () => {
    middleware = forceHttps({ redirectHostnames: { 'old.com': 'new.com' } });
    req.hostname = 'new.com';
    middleware(req, res, next);
    expect(next.calledOnce).to.be.true;
    expect(res.redirect.called).to.be.false;
  });

  it('should redirect if already on correct hostname but x-forwarded-proto is http', () => {
    middleware = forceHttps({ redirectHostnames: { 'old.com': 'new.com' } });
    req.hostname = 'new.com';
    req.headers['X-Forwarded-Proto'] = 'http';
    middleware(req, res, next);
    expect(res.redirect.calledOnceWith(301, 'https://new.com/path?query=1')).to.be.true;
    expect(next.called).to.be.false;
  });
});
