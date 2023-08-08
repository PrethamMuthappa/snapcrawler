#!/usr/bin/env node

const readline = require('readline');
const puppeteer = require('puppeteer-core');
const fs = require('fs').promises;
const axios = require('axios');
const path = require('path');

(async () => {
  const pageing = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  console.log("WELCOME TO SNAP CRAWLER , A SCRAPPER USED TO EXTRACT IMAGES FROM A WEBPAGE AND DOWNLOAD IT \n")
  pageing.question('Enter the base URL part(THIS IS THE MAIN URL OF THE WEBSITE) : ', async (baseUrlInput) => {
    pageing.question('Enter the URL of your page(ENTER THE URL OF THE WEB PAGE WHICH U WANT TO SCRAPE) : ', async (userInput) => {
      pageing.close();

      const browser = await puppeteer.launch({
        headless: false,
        executablePath: 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
        ignoreDefaultArgs: ['--disable-extensions'],
      });

      const startTime = performance.now();

      const page = await browser.newPage();
      await page.goto(userInput);

      let aa = await page.$$('img[src]');
      let arr = [];

      for (let i of aa) {
        let evawl = await page.evaluate((el) => el.getAttribute('src'), i);
        arr.push(evawl);
        console.log(evawl);
      }

    

      
      const downloadsFolderPath = path.join('C:', 'Users', process.env.USERNAME, 'Downloads'); // Change this to the appropriate path if needed

      const folderName = 'ImageScraperDownloads';
      const folderpath = path.join(downloadsFolderPath, folderName);

      try {
        await fs.mkdir(folderpath);
      } catch (err) {
        if (err.code !== 'EEXIST') {
          throw err;
        }
      }

      for (let imageUrl of arr) {
        try {
          const response = await axios.get(baseUrlInput + imageUrl, { responseType: 'arraybuffer' });
          const imageBuffer = Buffer.from(response.data, 'binary');
          const imageName = imageUrl.split('/').pop();
          const imagePath = path.join(folderpath, imageName);
          await fs.writeFile(imagePath, imageBuffer);
          console.log(`Downloaded: ${imageUrl}`);
        } catch (err) {
          console.error(`Error downloading ${imageUrl}: ${err.message}`);
        }
      }

       await browser.close();
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      Math.floor(executionTime);
      console.log(`Execution time: ${executionTime} milliseconds`);
      console.log("IMAGES HAVE BEEN DOWNLOADED IN THE DOWNLOADS FOLDER C:DRIVE ")
    });
  });
})();
