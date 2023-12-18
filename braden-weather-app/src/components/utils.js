// utils.js
export function saveLinks(link, activeDotIndex) {
  const localStorageLinks = JSON.parse(localStorage.getItem("links")) || [];

  // Ensure the array has enough slots for the activeDotIndex
  while (localStorageLinks.length <= activeDotIndex) {
    localStorageLinks.push(null);
  }

  // Save the link at the correct index
  console.log(activeDotIndex);
  localStorageLinks[activeDotIndex] = link;

  localStorage.setItem("links", JSON.stringify(localStorageLinks));
}
