// utils.js
export function saveLinks(link, activeDotIndex, locationName, timeZone, id) {
  const localStorageLinks = JSON.parse(localStorage.getItem("links")) || [];
  console.log("Saving links:", link, activeDotIndex, locationName, timeZone, id);
  // Ensure the array has enough slots for the activeDotIndex
  while (localStorageLinks.length <= activeDotIndex) {
    localStorageLinks.push(null);
  }

  // Save the link at the correct index
  localStorageLinks[activeDotIndex] = { link, locationName, timeZone, id };
  console.log("Updated links array:", localStorageLinks);
  localStorage.setItem("links", JSON.stringify(localStorageLinks));
}
