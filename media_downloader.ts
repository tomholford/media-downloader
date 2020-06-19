import { exists } from "https://deno.land/std/fs/mod.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";

import asyncForEach from './async_for_each.ts';

const DEFUALT_FILETYPES = ['jpg', 'jpeg', 'png', 'gif'];

const parsedArgs = parse(Deno.args);
console.log(parsedArgs);

if(!parsedArgs['u']) {
  throw '-url argument required' 
}

if(!parsedArgs['t']) {
  throw '-type argument required' 
}

const scrapeUrl = parsedArgs['u'];
const fileType = parsedArgs['t'];

const mediaUrlRegex = new RegExp(`(?<=href=")([A-z0-9\:\/\.]*\.${ fileType })`, 'g');
const mediaNameRegex = /\/([A-z0-9\.]+)(?=[^\/]*$)/;

console.log(`Scraping ${ scrapeUrl } for ${ fileType } files ...`);

const res = await fetch(scrapeUrl);
const body = await res.text();
let matches = [...body.matchAll(mediaUrlRegex)];

const downloadFile = async (url: string, name: string) => {
  const filepath: string = './output/' + name;
  const fileExists = await exists(filepath);
  if(fileExists) {
    console.log(name + ' already exists, skipping...');
    return;
  }

  console.log('Downloading ' + name + ' (' + url + ') ...');
  const response = await fetch(url);

  console.log('Processing response ...');
  const blob = await response.blob();
  const buffer = await blob.arrayBuffer();
  const data = new Deno.Buffer(buffer).bytes();

  console.log('Writing file ...');
  await Deno.writeFile(filepath, data);


  // const newFile = await Deno.open(filepath, { create: true, write: true });
  // await Deno.copy(response.body.getReader(), newFile);
}

console.log(`Querying ${ matches.length } files ...`);

asyncForEach(matches, async (match: Array<string>) => {
  let url: string = match[0];

  if(url.startsWith('//')) {
    url = `https:${url}`;
  }

  const nameMatch: RegExpMatchArray | null = url.match(mediaNameRegex)
  let name: string = Date.now().toString() + `.${ fileType }`;

  if(nameMatch) {
    name = nameMatch[1];
  }

  await downloadFile(url, name);
})

console.log('Done :)');