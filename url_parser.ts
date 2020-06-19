import { bold, blue } from "https://deno.land/std/fmt/colors.ts";

class UrlParser {
  static readonly LINK_REGEX_BASE = '((?<=src=")|(?<=href="))([\\/.:-\\d\\w]+\\.(TYPE))';

  url: string;
  file_types: Array<string>;
  html: string = '';

  constructor(url: string, file_types: Array<string>) {
    this.url = url;
    this.file_types = file_types;
  }

  async links(): Promise<Array<string>> {
    await this.scrape();

    const linkRegex = new RegExp(UrlParser.LINK_REGEX_BASE.replace('TYPE', this.file_types.join('|')), 'g');
    const matches = [...this.html.matchAll(linkRegex)];
    const urls = matches.map((match: RegExpMatchArray) => match[0]);


    let unique = [...new Set(urls)]; 

    return unique;
  }

  private async scrape() {
    console.log(bold(blue(`Scraping ${ this.url } for ${ this.file_types.join(', ') } files ...`)));
    const res = await fetch(this.url);
    this.html = await res.text();
  }
}

export default UrlParser;