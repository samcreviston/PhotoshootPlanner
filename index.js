// function to initialize Google map
let map;
let currentMarker;
let allMarkers = []; // Store all markers for photoshoot locations
let currentInfoWindow = null; // Track currently open info window

function initMap() {
  // Create the map
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 34.1, lng: -84.2 }, // Center on North Georgia area
    zoom: 10,
  });

  // Add initial markers for all photoshoot locations
  addInitialMarkers();

  // Attach event listeners to location list items
  const locationItems = document.querySelectorAll("#location-list li");
  locationItems.forEach(item => {
    item.addEventListener("click", () => {
      const lat = parseFloat(item.getAttribute("data-lat"));
      const lng = parseFloat(item.getAttribute("data-lng"));
      const position = { lat, lng };

      // Close any open info window
      if (currentInfoWindow) {
        currentInfoWindow.close();
      }

      // Remove previous highlight marker if exists
      if (currentMarker) {
        currentMarker.setMap(null);
      }

      // Add highlighted marker for selected location
      currentMarker = new google.maps.Marker({
        position,
        map,
        title: item.textContent,
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
          scaledSize: new google.maps.Size(40, 40)
        }
      });

      // Recenter map
      map.setCenter(position);
      map.setZoom(12);
    });
  });
}

// Function to determine marker color based on location type
function getMarkerColor(locationName) {
  const name = locationName.toLowerCase();
  
  if (name.includes('park') || name.includes('preserve') || name.includes('nature center')) {
    return 'green'; // Parks and nature areas
  } else if (name.includes('trail') || name.includes('greenway')) {
    return 'yellow'; // Trails and greenways
  } else {
    return 'blue'; // Everything else (city centers, islands, etc.)
  }
}

// Function to get unique info window content for each location
function getLocationInfo(locationName) {
  const locationDescriptions = {
    'Cumming City Center': 'Perfect urban backdrop with modern architecture and bustling city atmosphere.',
    'Sawnee Mountain Preserve': 'Natural mountain scenery with hiking trails and serene forest settings.',
    'Coal Mountain Park': 'Beautiful park with open spaces, perfect for outdoor portraits and family shoots.',
    'Vickery Creek Trail': 'Scenic creek-side trail with waterfalls and rustic bridges for nature photography.',
    'Lake Lanier Islands': 'Stunning lakeside views with beaches and water features for romantic shoots.',
    'Autrey Mill Nature Preserve & Heritage Center (Johns Creek)': 'Historic buildings and natural settings combine for unique vintage-style portraits.',
    'Newtown Park (Johns Creek / Alpharetta)': 'Well-maintained park with diverse landscapes and seasonal flower displays.',
    'Big Creek Greenway (Alpharetta / Roswell section)': 'Tree-lined pathway perfect for walking shots and natural light photography.',
    'Chattahoochee Nature Center (Roswell)': 'Wildlife preserve with boardwalks over wetlands and educational center backdrop.',
    'Rock Mill Park (Alpharetta)': 'Playground and recreational areas great for family photos and candid moments.',
    'North Park (Alpharetta)': 'Sports fields and pavilions offer structured backgrounds for team or group photos.',
    'Cogburn Road Park (Alpharetta)': 'Quiet neighborhood park with mature trees and peaceful walking paths.',
    'Cauley Creek Park (Johns Creek)': 'Creek-side park with natural rock formations and flowing water features.',
    'Big Creek Greenway — Mansell Rd access (Alpharetta)': 'Popular greenway section with bridge crossings and creek views.',
    'Big Creek Greenway — Webb Bridge Rd / YMCA area (Alpharetta)': 'Active recreation area combining natural greenway with modern facilities.',
    'Big Creek Park (Roswell, entry to Greenway)': 'Gateway park with wide open spaces and connection to extensive trail system.',
    'Shakerag Park (Johns Creek)': 'Community park with varied terrain and seasonal landscaping perfect for portraits.',
    'Webb Bridge Park (Alpharetta)': 'Lakefront park with walking trails and beautiful water views for engagement shoots.',
    'Union Hill / Forsyth-side Big Creek Greenway access (north end)': 'Northern access point with less crowded trails and natural creek settings.',
    'Sweetwater Creek State Park (Lithia Springs / west-of-Atlanta) — still reachable for a day trip': 'Historic mill ruins with cascading waterfalls create dramatic backdrops.',
    'Autrey Mill — Heritage buildings & historic farm structures (Johns Creek)': 'Authentic historical buildings and farm settings for vintage and rustic themed shoots.',
    'Chattahoochee River Greenway / nearby Chattahoochee-adjacent trails (near Roswell / Johns Creek)': 'Riverside trails with sandy beaches and rocky outcroppings along Georgia\'s famous river.',
    'Mixed residential-green belt areas along Big Creek / Vickery Creek (various access points in Alpharetta / Roswell)': 'Diverse locations combining suburban charm with natural creek-side beauty.'
  };
  
  return locationDescriptions[locationName] || 'Great photoshoot location with unique character and beautiful scenery.';
}

// Function to add initial markers for all photoshoot locations
function addInitialMarkers() {
  const locationItems = document.querySelectorAll("#location-list li");
  
  locationItems.forEach(item => {
    const lat = parseFloat(item.getAttribute("data-lat"));
    const lng = parseFloat(item.getAttribute("data-lng"));
    const position = { lat, lng };
    const locationName = item.textContent;
    const markerColor = getMarkerColor(locationName);
    
    // Create marker for each photoshoot location with appropriate color
    const marker = new google.maps.Marker({
      position,
      map,
      title: locationName,
      icon: {
        url: `http://maps.google.com/mapfiles/ms/icons/${markerColor}-dot.png`,
        scaledSize: new google.maps.Size(32, 32)
      }
    });
    
    // Add info window for each marker with unique content
    const infoWindow = new google.maps.InfoWindow({
      content: `<div style="max-width: 200px;"><strong>${locationName}</strong><br><br>${getLocationInfo(locationName)}</div>`
    });
    
    // Show info window on marker click
    marker.addListener('click', () => {
      // Close any currently open info window
      if (currentInfoWindow) {
        currentInfoWindow.close();
      }
      
      // Open this info window and track it
      infoWindow.open(map, marker);
      currentInfoWindow = infoWindow;
    });
    
    allMarkers.push(marker);
  });
}

// Expose initMap for Google Maps API callback
window.initMap = initMap;
