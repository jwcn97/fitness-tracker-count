import FS from 'fs';

export function retrieve() {
    if (!FS.existsSync('./file.json')) {
        return {};
    }
    const jsonData = require('../../file.json');
    return jsonData;
}

export function writeToFile(data) {
    FS.promises.writeFile('./file.json', JSON.stringify(data, null, 2));
}
