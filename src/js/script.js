//Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set, get, } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { update } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";


{
  console.log("Script loaded");
//Consts and Vars

const firebaseConfig = {
  databaseURL: "https://savordatabase-default-rtdb.firebaseio.com"
};
const app = initializeApp(firebaseConfig);
const savorDB = getDatabase(app);
//Page Change Functions

window.accountPage = function(){ 
  window.location.href ="../html/user_acc.html";
}
window.createAcc = function() {
  window.location.href = "../html/create_acc.html";
}

window.forgotAcc = function(){
  window.location.href = "../html/forgot_acc.html";
}

window.handleLogin = function(){
  window.location.href = "../html/login.html";
}

//Send email function -Not Functional Yet
window.sendEmail = async function() {
  const username = localStorage.getItem("loggedInUser");
  if (!username) {
    alert("No logged in user!");
    return;
  }

  try {
    const snapshot = await get(ref(savorDB, `user/${username}/email`));

    if (!snapshot.exists()) {
      alert("User email not found!");
      return;
    }

    const email = snapshot.val();

  }catch (error) {
    console.error("Error fetching user email:", error);
    alert("Failed to fetch user email.");
    return;
  }
}

//Save Account Changes Function (1)
window.saveAccountChanges1 = function (event) {
  event.preventDefault(); // STOP form from reloading the page

  const email = document.getElementById('email').value.trim();
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const birthDate = document.getElementById('birthdate').value.trim(); // ID is birthdate

  const loggedUser = localStorage.getItem("loggedInUser");

  if (!loggedUser) {
    alert("No logged in user!");
    return;
  }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;
  if (!emailPattern.test(email)) {
    alert("Please enter a valid email.");
    return;
  }

  const userRef = ref(savorDB, `user/${loggedUser}`);

  update(userRef, {
    email,
    firstName,
    lastName,
    birthDate   // correct property name
  })
    .then(() => alert("Account updated successfully!"))
    .catch(err => {
      console.error(err);
      alert("Error saving account.");
    });
};
//Updates password
window.updatePass = function(event) {
  event.preventDefault();
  const loggedUser = localStorage.getItem("loggedInUser");
  const currentPassword = document.getElementById('currentPassword').value.trim();
  const newPassword = document.getElementById('newPassword').value.trim();
  const confirmPassword = document.getElementById('confirmPassword').value.trim();
  const passRef = ref(savorDB, `user/${loggedUser}/password`);

  if (newPassword!==confirmPassword) {
        alert("Passwords do not match. Please re-enter them.");
        return;
      }
  else{
    
    set(passRef, newPassword)
    .then(() => {
      alert("Password updated successfully!");
    })
    .catch(err => {
      console.error("Error updating password:", err);
      alert("Failed to update password.");
    });
  }
}
//Searches Restaurants needs to be worked /////////////////////////////////////////////////
window.searchRestaurants = function () {
  const query = document.getElementById("searchInput").value.trim();

  if (query) {
    
    window.location.href = `map.html?query=${encodeURIComponent(query)}`;
  } else {
    
    window.location.href = "map.html";
  }
};





//Login Function for Login Button 
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

  //Fetch stored password from DB to compare with typed password
  get(passRef)
      .then(snapshot => {
        if (snapshot.exists()) {
          const storedPassword = snapshot.val();
          console.log('Stored password for', username, ':', storedPassword);
          // compare with the typed password
          if (storedPassword === password) {
            console.log('Passwords match — login OK');
            localStorage.setItem("loggedInUser", username);
            window.location.href = "../html/index2.html";
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

//create account page script from gabriel 
window.createAccount = function () {
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();
      const confirmPassword = document.getElementById('confirmPassword').value.trim();
      const accountType = document.getElementById('accountType').value;
      const email = document.getElementById('email').value.trim();
      const firstName = document.getElementById('firstName').value.trim();
      const lastName = document.getElementById('lastName').value.trim();
      const birthDate = document.getElementById('birthDate').value.trim();

      
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;
      if (!emailPattern.test(email)) {
        alert("Please enter a valid email address (e.g., johndoe1234@gmail.com).");
        return;
      }

      
      if (password !== confirmPassword) {
        alert("Passwords do not match. Please re-enter them.");
        return;
      }

      if (!accountType) {
        alert("Please select an account type.");
        return;
      }

      //My Section 

      const userRef = ref(savorDB, `user/${username}`);

  set(userRef, { password, email, accountType, firstName, lastName, birthDate })
  .then(() => {
    alert(`User "${username}" created successfully!`);

    if (accountType === "user") {
      window.location.href = "../html/index2.html";
    } else {
      window.location.href = "../html/business_DB.html";
    }
  })
  .catch(err => {
    console.error("Error creating user:", err);
    alert("Failed to create user.");
  });

      
    }


//events
document.addEventListener('keydown', (event) => { 
    const currentPath = window.location.pathname;
    const currentFileName = currentPath.substring(currentPath.lastIndexOf('/') + 1);

    if (currentFileName === "login.html" && event.key === "Enter") {
        submitLogin();
    }
    else if(currentFileName === "index.html" && event.key === "Enter") {
        searchRestaurants();
    }
    else if(currentFileName === "create_acc.html" && event.key === "Enter") {
        createAccount();
    }
    else if(currentFileName === "index2.html" && event.key === "Enter") {
      //Need next function for index2.html
    }
    
    });


// --- Settings page: tab switching ---

document.addEventListener('DOMContentLoaded', () => {
  // Only run on pages that have the settings layout
  const nav = document.querySelector('.settings-nav');
  const content = document.querySelector('.settings-content');
  if (!nav || !content) return;

  const tabs = Array.from(nav.querySelectorAll('[role="tab"]'));
  const panels = Array.from(document.querySelectorAll('.panel'));

  // Helper: show the panel controlled by a tab
  function showPanel(tabEl) {
    // Update tab states
    tabs.forEach(btn => {
      const isActive = btn === tabEl;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
      btn.setAttribute('tabindex', isActive ? '0' : '-1');
      // Ensure nav buttons never submit forms
      if (!btn.getAttribute('type')) btn.setAttribute('type', 'button');
    });

    // Hide all panels
    panels.forEach(panel => {
      panel.hidden = true;
      panel.classList.remove('is-visible');
    });

    // Show target panel
    const targetId = tabEl.getAttribute('aria-controls');
    const target = document.getElementById(targetId);
    if (target) {
      target.hidden = false;
      target.classList.add('is-visible');

      // Move focus to first heading for accessibility
      const heading = target.querySelector('h1, h2, h3, h4, [role="heading"]');
      if (heading) {
        // Make sure it can receive focus momentarily
        if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
        heading.focus();
      }
    }
  }

  // Wire click + keyboard navigation
  tabs.forEach((btn, index) => {
    btn.addEventListener('click', () => showPanel(btn));

    btn.addEventListener('keydown', e => {
      const prevKeys = ['ArrowUp', 'ArrowLeft'];
      const nextKeys = ['ArrowDown', 'ArrowRight'];

      if (prevKeys.includes(e.key)) {
        e.preventDefault();
        const prev = tabs[(index - 1 + tabs.length) % tabs.length];
        prev.focus();
        showPanel(prev);
      } else if (nextKeys.includes(e.key)) {
        e.preventDefault();
        const next = tabs[(index + 1) % tabs.length];
        next.focus();
        showPanel(next);
      }
    });
  });

  // Initialize: use the one marked .is-active, or fall back to the first
  const initial = tabs.find(t => t.classList.contains('is-active')) || tabs[0];
  if (initial) showPanel(initial);
});
}
//Needs to be put at the top of code on each page that requires user to be logged in, the if statement can be used
//kick people to login page if not logged in.
/*
const user = localStorage.getItem("loggedInUser"); <-- Get logged in user from local storage

if (!user) {
  window.location.href = "../html/login.html"; // or your login page
}
*/
