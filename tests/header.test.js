const Puppeteer = require("./helper/page");
const PageObj = new Puppeteer();
let page, browser;

describe("Testing the header", () => {
  beforeEach(async () => {
    browser = await PageObj.createBrowser();
    page = await PageObj.createPage();
    await page.goto("http://localhost:3000");
  });

  afterEach(async () => {
    await browser.close();
  });

  test("Clicking login starts the oauth flow", async () => {
    await page.click(".indigo .right a");
    const url = await page.url();
    expect(url).toMatch(/accounts\.google\.com/);
  });

  test("The header has the correct test", async () => {
    const text = await PageObj.getContentOF("a.brand-logo");
    expect(text).toEqual("Blogster");
  });

  test("When signed in, shows logout button", async () => {
    await PageObj.pageLogin();
    await page.waitForSelector('a[href="/auth/logout"]');
    const text = await PageObj.getContentOF('a[href="/auth/logout"');
    expect(text).toEqual("Logout");
  });
});
