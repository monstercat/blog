# Static Blog JSON Generator

This project is a simple JSON file generator for a blog. It's using a custom
plugin to look at metalsmith data and create directories of JSON which can be
used to fetch as an static API. 

It's suggested you setup your server to serve the files without the JSON
extension for a prettier experience if needed.

## Features

### Structure

#### /json

This is where the static API is generated.

#### /json/home.json

This file contains the first 2 posts metadata.

#### /json/posts/X.json

This file contains the metadata for the post.

#### /json/archive/index.json

This file describes the number of pages, pagination limits, total post count.

#### /json/archive/pages/X.json

This contains all the posts meta data that are found for X page.

#### /json/tags/index.json

This contains a list of all the tags.

#### /json/tags/TAG/index.json

This file describes the number of pages, pagination limits, total post count for
the TAG.

#### /json/tags/TAG/pages/X.json

This contains all the posts meta data that are found for X page for TAG.

#### /posts

All markdown is held here.

### Excerpts

Includes excerpts in the meta data by looking for the first markdown paragraph.

### Notes 

 * Files starting with a period are ignored. (For vim etc.) 
 * Posts are all sorted by recent date.
 * Tags are a meta value simply separated by commas.
 * It is expected that images are hosted separately. We use an assets server.
 * It looks for markdown in `src/posts`.
 * You can use the watch script to set up a service to rebuild when files are
   changed.

