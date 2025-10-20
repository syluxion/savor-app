# README
Savor Anti-Food waste application for Comp490 senior project at Csun

# How to set up local environment
This might get more complicated as time goes on, but currently you need to be familiar with html, css, js, node, and firebase

#Tools for editing
#What is HTML, CSS, JS?

HTML stands for Hyptertext Markup Language is can be refered to as the skeleton or strucutre of the web page.

CSS stands for Cascading Style Sheets this language controls the appearance such as colors, fonts, spacing, and layout.

Js is Javascript and it is used to control the behavior of the web application. These are interactions such as what clicking does, scrolling ect..

All three work together to make a web application. Download test file and run the html file on the web browser. This an example of all three working together. 
The goal is to have some base established so we can start adding components and features. 

#Server Environment using Node.js and Firebase
1. Make sure you have [Node](https://nodejs.org/en/download/releases/) installed. If you have other versions of Node on your system I'd recommend installing Node Version Manager (NVM)
2. Once you have Node installed, (you might need to restart your computer), you should clone the `staging` branch. You can either install Git (terminal usage), GitHub Desktop (GUI), or use built in Git functions in your IDE (VSCode, or Jetbrains).
3. Once the repository is cloned, open the project in your IDE, and open a terminal window to run: `npm install`. This will install all of the needed packages to run the frontend locally. Note: as we add new features we might have new dependincies, so re-running `npm install` might be necessary.
4. You need to download, and install the [Firebase CLI](https://firebase.google.com/docs/cli).
5. Once Firebase CLI is installed authenticate yourself using `firebase login`.
4. From the same terminal run: `npm start`, this should start up the frontend, and the local emulator of firestore.
5. Success!

# Important
Before you make any code changes, MAKE A NEW BRANCH! This is to ensure we do not overwrite code that may be important, accidentally. You will make a new, different branch for every task assigned to you, and once you are finished with the task you will submit a Pull Request (PR). 

Please do not work on, or push to the master branch, and when you make a PR for your branch, please assign me as a reviewer. All of our work will be done to the staging branch before merging to master. This is so I can run your code on my computer to double check everything works, and does not conflict with any existing code.

# Notes
1. By default the frontend loads on `localhost:3000`
2. When running locally, firebase will set up an emulator run firestore so that it doesn't interfere with our production data. You can view the UI on `localhost:4000`

# Useful Commands
`net stop winnat`
`net start winnat`
