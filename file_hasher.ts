import { createHash, Hasher } from 'https://deno.land/std/hash/mod.ts';

/**
 * Hashes a file at a path
 */
class FileHasher {
  filepath: string;

  constructor(filepath: string) {
    this.filepath = filepath;
  }

  static md5(filepath: string): string {
    const h = new FileHasher(filepath);
    return h.hash();
  }

  hash(): string {
    return this.hasher.update(this.data).toString();
  }

  private get data(): Uint8Array {
    return Deno.readFileSync(this.filepath);
  }

  private get hasher(): Hasher {
    return createHash('md5');
  }
}

export default FileHasher;
