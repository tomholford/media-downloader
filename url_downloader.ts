import { exists, ensureDir } from "https://deno.land/std/fs/mod.ts";
import { fromStreamReader } from "https://deno.land/std/io/mod.ts";
import { join } from "https://deno.land/std/path/mod.ts";
import { bold, blue, green } from "https://deno.land/std/fmt/colors.ts";
import { filesize } from "https://deno.land/x/filesize/mod.ts";


class UrlDownloader {
  url: string;
  name: string;
  path: string;

  constructor(url: string, name: string, path: string) {
    this.url = url;
    this.name = name;
    this.path = path;
  }

  async download() {
    const fileExists = await exists(this.filepath);
    if(fileExists) {
      console.log(this.name + ' already exists, skipping...');
      return;
    }

    console.log(bold(green('Downloading ' + this.name + ' (' + this.url + ') ...')));
    const response = await fetch(this.url);

    console.log('Writing file ...');
    await ensureDir(this.path);
    const newFile = await Deno.open(this.filepath, { create: true, write: true });
    const reader = fromStreamReader(response.body!.getReader());
    await Deno.copy(reader, newFile);
    const stats = await Deno.fstat(newFile.rid);
    newFile.close();
    console.log(blue(`Wrote ${ filesize(stats.size) } to ${ this.filepath }`))
  }

  get filepath(): string {
    return join(this.path, this.name);
  }
}

export default UrlDownloader;
