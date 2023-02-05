const puppeteer = require("puppeteer");
const { createUser } = require("../factory/userFactory");
const { createSession } = require("../factory/sessionFactory");

class Puppeteer {
  async createBrowser() {
    this.browser = await puppeteer.launch({
      headless: false, //that means that chromium will attempt to open a window on our local machine.
      headless: true,
      args: ["--no-sandbox"],
    });
    return this.browser;
  }

  async createPage() {
    this.page = await this.browser.newPage();
    return this.page;
  }

  async pageLogin() {
    const user = await createUser();
    const { session, sessionSig } = createSession(user);
    await this.page.setCookie({ name: "session", value: session });
    await this.page.setCookie({ name: "session.sig", value: sessionSig });
    await this.page.goto("http://localhost:3000/blogs");
  }

  async getContentOF(selector) {
    return await this.page.$eval(selector, (el) => el.innerHTML);
  }

  async get(path) {
    return await this.page.evaluate(function (getPath) {
      return fetch(`${getPath}`, {
        method: "GET",
        credentials: "same-origin", // send my cookies sessions with the request
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
    }, path);
  }

  async post(path, data) {
    return await this.page.evaluate(
      function (getPath, getDataObj) {
        return fetch(getPath, {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(getDataObj),
        }).then((res) => res.json());
      },
      path,
      data
    );
  }

  executeActions(actions) {
    //destactuing in map require this happen in ( { write value here } )
    return Promise.all(
      actions.map(({ method, path, data }) => {
        //this[method] = get or post which are the fun above
        return this[method](path, data);
      })
    );
  }
}

module.exports = Puppeteer;
