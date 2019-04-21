const req = require('request-promise-native');
const git = require('simple-git');
const fs = require('fs');
const targetPath = __dirname + '/src/assets/stops.json';

const gitAddPromise = (...files) => {
    return new Promise((resolve, reject) => {
        git().add(files, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

req.post('https://kvg-kiel.de/internetservice/geoserviceDispatcher/services/stopinfo/stops?top=324000000&bottom=-324000000&left=-648000000&right=648000000')
    .then((resp) => {
        fs.writeFileSync(targetPath, resp);
        return true;
    }).then(() => {
        return gitAddPromise(targetPath);
    }).then(() => {
        console.log("stored successful");
    }).catch((err) => {
        console.error(err);
    })