import FS from 'node:fs';
import Path from 'path';
import { main, parse } from './index.js';
// console.log('\x1B[90msame\x1B[0m', diffObjects({ "hello": "world" }, { "hello": "world" }));
// console.log('\x1B[90mwrong key\x1B[0m', diffObjects({ "hello": "world" }, { "hola": "world" }));
// console.log('\x1B[90mwrong value(string)\x1B[0m', diffObjects({ "hello": "world" }, { "hello": "mundo" }));
// console.log('\x1B[90mwrong type (number)\x1B[0m', diffObjects({ "hello": "world" }, { "hello": 1 }));
// console.log('\x1B[90mwrong type (obj vs array)\x1B[0m', diffObjects({ "hello": {} }, { "hello": [] }));
// console.log('\x1B[90mmissing key (left)\x1B[0m', diffObjects({ "hello": "world" }, { "hello": "world", "hola": "mundo" }));
// console.log('\x1B[90mmissing key (right)\x1B[0m', diffObjects({ "hello": "world", "hola": "mundo" }, { "hello": "world" }));
for (const srcFile of FS.readdirSync('tests/', { withFileTypes: true })) {
    if (!srcFile.isFile()) {
        continue;
    }
    const originalPath = Path.join(`tests`, srcFile.name);
    const dirName = Path.join(`tests`, `${srcFile.name}.out`);
    FS.rmSync(dirName, { recursive: true, force: true });
    FS.mkdirSync(dirName);
    const origExt = Path.extname(srcFile.name);
    const copyFullPath = Path.join(`tests`, `${srcFile.name}.out`, `config${origExt}`);
    FS.copyFileSync(originalPath, copyFullPath);
    main(['a', 'b', copyFullPath]);
    const original = FS.readFileSync(originalPath, 'utf8');
    const parsedOriginal = parse(origExt.substring(1), original);
    for (const file of FS.readdirSync(dirName)) {
        if (file === `config${origExt}`) {
            continue;
        }
        const convertedFullPath = Path.join(dirName, file);
        const converted = FS.readFileSync(convertedFullPath, 'utf8');
        const convertedFormat = Path.extname(file).substring(1);
        const parsedConverted = parse(convertedFormat, converted);
        if (converted === original) {
            console.log(`\x1B[33m${srcFile.name}\x1B[0m -> \x1B[35m${convertedFormat} : \x1B[32mIDENTICAL\x1B[0m`);
        }
        else {
            const result = diffObjects(parsedOriginal, parsedConverted);
            if (!result) {
                console.log(`\x1B[33m${srcFile.name}\x1B[0m -> \x1B[35m${convertedFormat} : \x1B[33mSEMANTICALLY THE SAME\x1B[0m`);
            }
            else {
                console.log(`\x1B[33m${srcFile.name}\x1B[0m -> \x1B[35m${convertedFormat} : \x1B[31mERROR\x1B[0m`);
                console.log(result);
            }
        }
    }
}
function diffObjects(val1, val2, path = '') {
    if (val1 === val2) {
        return;
    }
    if (val1 === undefined) {
        return `${path}: missing on left side`;
    }
    if (val2 === undefined) {
        return `${path}: missing on right side`;
    }
    if (Array.isArray(val1) !== Array.isArray(val2)) {
        return `${path}: different types (${Array.isArray(val1) ? 'Array' : typeof val1} vs ${Array.isArray(val2) ? 'Array' : typeof val2})`;
    }
    if (typeof val1 !== typeof val2) {
        return `${path}: different types (${typeof val1} vs ${typeof val2})`;
    }
    if (Array.isArray(val1)) {
        for (let idx = 0; idx < Math.max(val1.length, val2.length); idx++) {
            const result = diffObjects(val1[idx], val2[idx], `${path}[${idx}]`);
            if (result) {
                return result;
            }
        }
    }
    else if (typeof val1 === 'object') {
        for (const key of new Set([...Object.keys(val1), ...Object.keys(val2)])) {
            const result = diffObjects(val1[key], val2[key], `${path}.${key}`);
            if (result) {
                return result;
            }
        }
    }
    else {
        return `${path}:: different values`;
    }
    return;
}
//# sourceMappingURL=testall.js.map