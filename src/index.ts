import puppeteer from "puppeteer";
import { configs } from "./configs";

(async function () {
  const browser = await puppeteer.launch({ headless: false, slowMo: 200 });
  const firstPage = await browser.newPage();
  await firstPage.setCookie(...(configs.cookies as any));
  await firstPage.goto(configs.url);

  async function startPage(mainPage: puppeteer.Page) {
    const pageTarget = mainPage.target();
    const anchorSelector = ".c-jobListView__itemControls a";
    await mainPage.waitForSelector(anchorSelector);
    const anchorTagsArray: any = await mainPage.evaluate((anchorSelector) => {
      return Array.from(document.querySelectorAll(anchorSelector));
    }, anchorSelector);

    for (let i = 0; i < anchorTagsArray.length; i++) {
      await mainPage.$$eval(
        anchorSelector,
        (anchorTags, i) => {
          const anchorTag = anchorTags[i] as HTMLAnchorElement;
          anchorTag.click();
        },
        i
      );
      const newTarget = await browser.waitForTarget(
        (target) => target.opener() === pageTarget
      );
      const newPage = await newTarget.page();
      if (!newPage) return;
      const buttonSendSelector = "form input[type='submit']";
      await newPage.waitForSelector(buttonSendSelector);
      await newPage.click(buttonSendSelector);
      const buttonOkSelector = "button.js-confirmOK']";
      await newPage.waitForSelector(buttonOkSelector);
      await newPage.click(buttonOkSelector);
      await newPage.waitForNavigation();
      newPage && (await newPage.close());
    }
    const nextSelector = "li a[rel='next']";
    const nextButton = await mainPage.evaluate((nextSelector) => {
      let nextBtn = document.querySelector(
        nextSelector
      ) as HTMLAnchorElement | null;
      nextBtn && nextBtn.click();
      return nextBtn;
    }, nextSelector);

    console.log(nextButton, mainPage);
    nextButton && (await mainPage.waitForNavigation());
    nextButton && (await startPage(mainPage));
  }

  await startPage(firstPage);

  await browser.close();
})();
