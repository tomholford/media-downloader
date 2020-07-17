// import {  } from 'https://deno.land/std/hash/mod.ts';

import { walkSync, WalkEntry, walk } from "https://deno.land/std/fs/mod.ts";
import FileHasher from './file_hasher.ts';
import asyncForEach from './async_for_each.ts';

interface DuplicateMap {
  [x: string]: string;
}

/**
 * Removes duplicate files within a directory 
 */
class DuplicateRemover {
  directory: string;

  constructor(directory: string) {
    this.directory = directory;
  }

  async duplicates(): Promise<DuplicateMap> {
    let duplicateMap: DuplicateMap = {};
    const paths = await this.paths();

    paths.forEach((path: string, _i, _a) => {
      const hash = FileHasher.md5(path);
      if(hash in Object.keys(duplicateMap)) {
        console.log('dupe found!')
        console.log(path);
      } else {
        duplicateMap[hash] = path;
      }
    })

    return duplicateMap;
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
