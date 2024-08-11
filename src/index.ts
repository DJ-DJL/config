import FS from 'node:fs';
import Path from 'path';
import JSONC from 'jsonc'
import JSON5 from 'json5'
import HJSON from 'hjson';
import TOML from 'smol-toml'; // cspell: disable-line
import YAML from 'yaml';
import INI from 'ini';

if (import.meta.url === `file://${process.argv[1]}`) {
    process.exit(main(process.argv));
}

export function main(argv: string[]) {
    if (argv.length < 3) {
        console.log(`Usage: ${argv[1]} <srcFile> [...<srcFile>]
<srcFile> : source config file

Each <srcFile> will be parsed and then the same config will be written in all supported formats.
\x1B[33m Warning \x1B[0m, existing files will be overwritten

Supported formats: json, jsonc, json5, hjson, toml, yaml, ini
N.B. to be parsed correctly one of the above file extensions must be used!`);
    }
    for (const srcFile of argv.slice(2)) {
        if (!FS.existsSync(srcFile)) {
            console.error(`${srcFile} does not exist.`);
            return 1;
        }

        const configContent = FS.readFileSync(srcFile, 'utf8');
        const format = Path.extname(srcFile).toLowerCase().slice(1);
        const parsedConfig = parse(format, configContent);
        const basename = Path.join(Path.dirname(srcFile), Path.basename(srcFile));
        console.log(`Parsed ${format} successfully`);
        console.log('write json'); FS.writeFileSync(`${basename}.json`, JSON.stringify(parsedConfig, undefined, 4));
        console.log('write jsonc'); FS.writeFileSync(`${basename}.jsonc`, JSONC.jsonc.stringify(parsedConfig, undefined, 4));
        console.log('write json5'); FS.writeFileSync(`${basename}.json5`, JSON5.stringify(parsedConfig, undefined, 4));
        console.log('write hjson'); FS.writeFileSync(`${basename}.hjson`, HJSON.stringify(parsedConfig, { space: 4 }));
        console.log('write yaml'); FS.writeFileSync(`${basename}.yaml`, YAML.stringify(parsedConfig));
        console.log('write ini'); FS.writeFileSync(`${basename}.ini`, INI.stringify(parsedConfig));
        if (Array.isArray(parsedConfig)) {
            console.log(`\x1B[31mtoml doesn't support top-level arrays\x1B[0m`);
        } else {
            console.log('write toml'); FS.writeFileSync(`${basename}.toml`, TOML.stringify(parsedConfig));
        }
    }
    return 0;
}

export default function parse(format: string, configContent: string): any {
    switch (format) {
        case 'json':
            return JSON.parse(configContent);
        case 'jsonc':
            return JSONC.jsonc.parse(configContent);
        case 'json5':
            return JSON5.parse(configContent);
        case 'hjson':
            return HJSON.parse(configContent);
        case 'toml':
            return TOML.parse(configContent);
        case 'yaml':
            return YAML.parse(configContent);
        case 'ini':
            return INI.parse(configContent);
        default:
            throw new Error(`Unsupported format ${format}`);
    }
}
