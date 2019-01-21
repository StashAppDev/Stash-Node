import { JSDOM, ResourceLoader } from "jsdom";

export class JsdomScraper {
  // tslint:disable-next-line:max-line-length
  public static readonly UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";

  public readonly resourceLoader = new ResourceLoader({
    strictSSL: false,
    userAgent: JsdomScraper.UA,
  });

  public makeDomForUrl(url: string) {
    return JSDOM.fromURL(url, {
      // resources: this.resourceLoader,
      // runScripts: "dangerously",
    });
  }

  public evaluateXpath(xpath: string, document: Document) {
    return document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
  }
}
