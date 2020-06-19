import { bold, blue } from "https://deno.land/std/fmt/colors.ts";

class UrlParser {
  static readonly LINK_REGEX_BASE = '(?<=href=")([A-z0-9\:\/\.]*\.TYPE)';

  url: string;
  file_types: Array<string>;
  html: string = '';

  constructor(url: string, file_types: Array<string>) {
    this.url = url;
    this.file_types = file_types;
  }

  async links(): Promise<Array<string>> {
    await this.scrape();
    let output: Array<string> = [];

    this.file_types.forEach((fileType: string) => {
      const linkRegex = new RegExp(UrlParser.LINK_REGEX_BASE.replace('TYPE', fileType), 'g');
      const matches = [...this.html.matchAll(linkRegex)];
      const urls = matches.map((match: RegExpMatchArray) => match[0]);

      output = [...output, ...urls];
    });

    let unique = [...new Set(output)]; 

    return unique;
  }

  private async scrape() {
    console.log(bold(blue(`Scraping ${ this.url } for ${ this.file_types.join(', ') } files ...`)));
    const res = await fetch(this.url);
    this.html = await res.text();
  }
}

export default UrlParser;