# media-downloader

A basic media downloading tool written in [Deno](https://deno.land). Pass in a URL, select which filetypes you're interested in, and it will scrape the HTML and download all the `<link>`ed files that match the filter.

## Preqequisites

* [Deno](https://deno.land) 1.1.0+

## Usage

- `-u` - the URL to scrape for media links
- `-t` - the filetype(s) to download

### Example

```ts
deno run --allow-net --allow-write --allow-read --unstable media_downloader.ts -t jpg -t png -u https://dribbble.com/shots
```

## Supported Sites

This tool has been confirmed to work with imageboards [e.g., [4chan](https://4chan.org)) and [thisvid](https://thisvid.space). Feel free to open a PR to contribute more sites to this list.

## Roadmap

- Support `<img>` tags
- Multiple parallel requests
