import { walk, walkSync } from "https://deno.land/std/fs/mod.ts";

for (const entry of walkSync(".")) {
  console.log(entry.path);
}

// Async
async function printFilesNames() {
  for await (const entry of walk(".")) {
    console.log(entry.path);
  }
}

printFilesNames().then(() => console.log("Done!"));
