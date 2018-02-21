const fs = require('fs-extra');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const CLI = require('clui');
const Spinner = CLI.Spinner;
const helpers = require('./lib/helpers');
const inquirer = require('./lib/inquirer');
const puppeteer = require('./lib/puppeteer');
const fileHandler = require('./lib/filehandler');
const pixelmatch = require('./lib/pixelmatch');

const app = async () => {

  clear();
  console.log(
    chalk.blue(
      figlet.textSync('UI-COMPARE', { horizontalLayout: 'full' })
    )
  );

  // create project folders
  const projectName = await inquirer.askProjectFolder();

  if(!fs.existsSync(`projects/${projectName.folder}`)){
    fileHandler.createFolder(projectName.folder);
    fileHandler.createTestFolders(projectName.folder);
  } else {
    const removeFolders = await inquirer.askRemoveFolders();
    if(removeFolders.deleteFolders) {
      fileHandler.deleteTestFolders(projectName.folder);
      fileHandler.createTestFolders(projectName.folder);
    }
  }

  // set urls
  const projectUrl = await inquirer.askProjectUrl();
  // check if urlList file already exists
  if(fs.existsSync(`projects/${projectName.folder}/links.json`)){
    console.log(chalk.black.bgGreen.bold('links.json file exists'));
  } else {

    const projectLinks = await inquirer.askProjectLinks();

    if(projectLinks.automatic) {

      const statusGetUrls = new Spinner('geting urls...');
      statusGetUrls.start();
      const urls = await puppeteer.getUrls(projectUrl.url);
      statusGetUrls.stop();

      fileHandler.saveJson(projectName.folder, {urls});
      console.log(chalk.black.bgGreen.bold("Url File has been created"));

    } else {

      fileHandler.saveJson(projectName.folder, {urlList: [projectUrl.url]});
      console.log(chalk.black.bgGreen.bold("Url File has been created"));

    }

  }

  // ask open file for edit
  const openFile = await inquirer.askOpenLinkFile();
  if(openFile.open) {
    fileHandler.openFile(`projects/${projectName.folder}/links.json`);
    await inquirer.askFinishedEditFile();
  }

  // read links.json file
  const linksJson = fs.readFileSync(`projects/${projectName.folder}/links.json`);
  const jsonContent = JSON.parse(linksJson);
  const urlList = jsonContent.urls;

  // doesnt feel right here...
  const takeScreenshotsForTestCase = async (urls, folder, testcase) => {
    for(const url of urls){
      await puppeteer.makeScreenshot(url, folder, testcase);
    };
  }

  // ask for take initial screenshots ( testcase A )
  const screenshotsA = await inquirer.askTakeScreenshotsA();

  if(!screenshotsA.takeScreenshotsA) {
    console.log('No screenshots for testcase A taken.');
  } else {
    // make initial screenshots ( testcase A )
    const statusTakeScreenA = new Spinner('Taking screenshots for test case A...');
    statusTakeScreenA.start();
    await takeScreenshotsForTestCase(urlList, projectName.folder, 'A');
    statusTakeScreenA.stop();
    console.log(chalk.black.bgGreen.bold('screenshots for testcase A taken'));
  }

  // Ask for take compare Screenshots ( Testcase B )
  const screenshotsB = await inquirer.askTakeScreenshotsB();
  if(!screenshotsB.takeScreenshotsB) {
    console.log('No screenshots for testcase B taken.');
    console.log('exit');
    return;
  }

  // make Initial Screenshots ( Testcase B )
  const statusTakeScreenB = new Spinner('Taking screenshots for testcase B...');
  statusTakeScreenB.start();
  await takeScreenshotsForTestCase(urlList, projectName.folder, 'B');
  statusTakeScreenB.stop();
  console.log(chalk.black.bgGreen.bold('screenshots for testcase B taken'));

  // Compare Screenshots ( run tests )
  const statusCompare = new Spinner('Comparing - A vs B...');
  statusCompare.start();
  const comparing = async (folder, urls) => {
    for(const url of urls){
      const filename = helpers.prettyFileName(url);
      await pixelmatch.compareScreenshots(folder, filename);
    };
  }
  await comparing(projectName.folder, urlList);
  statusCompare.stop();
  console.log(chalk.black.bgGreen.bold('ui compare finished'));

  // open dir
  const compareFolder = await inquirer.askOpenCompareFolder();
  if(compareFolder.open) {
    fileHandler.openDir(`projects\\${projectName.folder}\\C`);
  }

  // make archiv for test
  const archiveTest = await inquirer.askArchive();
  if(archiveTest.archive) {
    fileHandler.archiveTestCase(`projects/${projectName.folder}`);
  }

}

app();
