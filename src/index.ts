import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    //  slowMo: 250
  });
  const page = await browser.newPage();
  await page.goto("https://developers.google.com/web/");
  // Type into search box.
  await page.type(".devsite-search-field", "Headless Chrome");
  // Wait for suggest overlay to appear and click "show all results".
  const allResultsSelector = ".devsite-suggest-all-results";
  await page.waitForSelector(allResultsSelector);
  await page.click(allResultsSelector);
  // Wait for the results page to load and display the results.
  const resultsSelector = ".gsc-results .gs-title";
  await page.waitForSelector(resultsSelector);
  // Extract the results from the page.

  const links = await page.evaluate((resultsSelector: any) => {
    return [...Array.from(document.querySelectorAll(resultsSelector))].map(
      (anchor: any) => {
        const title = anchor?.textContent.split("|")[0].trim();
        return `${title} - ${anchor?.href}`;
      }
    );
  }, resultsSelector);
  // Print all the files.
  console.log(links.join("\n\n"));
  await browser.close();
})();

// const url =
//   "https://montmovie.co/category/4/%D8%B3%D8%B1%DB%8C%D8%A7%D9%84-%D8%B3%D8%B1%DB%8C%D8%A7%D9%84-%D8%AE%D8%A7%D8%B1%D8%AC%DB%8C/";
// async function run() {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto(url);
//   await page.screenshot({ path: "screenshot.png" });
//   browser.close();
// }
// run();
