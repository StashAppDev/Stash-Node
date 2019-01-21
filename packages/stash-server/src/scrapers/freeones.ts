import { Maybe } from "../typings/stash";
import { JsdomScraper } from "./base/jsdom";

export class FreeonesScraper extends JsdomScraper {
  public async getPerformerNames(query: string) {
    const dom = await this.makeDomForUrl(`https://www.freeones.com/suggestions.php?q=${query}&t=1`);
    const suggestionElements = dom.window.document.querySelectorAll(".suggestion");
    const names: string[] = [];
    suggestionElements.forEach((element) => {
      if (!element.textContent) { return; }
      names.push(element.textContent.trim());
    });
    return names;
  }

  public async getPerformer(performerName: string) {
    let dom = await this.makeDomForUrl(`https://www.freeones.com/search/?t=1&q=${performerName}&view=thumbs`);

    const performerLink = Array.from(dom.window.document.querySelectorAll<HTMLAnchorElement>("div.Block3 a"))
      .find((el) => {
        if (el.href === "/html/j_links/Jenna_Leigh_c/") { return false; }
        if (el.href === "/html/a_links/Alexa_Grace_c/") { return false; }
        if (el.text.toLowerCase() === performerName.toLowerCase()) { return true; }
        return false;
      });
    if (!performerLink) { return undefined; }

    dom = await this.makeDomForUrl(performerLink.href);
    const bioLink = Array.from(dom.window.document.querySelectorAll("a"))
      .find((el) => el.textContent!.includes("biography"));
    if (!bioLink) { return undefined; }

    dom = await this.makeDomForUrl(bioLink.href);
    const params = dom.window.document.querySelectorAll(".paramvalue");
    const paramIndexes = this.getIndexes(dom.window.document.querySelectorAll(".paramname"));

    const result: any = {};
    result.url = dom.window.location.toString();
    result.name = this.paramValue(params, paramIndexes.name);
    result.ethnicity = this.getEthnicity(this.paramValue(params, paramIndexes.ethnicity));
    result.country = this.paramValue(params, paramIndexes.country);
    result.eye_color = this.paramValue(params, paramIndexes.eye_color);
    result.measurements = this.paramValue(params, paramIndexes.measurements);
    result.fake_tits = this.paramValue(params, paramIndexes.fake_tits);
    result.career_length = this.paramValue(params, paramIndexes.career_length).replace(/\([\s\S]*/, "").trim();
    result.tattoos = this.paramValue(params, paramIndexes.tattoos);
    result.piercings = this.paramValue(params, paramIndexes.piercings);
    result.aliases = this.paramValue(params, paramIndexes.aliases);

    const birth = this.paramValue(params, paramIndexes.birthdate).replace(/ \(\d* years old\)/, "");
    if (birth !== "Unknown" && birth.length > 0) {
      const birthdate = new Date(birth);
      result.birthdate = birthdate.toISOString().substring(0, 10);
    }

    const height = this.paramValue(params, paramIndexes.height);
    const heightMatch = height.match(/heightcm = "(.*)"\;/);
    if (!!heightMatch && !!heightMatch[1]) {
      result.height = heightMatch[1];
    }

    const twitterElement = dom.window.document.querySelector<HTMLAnchorElement>(".twitter a");
    if (!!twitterElement && !!twitterElement.href && twitterElement.href.length > 0) {
      result.twitter = (new URL(twitterElement.href)).pathname.replace("/", "");
    }

    const instagramElement = dom.window.document.querySelector<HTMLAnchorElement>(".instagram a");
    if (!!instagramElement && !!instagramElement.href && instagramElement.href.length > 0) {
      result.instagram = (new URL(instagramElement.href)).pathname.replace("/", "");
    }

    return result;
  }

  private paramValue(params: NodeListOf<Element>, paramIndex: Maybe<number>) {
    if (paramIndex === undefined) {
      return "";
    } else {
      return this.strip(params[paramIndex].textContent || "");
    }
  }

  private getIndexes(elements: NodeListOf<Element>) {
    const result: any = {};
    Array.from(elements).forEach((element, index) => {
      if (!element.textContent) { return; }
      const paramName = this.strip(element.textContent);
      switch (paramName) {
        case "Babe Name:":
          result.name = index;
          break;
        case "Ethnicity:":
          result.ethnicity = index;
          break;
        case "Country of Origin:":
          result.country = index;
          break;
        case "Date of Birth:":
          result.birthdate = index;
          break;
        case "Eye Color:":
          result.eye_color = index;
          break;
        case "Height:":
          result.height = index;
          break;
        case "Measurements:":
          result.measurements = index;
          break;
        case "Fake boobs:":
          result.fake_tits = index;
          break;
        case "Career Start And End":
          result.career_length = index;
          break;
        case "Tattoos:":
          result.tattoos = index;
          break;
        case "Piercings:":
          result.piercings = index;
          break;
        case "Aliases:":
          result.aliases = index;
          break;
      }
    });
    return result;
  }

  private getEthnicity(ethnicity: string) {
    switch (ethnicity) {
      case "Caucasian": return "white";
      case "Black": return "black";
      case "Latin": return "hispanic";
      case "Asian": return "asian";
      default: return undefined;
    }
  }

  // https://stackoverflow.com/questions/20305966/why-does-strip-not-remove-the-leading-whitespace
  private strip(text: string) {
    // return text.replace(/\A\p{Space}*|\p{Space}*\z/, "");
    return text.trim();
  }
}
