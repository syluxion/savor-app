import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

{
const firebaseConfig = {
  databaseURL: "https://savordatabase-default-rtdb.firebaseio.com"
};
const app = initializeApp(firebaseConfig);
const savorDB = getDatabase(app);

window.handleLogin = function() {
  window.location.href = "login.html";
};

window.submitLogin = function() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  if (!username || !password) {
    alert('Please enter both username and password.');
    return;
  }
  console.log ("Username:", username);
  console.log ("Password:", password);

  const passRef = ref(savorDB, `user/${username}/password`);

get(passRef)
    .then(snapshot => {
      if (snapshot.exists()) {
        const storedPassword = snapshot.val();
        console.log('Stored password for', username, ':', storedPassword);
        // compare with the typed password
        if (storedPassword === password) {
          console.log('Passwords match — login OK');
          window.location.href = "userDash.html";
        } else {
          console.log('Passwords do not match');
          alert('Incorrect password');
        }
      } else {
        console.log('No user found with username:', username);
        alert('No such user');
      }
    })
    .catch(err => {
      console.error('Error reading password:', err);
    });
  
} 

window.createLogin = function() {
  window.location.href = "createAccount.html";
}


//events
document.addEventListener('keydown', (event) => { 
    const currentPath = window.location.pathname;
    const currentFileName = currentPath.substring(currentPath.lastIndexOf('/') + 1);

    if (currentFileName === "login.html" && event.key === "Enter") {
        submitLogin();
    }
    else if(currentFileName === "index.html" && event.key === "Enter") {
        handleLogin();
      }});

}