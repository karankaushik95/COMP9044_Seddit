/**
 * Written by A. Hinds with Z. Afzal 2018 for UNSW CSE.
 * 
 * Updated 2019.
 */

import initializeUI from './init.js';
import loginBtnListener from './loginBtn.js'
import signupBtnListener from './signupBtn.js';
import initializePosts from './initPosts.js';

// your app must take an apiUrl as an argument --
// this will allow us to verify your apps behaviour with 
// different datasets.
function initApp(apiUrl) {
  // your app initialisation goes here
  initializeUI();
  loginBtnListener(apiUrl);
  signupBtnListener(apiUrl);
  initializePosts(apiUrl);
}

export default initApp;
