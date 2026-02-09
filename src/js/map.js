console.log("map.js loaded");

const map = L.map("map").setView([34.241461, -118.529286], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

let markers = [];
let restaurantData = [];
let routingControl = null;
let userLocation = null;

const restaurantsUrl = "../data/restaurants.json";

function formatRatingStars(rating) {
  const rounded = Math.round(rating);
  return "★".repeat(rounded) + "☆".repeat(5 - rounded);
}

async function fetchAddress(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          "User-Agent": "S4VOR-Student-Project"
        }
      }
    );
    const data = await res.json();
    return data.display_name || "Address not available";
  } catch (err) {
    console.error("Address lookup failed", err);
    return "Address not available";
  }
}


async function loadRestaurants() {
  const res = await fetch(restaurantsUrl);
  restaurantData = await res.json();
  populateSidebar(restaurantData);
  addRestaurantsToMap(restaurantData);
}
loadRestaurants();

navigator.geolocation?.getCurrentPosition(
  pos => userLocation = [pos.coords.latitude, pos.coords.longitude],
  () => userLocation = [34.241461, -118.529286]
);

function addRestaurantsToMap(restaurants) {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  const icon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });

  restaurants.forEach(r => {
    const marker = L.marker([r.lat, r.lng], { icon }).addTo(map);
    marker.bindPopup(`<b style="color:#0a5a2e">${r.name}</b>`);

    marker.on("click", () => {
      updateInfoBox(r);
      startRouting(r);
    });

    markers.push(marker);
  });
}

function startRouting(r) {
  if (!userLocation) return;

  routingControl && map.removeControl(routingControl);

  routingControl = L.Routing.control({
    waypoints: [
      L.latLng(userLocation),
      L.latLng(r.lat, r.lng)
    ],
    addWaypoints: false,
    draggableWaypoints: false
  }).addTo(map);
}

function populateSidebar(restaurants) {
  const list = document.getElementById("restaurantList");
  list.innerHTML = "";

  restaurants.forEach(r => {
    const li = document.createElement("li");
    li.textContent = r.name;

    li.onclick = () => {
      map.setView([r.lat, r.lng], 15);
      updateInfoBox(r);
      startRouting(r);
    };

    list.appendChild(li);
  });
}

function updateInfoBox(r) {
  document.getElementById("restaurant-info-box").style.display = "block";

  document.getElementById("info-img").src =
    r.image || "https://picsum.photos/400/300";

  document.getElementById("info-name").innerText = r.name;

  document.getElementById("info-rating").innerText =
    `${formatRatingStars(r.rating)} (${r.rating.toFixed(1)})`;

  document.getElementById("info-hours").innerText =
    r.hours || "10:00 AM – 10:00 PM";

  // show loading state
  const addressEl = document.getElementById("info-address");
  addressEl.innerText = "Loading address…";

  // fetch real address from coordinates
  fetchAddress(r.lat, r.lng).then(address => {
    addressEl.innerText = address;
  });

  document.getElementById("order-btn").onclick = () => {
    alert(`Ordering from ${r.name}`);
  };
}


/* SEARCH */
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

function filter(query) {
  const q = query.toLowerCase();
  const filtered = restaurantData.filter(r =>
    r.name.toLowerCase().includes(q)
  );
  populateSidebar(filtered);
  addRestaurantsToMap(filtered);
}

searchInput.oninput = e => filter(e.target.value);
searchBtn.onclick = () => filter(searchInput.value);
