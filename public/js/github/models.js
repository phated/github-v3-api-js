var User = $.Model.extend({

  baseUrl: 'https://api.github.com',

  defaults: {
    'ghtoken': ''
  , 'user': {}
  },

  initialize: function(){
    if(!window.localStorage.getItem('ghtoken')){
      window.localStorage.setItem('ghtoken',$.cookie('ghtoken'));
    }
    this.set({ghtoken: window.localStorage.getItem('ghtoken')});
  },

  getAuthUser: function(params){
    if(!params) var params = {};
    params.model = this;
    params.token = this.get('ghtoken');
    params.url   = [this.baseUrl,'/user','?access_token=',params.token].join('');
    this.request(params);
  },

  getUser: function(params){
    if(!params) {
      this.getAuthUser();
    } else {
      params.model = this
      params.token = this.get('ghtoken')
      params.url   = [this.baseUrl,'/users/',params.user,'?access_token=',params.token].join('');
      this.request(params);
    }
  },

  request: function(params) {
    $.ajax({
      url: params.url
    , type: 'jsonp'
    , error: function(err) { console.log(err); }
    , success: function(resp) {
        params.model.set({user: resp.data});
        if(params.callback) params.callback();
      }
    });
  }

});

var Repos = $.Model.extend({

  baseUrl: 'https://api.github.com',

  defaults: {
    'ghtoken': ''
  , 'repos': {}
  },

  initialize: function(){
    if(!window.localStorage.getItem('ghtoken')){
      window.localStorage.setItem('ghtoken',$.cookie('ghtoken'));
    }
    this.set({ghtoken: window.localStorage.getItem('ghtoken')});
  },

  getAuthUserRepos: function(params){
    if(!params) var params = {};
    params.model = this;
    params.token = this.get('ghtoken');
    params.url   = [this.baseUrl,'/user/repos','?access_token=',params.token].join('');
    this.request(params);
  },

  getUserRepos: function(params){
    if(!params) {
      this.getAuthUserRepos();
    } else {
      params.model = this;
      params.token = this.get('ghtoken');
      params.url   = [this.baseUrl,'/users/',params.user,'/repos','?access_token=',params.token].join('');
      this.request(params);
    }
  },

  getOrgRepos: function(params){
    if(!params) {
      this.getAuthUserRepos();
    } else {
      params.model = this;
      params.token = this.get('ghtoken');
      params.url   = [this.baseUrl,'/orgs/',params.org,'/repos','?access_token=',params.token].join('');
      this.request(params);
    }
  },

  getRepo: function(params){
    if(!params) {
      this.getAuthUserRepos();
    } else {
      params.model = this;
      params.token = this.get('ghtoken');
      params.url   = [this.baseUrl,'/repos/',params.user,'/',params.repo,'?access_token=',params.token].join('');
      this.request(params);
    }
  },

  request: function(params) {
    $.ajax({
      url: params.url
    , type: 'jsonp'
    , error: function(err) { console.log(err); }
    , success: function(resp) {
        params.model.set({repos: resp.data});
        if(params.callback) params.callback();
      }
    });
  }

});

var Commits = $.Model.extend({

  baseUrl: 'https://api.github.com/repos',

  defaults: {
    'ghtoken': ''
  , 'commits': {}
  },

  initialize: function(){
    if(!window.localStorage.getItem('ghtoken')){
      window.localStorage.setItem('ghtoken',$.cookie('ghtoken'));
    }
    this.set({ghtoken: window.localStorage.getItem('ghtoken')});
  },

  getRepoCommits: function(params){
    if(!params) {

    } else {
      params.model = this;
      params.token = this.get('ghtoken');
      if(params.apiUrl) {
        params.url = [params.apiUrl,'/commits','?access_tokens=',params.token].join('');
      } else {
        params.url = [this.baseUrl,'/',params.user,'/',params.repo,'/commits','?access_token=',params.token].join('');
      }
      this.request(params);
    }
  },

  request: function(params) {
    $.ajax({
      url: params.url
    , type: 'jsonp'
    , error: function(err) { console.log(err); }
    , success: function(resp) {
        params.model.set({commits: resp.data});
        if(params.callback) params.callback();
      }
    });
  }

});

var Tree = $.Model.extend({

  baseUrl: 'https://api.github.com/repos',

  defaults: {
    'ghtoken': ''
  , 'tree': {}
  },

  initialize: function(){
    if(!window.localStorage.getItem('ghtoken')){
      window.localStorage.setItem('ghtoken',$.cookie('ghtoken'));
    }
    this.set({ghtoken: window.localStorage.getItem('ghtoken')});
  },

  getTree: function(params){
    if(!params) {

    } else {
      params.model = this;
      params.token = this.get('ghtoken');
      if(params.apiUrl) {
        params.url = [params.apiUrl,'?access_tokens=',params.token].join('');
      } else {
        params.url = [this.baseUrl,'/',params.user,'/',params.repo,'/git/trees/',params.sha,'?access_token=',params.token].join('');
      }
      this.request(params);
    }
  },

  request: function(params) {
    $.ajax({
      url: params.url
    , type: 'jsonp'
    , error: function(err) { console.log(err); }
    , success: function(resp) {
        params.model.set({tree: resp.data});
        if(params.callback) params.callback();
      }
    });
  }

});

var Blob = $.Model.extend({

  baseUrl: 'https://api.github.com/repos',

  defaults: {
    'ghtoken': ''
  , 'blob': ''
  },

  initialize: function(){
    if(!window.localStorage.getItem('ghtoken')){
      window.localStorage.setItem('ghtoken',$.cookie('ghtoken'));
    }
    this.set({ghtoken: window.localStorage.getItem('ghtoken')});
  },

  getBlob: function(params){
    if(!params) {

    } else {
      params.model = this;
      params.token = this.get('ghtoken');
      if(params.apiUrl) {
        params.url = [params.apiUrl,'?access_tokens=',params.token].join('');
      } else {
        params.url = [this.baseUrl,'/',params.user,'/',params.repo,'/git/blobs/',params.sha,'?access_token=',params.token].join('');
      }
      this.request(params);
    }
  },

  request: function(params) {
    $.ajax({
      url: params.url
    , type: 'html'
    , headers: {
        'Accept' : 'application/vnd.github.raw'
      }
    , error: function(err) { console.log(err); }
    , success: function(resp) {
        params.model.set({blob: resp});
        if(params.callback) params.callback();
      }
    });
  }
});
