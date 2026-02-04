// pickup-map.js
const map = L.map("pickup-map", {
  zoomControl: false,        // optional: cleaner small map
  attributionControl: false  // optional
}).setView([34.241461, -118.529286], 14);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

// Example: restaurant location (replace with real order restaurant coords)
const restaurantLatLng = [34.241461, -118.529286];
L.marker(restaurantLatLng).addTo(map).bindPopup("Pickup location");

// Optional: route from user to restaurant (if user allows geolocation)
navigator.geolocation?.getCurrentPosition(
  (pos) => {
    const userLatLng = [pos.coords.latitude, pos.coords.longitude];

    L.Routing.control({
      waypoints: [L.latLng(userLatLng), L.latLng(restaurantLatLng)],
      addWaypoints: false,
      draggableWaypoints: false,
      show: false,
      createMarker: () => null, // optional: no extra markers
    }).addTo(map);

    // Fit route nicely in small map
    const bounds = L.latLngBounds([userLatLng, restaurantLatLng]);
    map.fitBounds(bounds, { padding: [20, 20] });
  },
  () => {
    // If user blocks location, just show restaurant
    map.setView(restaurantLatLng, 15);
  }
);
