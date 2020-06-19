import { exists, ensureDir } from "https://deno.land/std/fs/mod.ts";

import { bold, green } from "https://deno.land/std/fmt/colors.ts";

class UrlDownloader {
  static readonly DEFAULT_PATH = './output/';
  url: string;
  name: string;
  path: string;

  constructor(url: string, name: string, path?: string) {
    this.url = url;
    this.name = name;
    this.path = path || UrlDownloader.DEFAULT_PATH;
  }

  async download() {
    const fileExists = await exists(this.path + this.name);
    if(fileExists) {
      console.log(this.name + ' already exists, skipping...');
      return;
    }
  
    console.log(bold(green('Downloading ' + this.name + ' (' + this.url + ') ...')));
    const response = await fetch(this.url);
  
    console.log('Processing response ...');
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();
    const data = new Deno.Buffer(buffer).bytes();
  
    console.log('Writing file ...');

    await ensureDir(this.path);
    await Deno.writeFile(this.path + this.name, data);
  
    // TODO: https://github.com/denoland/deno/pull/5789
    // const newFile = await Deno.open(this.path, { create: true, write: true });
    // await Deno.copy(response.body.getReader(), newFile);
  }
}

export default UrlDownloader;
