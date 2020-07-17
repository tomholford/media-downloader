import { parse } from "https://deno.land/std/flags/mod.ts";
import { blue, bold, red } from "https://deno.land/std/fmt/colors.ts";
import { join } from "https://deno.land/std/path/mod.ts";

import DuplicateRemover from './duplicate_remover.ts'
import UrlDownloader from './url_downloader.ts';
import UrlParser from './url_parser.ts';
import asyncForEach from './async_for_each.ts';

class MediaDownloader {
  static readonly DEFUALT_FILETYPES = ['jpg', 'jpeg', 'png', 'gif'];
  static readonly DEFAULT_PATH = './output/';
  static readonly FILE_NAME_REGEX = /\/([A-z0-9\.\-]+)(?=[^\/]*$)/;

  url: string;
  file_types: Array<string> = MediaDownloader.DEFUALT_FILETYPES;
  path: string;
  removeDuplicates: boolean = false;

  constructor() { 
    const parsedArgs = parse(Deno.args);
    if(!parsedArgs['u']) {
      throw '-u (url) argument required';
    }
    this.url = parsedArgs['u'];

    this.path = parsedArgs['p'] || join(Deno.cwd(), MediaDownloader.DEFAULT_PATH);

    this.removeDuplicates = parsedArgs['R'] ? true : false;

    const file_types: string | Array<string> | undefined = parsedArgs['t'];
    if(file_types) {
      if(typeof file_types === 'string') {
        this.file_types = [file_types];
      } else {
        this.file_types = file_types;
      }
    }
   }

   async run() {
    const up = new UrlParser(this.url, this.file_types);
    const matches = await up.links();

    console.log(bold(blue(`Querying ${ matches.length } files ...`)));
    console.log(bold(blue(`Writing to ${ this.path } ...`)));

    await asyncForEach(matches, async (match: string) => {
      let url: string = match;

      // TODO: hack: improve regex to prevent urls like "/gif/"
      if(url.length < 10) {
        console.log(red(`Skipping ${ url } ...`))
        return;
      }
    
      if(url.startsWith('//')) {
        url = `https:${url}`;
      }
    
      const nameMatch: RegExpMatchArray | null = url.match(MediaDownloader.FILE_NAME_REGEX)
    
      let name = '';
      if(nameMatch) {
        name = nameMatch[1];
      } else {
        throw 'should not get here';
      }
    
      const d = new UrlDownloader(url, name, this.path);
      await d.download();
    });

    if(this.removeDuplicates) {
      const dr = new DuplicateRemover(this.path);
      await dr.removeDuplicates();
    }

    console.log('Done :)')
  }
}

export default MediaDownloader;
