# media-downloader

![image](https://user-images.githubusercontent.com/16504501/85108368-937d2e00-b24a-11ea-8fe7-b91245ba0539.png)

A basic media downloading tool written in [Deno](https://deno.land). Pass in a URL, select which filetypes you're interested in, and it will scrape the HTML and download all the linked files that match the filter.

## Preqequisites

* [Deno](https://deno.land) 1.1.0+

## Usage

- `-u` - **(required)** the URL to scrape for media links
- `-t` - *(optional)* the filetype(s) to download; defaults to several common image formats

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

## Supported Sites

This tool has been confirmed to work with imageboards [e.g., [4chan](https://4chan.org)) and [thisvid](https://thisvid.space). Feel free to open a PR to contribute more sites to this list.

## Roadmap

- `-p` flag for specifying custom output path
- Support `<img>` tags
- Multiple parallel requests
