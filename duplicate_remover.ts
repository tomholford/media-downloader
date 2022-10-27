// import {  } from 'https://deno.land/std/hash/mod.ts';

import { exists, walkSync, WalkEntry } from "https://deno.land/std/fs/mod.ts";
import FileHasher from './file_hasher.ts';
import { asyncForEach } from './async_for_each.ts';

/**
 * Removes duplicate files within a directory 
 */
class DuplicateRemover {
  directory: string;

  constructor(directory: string) {
    this.directory = directory;
  }

  async removeDuplicates() {
    console.log(`removing duplicates from ${this.directory} ...`)
    let duplicateSet: Set<string> = new Set();
    const paths = await this.paths();

    await asyncForEach(paths, async (path: string) => {
      const hash = await FileHasher.md5(path);
      if(duplicateSet.has(hash)) {
        console.log(`Found duplicate at ${path}, removing ...`);
        if(await exists(path)) {
          await Deno.remove(path)
        } else {
          console.log(`Unable to remove ${path}`)
        }
      } else {
        duplicateSet.add(hash);
      }
    })
  }

  private async paths(): Promise<string[]> {
    let output: string[] = [];

    const entries = Array.from(walkSync(this.directory));

    await asyncForEach(entries, async (entry: WalkEntry) => {
      const isDir = await this.isDirectory(entry.path);

      if(!isDir) {
        output.push(entry.path);
      }
    })

    return output;
  }

  private async isDirectory(path: string): Promise<boolean> {
    const f = await Deno.open(path, { read: true, write: false });
    const fileinfo = await Deno.fstat(f.rid);
    f.close();

    return fileinfo.isDirectory;
  }
}

export default DuplicateRemover;
