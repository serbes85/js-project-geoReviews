export function getParentByClass(child, parentClass) {
  let parent = child;
  do {
    if (parent.classList.contains(parentClass)) {
      console.log("getParentByClass", parent);
      return parent;
    }
  } while (parent = parent.parentElement);
  return null;
}

export function getParentById(child, idElem) {
  let parent = child;
  while (parent = parent.parentElement) {
    if (parent.id === idElem) {
      console.log("getParentById", parent);
      return parent;
    }
  }
  return null;
}
