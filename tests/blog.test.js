const Puppeteer = require("./helper/page");
const PageObj = new Puppeteer();

let page, browser;

beforeEach(async () => {
  browser = await PageObj.createBrowser();
  page = await PageObj.createPage();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await browser.close();
});

describe("When loged in", () => {
  beforeEach(async () => {
    await PageObj.pageLogin();
    await page.click("a.btn-floating");
  });

  test("Can see blog create form", async () => {
    const text = await PageObj.getContentOF("form .title label");
    expect(text).toEqual(text);
  });

  describe("And using valid data", () => {
    beforeEach(async () => {
      await page.type("form .title input", "title");
      await page.type("form .content input", "content");
      await page.click("form button.teal.btn-flat");
    });

    test("See the review screen", async () => {
      const text = await PageObj.getContentOF("h5");
      expect(text).toEqual("Please confirm your entries");
    });

    test("Save blog to the blogs collection", async () => {
      await page.click("button.green.btn-flat");

      await page.waitForSelector(".card");
      const title = await PageObj.getContentOF(".card .card-title");
      const content = await PageObj.getContentOF(".card p");
      expect(title).toEqual("title");
      expect(content).toEqual("content");
    });
  });

  describe("And using invalid inputs", () => {
    beforeEach(async () => {
      await page.click("form button.teal.btn-flat");
    });

    test("The form show an error message", async () => {
      const titleError = await PageObj.getContentOF(
        "form .title.title .red-text"
      );
      const contentError = await PageObj.getContentOF(
        "form .content.content .red-text"
      );
      expect(titleError).toEqual("You must provide a value");
      expect(contentError).toEqual("You must provide a value");
    });
  });
});

describe("When user is not login", () => {
  const actions = [
    {
      method: "get",
      path: "/api/blogs",
    },
    {
      method: "post",
      path: "/api/blogs",
      data: {
        title: "T",
        content: "C",
      },
    },
  ];
  test("Blog related actions prohibited", async () => {
    const results = await PageObj.executeActions(actions);
    for (let result of results) {
      expect(result).toEqual({ error: "You must log in!" });
    }
  });
});
