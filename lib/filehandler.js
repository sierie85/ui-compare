const fs = require('fs-extra');
const util = require('util');
const exec = require('child_process').exec;
const zipFolder = require('zip-folder');

function getCommandLine() {
   switch (process.platform) {
      case 'darwin' : return 'open';
      case 'win32' : return 'start';
      case 'win64' : return 'start';
      default : return 'xdg-open';
   }
}

module.exports = {
  openFile: (file) => exec(getCommandLine() + ' ' + file),
  openDir: (dir) => exec(getCommandLine() + " " + dir),
  saveJson: (folder, data) => {
    fs.writeFileSync(
      `projects/${folder}/links.json`,
      JSON.stringify(data, null, 4),
      (err) => {
        if (err) {
          console.error(err, 'Unable to write json file');
          return;
        };
      }
    );
  },
  createFolder: (name) => fs.mkdirSync(`projects/${name}`),
  createTestFolders: (projectName) => {
    fs.mkdirSync(`projects/${projectName}/A`);
    fs.mkdirSync(`projects/${projectName}/B`);
    fs.mkdirSync(`projects/${projectName}/C`);
  },
  deleteTestFolders: (projectName) => {
    fs.removeSync(`projects/${projectName}/A`);
    fs.removeSync(`projects/${projectName}/B`);
    fs.removeSync(`projects/${projectName}/C`);
  },
  archiveTestCase: (dir) => {
    zipFolder(
      dir,
      `${dir}/${Date.now()}.zip`,
      function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log('ziped!');
        }
      }
    )
  }
}
