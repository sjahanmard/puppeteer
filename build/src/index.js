"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch();
    const page = yield browser.newPage();
    yield page.goto("https://developers.google.com/web/");
    // Type into search box.
    yield page.type(".devsite-search-field", "Headless Chrome");
    // Wait for suggest overlay to appear and click "show all results".
    const allResultsSelector = ".devsite-suggest-all-results";
    yield page.waitForSelector(allResultsSelector);
    yield page.click(allResultsSelector);
    // Wait for the results page to load and display the results.
    const resultsSelector = ".gsc-results .gs-title";
    yield page.waitForSelector(resultsSelector);
    // Extract the results from the page.
    const links = yield page.evaluate((resultsSelector) => {
        return [...Array.from(document.querySelectorAll(resultsSelector))].map((anchor) => {
            const title = anchor === null || anchor === void 0 ? void 0 : anchor.textContent.split("|")[0].trim();
            return `${title} - ${anchor === null || anchor === void 0 ? void 0 : anchor.href}`;
        });
    }, resultsSelector);
    // Print all the files.
    console.log(links.join("\n\n"));
    yield browser.close();
}))();
