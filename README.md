# media-downloader

![image](https://user-images.githubusercontent.com/16504501/85109233-f58a6300-b24b-11ea-9408-781501f81946.png)

A basic media downloading tool written in Typescript for [Deno](https://deno.land). Pass in a URL, select which filetypes you're interested in, and it will scrape the HTML and download all the linked files that match the filter.

## Prerequisites

* [Deno](https://deno.land) 1.6.0+

## Usage

- `-u` - **(required)** the URL to scrape for media links
- `-p` - *(optional)* the output path for writing files; defaults to `./output/`
- `-t` - *(optional)* the filetype(s) to download; defaults to several common image formats
- `-R` - *(optional)* after finishing downloading, scan the output directory and remove duplicates

### Example

```sh
deno run --allow-net --allow-write --allow-read --unstable media_downloader.ts -t jpg -t png -u https://dribbble.com/shots
```

## Install
1. Clone this repo
1. Run this command
```sh
deno install --allow-net --allow-write --allow-read --unstable --name media-downloader main.ts
```
1. Then, use it like so:
```sh
media-downloader -u https://example.com
```

### macOS

You will also need to add the `deno` executables path to your `bash_profile`:
```sh
export PATH="/Users/[your username]/.deno/bin:$PATH"
```

## Supported Sites

This tool has been confirmed to work with imageboards [e.g., [4chan](https://4chan.org)) and [thisvid](https://thisvid.space). Feel free to open a PR to contribute more sites to this list.

## Roadmap

- Support `<img>` tags
- Multiple parallel requests
