import { crypto, DigestAlgorithm } from "https://deno.land/std/crypto/mod.ts";

/**
 * Hashes a file at a path
 */
class FileHasher {
  filepath: string;

  constructor(filepath: string) {
    this.filepath = filepath;
  }

  static md5(filepath: string) {
    const h = new FileHasher(filepath);
    return h.digestMessage();
  }

  async digestMessage(algorithm: DigestAlgorithm = 'MD5') {
    const hash = await crypto.subtle.digest(algorithm, this.data);
    return this.hex(hash);
  }

  private get data(): Uint8Array {
    return Deno.readFileSync(this.filepath);
  }

  private hex(buffer: ArrayBuffer): string {
    const hashArray = Array.from(new Uint8Array(buffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }
}

export default FileHasher;
