import { ensureDir, exists } from "https://deno.land/std/fs/mod.ts";
import { join } from "https://deno.land/std/path/mod.ts";
import { blue, bold, green } from "https://deno.land/std/fmt/colors.ts";
import { fmtFileSize } from "https://deno.land/x/getfiles/mod.ts";

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
    if (fileExists) {
      console.log(this.name + " already exists, skipping...");
      return;
    }

    console.log(
      bold(green("Downloading " + this.name + " (" + this.url + ") ...")),
    );
    const response = await fetch(this.url);

    if (!response.ok) {
      console.log(
        `Skipping ${this.name} (${response.status} ${response.statusText}: ${this.url})`,
      );
      return;
    }

    console.log("Writing file ...");
    await ensureDir(this.path);
    const newFile = await Deno.open(this.filepath, {
      create: true,
      write: true,
    });

    const reader = response.body?.getReader();
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          await newFile.write(value);
        }
      }
    }

    const stats = await newFile.stat();
    newFile.close();
    console.log(blue(`Wrote ${fmtFileSize(stats.size)} to ${this.filepath}`));
  }

  get filepath(): string {
    return join(this.path, this.name);
  }
}

export default UrlDownloader;
