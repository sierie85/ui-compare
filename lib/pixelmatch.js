const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

module.exports = {
  compareScreenshots: (folder, fileName) => {
    return new Promise((resolve, reject) => {

      let filesRead = 0;

      const img1 = fs.createReadStream(`projects/${folder}/A/${fileName}.png`).pipe(new PNG()).on('parsed', doneReading);

      const img2 = fs.createReadStream(`projects/${folder}/B/${fileName}.png`).pipe(new PNG()).on('parsed', doneReading);

      const file = fileName;
      const dir = folder;

      function doneReading() {
        if (++filesRead < 2) return;

        const diff = new PNG({width: img1.width, height: img2.height});
        const numDiffPixels = pixelmatch(
          img1.data,
          img2.data,
          diff.data,
          img1.width,
          img1.height,
          {threshold: 0.1}
        );

        if(numDiffPixels !== 0) {
          console.log(`diff in ${file} found!`);
          diff.pack().pipe(fs.createWriteStream(`projects/${dir}/C/${file}.png`));
        }

        resolve();
      }

    });
  }
}
