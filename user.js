class User {

    constructor() {
        this.url = "";
        this.token="";
        this.org="";
    }

    getUrl() {
        return this.url
    }

    getToken() {
        return this.token
    }

    getOrg() {
        return this.org
    }

    setUrl(url){
        this.url = url
    }

    setOrg(org){
        this.org = org
    }

    setToken(token){
        this.token=token
    }

}

class Singleton {

  constructor() {
      if (!Singleton.instance) {
          Singleton.instance = new User();
      }
  }

  getInstance() {
      return Singleton.instance;
  }

}

module.exports = Singleton;