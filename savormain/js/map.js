import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";


const firebaseConfig = {
  databaseURL: "https://savordatabase-default-rtdb.firebaseio.com"
};
const app = initializeApp(firebaseConfig);
const savorDB = getDatabase(app);
const restRef = ref(savorDB, 'rest');

console.log("map.js loaded");

//map used in and when location fails it automatically uses jacaranda hall as the center of location
// since we wont be anywhere else otherwise
const map = L.map("map").setView([34.241461, -118.529286], 15); 

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);


let markers = [];
let restaurantData = [];
let routingControl = null;
let userLocation = null; // store user's location


function getQueryFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("query")?.toLowerCase() || "";
}

const initialQuery = getQueryFromURL();

//Creates restaurant data array from database
async function configureArray()
{
  try{
    const snapshot = await get(restRef);
    if(!snapshot.exists()){
      console.log("No data available");
      return;
    }
    snapshot.forEach(child => {
      const data = child.val();
      restaurantData.push({
      name: child.key,
      type: data.type,
      menu: data.menu,
      price: data.price,
      lat: data.lat,
      lng: data.lng,
  });
});
    console.log(restaurantData);
    return restaurantData;
  }catch(error){
    console.error("Error fetching data:", error);
    return [];
  }
}

//Uses restsaurant data to add markers and populate sidebar
async function loadRestaurants() { 


  await configureArray();

  
  let filteredData = restaurantData;
  if (initialQuery) {
    filteredData = restaurantData.filter(r =>
      r.name.toLowerCase().includes(initialQuery) ||
      r.type.toLowerCase().includes(initialQuery)
    );

    
    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.value = initialQuery;
  }

  addRestaurantsToMap(filteredData);
  populateSidebar(filteredData);
}

loadRestaurants();

//Gets user initial location
function initUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = [position.coords.latitude, position.coords.longitude];
      },
      (err) => {
        console.warn("Geolocation permission denied or unavailable. Using fallback location.");
        userLocation = [34.241461, -118.529286]; // Jacaranda Hall fallback
      }
    );
  } else {
    console.warn("Geolocation not supported. Using fallback location.");
    userLocation = [34.241461, -118.529286]; // Jacaranda Hall fallback
  }
}

initUserLocation();

//Adds markers to the map for each restaurant 
function addRestaurantsToMap(restaurants) {
  markers.forEach((m) => map.removeLayer(m));
  markers = [];

  const darkGreenIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -35],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    shadowSize: [41, 41]
  });

  restaurants.forEach((r) => {
    const marker = L.marker([r.lat, r.lng], { icon: darkGreenIcon }).addTo(map);
  
    const popupContent = document.createElement("div");
    popupContent.innerHTML = `<b>${r.name}</b>`; 
    popupContent.style.background = "#b7f2b0";
    popupContent.style.padding = "8px 15px";
    popupContent.style.borderRadius = "12px";
    popupContent.style.cursor = "pointer";
    popupContent.style.fontWeight = "bold";
    popupContent.style.color = "#0a5a2e";
    popupContent.style.textAlign = "center";
  
    popupContent.onclick = () => startRouting(r);
  
    marker.bindPopup(popupContent);
    markers.push(marker);
  });
  
}

//Shows routes from the current location
function startRouting(r) {
  if (!userLocation) {
    console.error("User location not set yet. Try again in a moment.");
    return;
  }

  if (routingControl) {
    map.removeControl(routingControl);
  }

  routingControl = L.Routing.control({
    waypoints: [L.latLng(userLocation[0], userLocation[1]), L.latLng(r.lat, r.lng)],
    routeWhileDragging: false,
    draggableWaypoints: false,
    addWaypoints: false,
    collapsible: true
  }).addTo(map);

  const routingEl = document.querySelector(".leaflet-routing-container");
  if (routingEl) {
    routingEl.style.top = "80px";
    routingEl.style.right = "20px";
    routingEl.style.left = "auto";
    routingEl.style.borderRadius = "20px";
    routingEl.style.boxShadow = "0px 8px 25px rgba(0,0,0,0.25)";
    routingEl.style.background = "rgba(255,255,255,0.95)";
    routingEl.style.width = "280px";
  }
}

//Generates Options in Sidebar 
function populateSidebar(restaurants) {
  const list = document.getElementById("restaurantList");
  list.innerHTML = "";

  restaurants.forEach((r) => {
    const li = document.createElement("li");
    li.textContent = r.name;
    li.style.background = "#d6f7d6";
    li.style.padding = "10px";
    li.style.borderRadius = "12px";
    li.style.marginBottom = "8px";
    li.style.cursor = "pointer";
    li.style.fontWeight = "bold";
    li.style.color = "#0a5a2e";
    li.style.transition = "0.2s";

    li.onclick = () => {
      map.setView([r.lat, r.lng], 15);
      const marker = markers.find((m) => {
        const pos = m.getLatLng();
        return pos.lat === r.lat && pos.lng === r.lng;
      });

      if (marker) {
        marker.openPopup();
        startRouting(r);
      }
    };

    li.onmouseover = () => {
      li.style.transform = "scale(1.02)";
      li.style.background = "#b7f2b0";
    };
    li.onmouseout = () => {
      li.style.transform = "scale(1)";
      li.style.background = "#d6f7d6";
    };

    list.appendChild(li);
  });
}


const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();

  const filtered = query === "" 
    ? restaurantData 
    : restaurantData.filter(r => r.name.toLowerCase().includes(query) || r.type.toLowerCase().includes(query));

  populateSidebar(filtered);
  addRestaurantsToMap(filtered);
});

//login button sends you to vcreate account or login
document.querySelector(".login-btn").onclick = () => {
  window.location.href = "login.html";
};
