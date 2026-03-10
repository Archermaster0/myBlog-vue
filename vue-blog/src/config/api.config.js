export default {
  'register': {
    url: '/admin/register',
    method: 'POST',
    rsaKey: 'password',
    setToken: true
  },
  'index': {
    url: '/index',
    method: 'GET',
    noMessage: true
  },
  'login': {
    url: 'admin/login',
    method: 'POST',
    rsaKey: 'password',
    setToken: true
  },
  'getUserInfo': {
    url: '/user',
    method: 'GET',
  },
  'putUserInfo': {
    url: '/user',
    method: 'PUT',
  },
  'pubKey': {
    url: '/keys',
    method: 'GET'
  },
  'articles': {
    url: '/api/rest/articles',
    method: 'GET'
  },
  'postArticle': {
    url: '/api/rest/articles',
    method: 'POST'
  },
  'getArticleById': {
    url: '/api/rest/articles/:id',
    rest: true,
    method: 'GET'
  },
  'columns': {
    url: '/api/rest/columns',
    method: 'GET'
  },
  'postColumn': {
    url: '/api/rest/columns',
    method: 'POST'
  },
  'postComment': {
    url: '/api/rest/comments',
    method: 'POST'
  },
  'articleLikes': {
    url: '/articles/likes/:id',
    method: 'POST',
    rest: true
  },
  'uploadUser': {
    url: '/upload/user',
    method: 'POST'
  },
  'uploadAlbum': {
    url: '/upload/album',
    method: 'POST'
  },
  'getAlbum': {
    url: '/album',
    method: 'GET'
  },
  'deleteAlbum': {
    url: '/album/:file',
    method: 'DELETE',
    rest: true
  }
}