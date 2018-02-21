const inquirer = require('inquirer');

module.exports = {

  askProjectFolder: () => {
    const questions = [
      {
        type: 'input',
        name: 'folder',
        message: "Enter Folder Name for Project:"
      }
    ];
    return inquirer.prompt(questions);
  },
  askRemoveFolders: () => {
    const questions = [
      {
        type: 'confirm',
        name: 'deleteFolders',
        message: 'Delete current folders?:',
        default: true
      }
    ];
    return inquirer.prompt(questions);
  },
  askProjectUrl: () => {
    const questions = [
      {
        type: 'input',
        name: 'url',
        message: "Enter Project Url:"
      }
    ];
    return inquirer.prompt(questions);
  },
  askProjectLinks: () => {
    const questions = [
      {
        type: 'confirm',
        name: 'automatic',
        message: 'Get urls from domain? (else set manualy):',
        default: true
      }
    ];
    return inquirer.prompt(questions);
  },
  askOpenLinkFile: () => {
    const questions = [
      {
        type: 'confirm',
        name: 'open',
        message: 'Open links.json file?:',
        default: true
      }
    ];
    return inquirer.prompt(questions);
  },
  askFinishedEditFile: () => {
    const questions = [
      {
        type: 'confirm',
        name: 'finished',
        message: 'Finished with edit links.json file?:',
        default: true
      }
    ];
    return inquirer.prompt(questions);
  },
  askTakeScreenshotsA: () => {
    const questions = [
      {
        type: 'confirm',
        name: 'takeScreenshotsA',
        message: 'Take screenshots for Test Case A:',
        default: true
      }
    ];
    return inquirer.prompt(questions);
  },
  askTakeScreenshotsB: () => {
    const questions = [
      {
        type: 'confirm',
        name: 'takeScreenshotsB',
        message: 'Take screenshots for Test Case B:',
        default: true
      }
    ];
    return inquirer.prompt(questions);
  },
   askOpenCompareFolder: () => {
    const questions = [
      {
        type: 'confirm',
        name: 'open',
        message: 'Open compare folder?:',
        default: true
      }
    ];
    return inquirer.prompt(questions);
  },
  askArchive: () => {
    const questions = [
      {
        type: 'confirm',
        name: 'archive',
        message: 'Archive Compare?:',
        default: true
      }
    ];
    return inquirer.prompt(questions);
  }

}
