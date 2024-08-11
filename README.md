# Config


## Description

This is a convenience module bring together many config file formats including:
* jsonc
* json5
* hjson
* toml
* yaml
* ini

To install the module, use npm:

```bash

npm install @djleehaha/config

```
## Usage

```javascript

import Config from 'config';

const config = Config.parse('json', FS.readFileSync(`config.json`, 'utf8'));
// or
const config = Config.loadConfig({
    "config.json": "json",
    "config.yaml": "yaml",
});
```
## API

### `Config.parse(format, content)`

Parses the content as the given format

#### Parameters:

* format (string): One of the supported file format.
* content (string): Content of the config (not the filename)

Returns: Parsed content of the supplied config

#### Example:

```javascript
const config = Config.parse('json', `{"some": "json"}`);
```

### `Config.loadConfig(files)`

Checks if any of the files in the files object exist and attempts to load them in the corresponding format

#### Parameters:

* files (object): An object, the keys of which are filenames (optionally including paths) to check for. The value is the format to parse the file as.

Returns: Parsed content of config file if found.

#### Example:

```javascript
const config = Config.loadConfig({ "config.json": "json", "config.yaml": "yaml"});
```


### `Config.loadConfigAsync(files)`

Checks if any of the files in the files object exist and attempts to load them in the corresponding format.


#### Parameters:

* files (object): An object, the keys of which are filenames (optionally including paths) to check for. The value is the format to parse the file as.

Returns: Promise: Parsed content of config file if found.

#### Example:

```javascript
const config = await Config.loadConfigAsync({ "config.json": "json", "config.yaml": "yaml"});
```

## Contributing

If you think there is another format that this module support, please do create a pull request

## License

This project is licensed under the MIT License.

## Acknowledgements

[typescript](https://www.npmjs.com/package/typescript)

Directly uses the following npm modules:
* [hjson](https://www.npmjs.com/package/hjson)
* [ini](https://www.npmjs.com/package/ini)
* [json5](https://www.npmjs.com/package/json5)
* [jsonc](https://www.npmjs.com/package/jsonc)
* [smol-toml](https://www.npmjs.com/package/smol-toml)
* [yaml](https://www.npmjs.com/package/yaml)
