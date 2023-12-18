// utils.js
export function saveLinks(link, activeDotIndex, locationName, timeZone, id) {
  const localStorageLinks = JSON.parse(localStorage.getItem("links")) || [];

  // Ensure the array has enough slots for the activeDotIndex
  while (localStorageLinks.length <= activeDotIndex) {
    localStorageLinks.push(null);
  }

  // Save the link at the correct index
  console.log(activeDotIndex);
  localStorageLinks[activeDotIndex] = { link, locationName, timeZone, id };

  localStorage.setItem("links", JSON.stringify(localStorageLinks));
}

