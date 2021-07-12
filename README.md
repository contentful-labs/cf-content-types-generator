# TS contentful content types generator

> A CLI to generate Typescript definitions based on [JSON export](https://github.com/contentful/contentful-cli/tree/master/docs/space/export) generated with [contentful CLI](https://github.com/contentful/contentful-cli).

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/cf-content-types-generator.svg)](https://npmjs.org/package/cf-content-types-generator)
[![Downloads/week](https://img.shields.io/npm/dw/cf-content-types-generator.svg)](https://npmjs.org/package/cf-content-types-generator)
[![License](https://img.shields.io/npm/l/cf-content-types-generator.svg)](https://github.com/contentful-labs/cf-content-types-generator/blob/master/package.json)
![Tests](https://github.com/contentful-labs/cf-content-types-generator/workflows/Tests/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/contentful-labs/cf-content-types-generator/badge.svg)](https://coveralls.io/github/contentful-labs/cf-content-types-generator)

# Table of Contents
- [Installation](#installation)
- [Usage](#usage)
    - [Example](#example)
        - [Local](#local)
        - [Remote](#remote)
    - [Input](#input)
    - [Output](#output)
    - [Direct Usage](#direct-usage)
    - [Browser Usage](#browser-usage)

## Installation

```bash
npm install cf-content-types-generator
```

## Usage

```bash
Contentful Content Types (TS Definitions) Generator

USAGE
  $ cf-content-types-generator [FILE]

ARGUMENTS
  FILE  local export (.json)

OPTIONS
  -e, --environment=environment  environment
  -h, --help                     show CLI help
  -o, --out=out                  output directory
  -p, --preserve                 preserve output folder
  -s, --spaceId=spaceId          space id
  -t, --token=token              management token
  -v, --version                  show CLI version
```

### Example

#### Local
Use a local `JSON` file to load `contentTypes`. Flags for `spaceId`, `token` and `environement` will be ignored.

**Will print result to console**
```bash
cf-content-types-generator path/to/exported/file.json
```
> in a real world scenario, you would pipe the result to a file.

**Will store resulting files in target directory**
```bash
cf-content-types-generator path/to/exported/file.json path/to/target/out/directory 
```
#### Remote
If no `file` arg provided, remote mode es enabled. 
`spaceId` and `token` flags need to be set.

```bash
cf-content-types-generator -s 2l3j7k267xxx  -t CFPAT-64FtZEIOruksuaE_Td0qBvHdELNWBCC0fZUWq1NFxxx
```


### Input
As input a [json file](https://github.com/contentful/contentful-cli/tree/master/docs/space/export#exported-data) with a `contentTypes` field is expected:

```json
{
  "contentTypes": [
    {
      "sys": {
        "id": "artist",
        "type": "ContentType"
      },
      "displayField": "name",
      "name": "Artist",
      "fields": [
        {
          "id": "name",
          "name": "Name",
          "type": "Symbol",
          "required": true,
          "validations": [
            {
              "unique": true
            }
          ]
        },
        {
          "id": "profilePicture",
          "name": "Profile Picture",
          "type": "Link",
          "required": false,
          "validations": [
            {
              "linkMimetypeGroup": [
                "image"
              ]
            }
          ],
          "linkType": "Asset"
        },
        {
          "id": "bio",
          "name": "Bio",
          "type": "RichText",
          "required": false,
          "validations": [
            {
              "nodes": {
              }
            },
            {
              "enabledMarks": [
              ],
              "message": "Marks are not allowed"
            },
            {
              "enabledNodeTypes": [
              ],
              "message": "Nodes are not allowed"
            }
          ]
        }
      ]
    },
    {
      "sys": {
        "id": "artwork",
        "type": "ContentType"
      },
      "displayField": "name",
      "name": "Artwork",
      "fields": [
        {
          "id": "name",
          "name": "Name",
          "type": "Symbol",
          "required": true,
          "validations": [
          ]
        },
        {
          "id": "type",
          "name": "Type",
          "type": "Symbol",
          "required": false,
          "validations": [
            {
              "in": [
                "print",
                "drawing",
                "painting"
              ],
              "message": "Hello - this is a custom error message."
            }
          ]
        },
        {
          "id": "preview",
          "name": "Preview",
          "type": "Array",
          "required": false,
          "validations": [
          ],
          "items": {
            "type": "Link",
            "validations": [
              {
                "linkMimetypeGroup": [
                  "image",
                  "audio",
                  "video"
                ]
              }
            ],
            "linkType": "Asset"
          }
        },
        {
          "id": "artist",
          "name": "Artist",
          "type": "Link",
          "required": true,
          "validations": [
            {
              "linkContentType": [
                "artist"
              ]
            }
          ],
          "linkType": "Entry"
        }
      ]
    }
  ]
}
```
> This example shows a subset of the actual payload provided by contentful's cli export command.

### Output 
```typescript
import * as Contentful from "contentful";

export interface TypeArtistFields {
    name: Contentful.EntryFields.Symbol;
    profilePicture?: Contentful.Asset;
    bio?: Contentful.EntryFields.RichText;
}

export type TypeArtist = Contentful.Entry<TypeArtistFields>;

export interface TypeArtworkFields {
    name: Contentful.EntryFields.Symbol;
    type?: "print" | "drawing" | "painting";
    preview?: Contentful.Asset[];
    artist: Contentful.Entry<TypeArtistFields>;
}

export type TypeArtwork = Contentful.Entry<TypeArtworkFields>;
```
This all only works if you add the [`contentful`](https://www.npmjs.com/package/contentful) package to your target project to get all relevant type definitions.

### Direct Usage
If you're not a CLI person, or you want to integrate it with your tooling workflow, you can also directly use the `CFDefinitionsBuilder` from `cf-definitions-builder.ts`

```typescript
const stringContent = new CFDefinitionsBuilder()
    .appendType({
        id: "rootId",
        name: "Root Name",
        sys: {
            id: "sysId",
            type: "ContentType",
        }, fields: [{
            id: "myFieldId",
            type: "Symbol",
            required: true,
            validations: []            
        }]
    })
    .toString();
```

### Browser Usage
You can use `CFDefinitionsBuilder` also in a browser environment.
> Example: [TS Content Types Generator App](https://github.com/marcolink/cf-content-types-generator-app)

