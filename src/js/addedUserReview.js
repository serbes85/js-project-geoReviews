import template from "../template.hbs";

let arrReviews = [];
let mapGlobal;
let coordsGlobal;
let firstGeoObjectGlobal;
let clustererGlobal;
let listCommentsGlobal;

let buttonHandleClick = function (e) {
  e.preventDefault();
  e.stopPropagation();
  
  let inputName = document.querySelector("#input-name");
  let inputPlace = document.querySelector("#input-place");
  let inputComment = document.querySelector("#input-comment");

  console.log("button click");

  let reviewInfo = {};
  let userName = inputName.value;
  let userPlace = inputPlace.value;
  let userReview = inputComment.value;

  if (userName && userPlace && userReview) {
    let placemark = new ymaps.Placemark(
      coordsGlobal,
      {},
      {
        // preset: 'islands#violetIcon'
        iconLayout: "default#image",
        iconImageHref: "img/red-marker.png",
        iconImageSize: [30, 45],
        iconImageOffset: [-15, -45],
      }
    );
    let now = new Date();
    let options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    reviewInfo = {
      name: userName,
      place: userPlace,
      review: userReview,
      coords: coordsGlobal,
      adress: firstGeoObjectGlobal,
      date: now.toLocaleString("ru", options),
    };
    mapGlobal.geoObjects.add(placemark);
    placemark.properties.set("placemarkInfo", reviewInfo);
    mapGlobal.geoObjects.add(clustererGlobal);
    clustererGlobal.add(placemark);

    placemark.events.add(["click"], function (e) {
      let arrRev = [];

      arrRev.push(e.get("target").properties.get("placemarkInfo"));
      listCommentsGlobal.innerHTML = template({ items: arrRev });
    });
  }
  arrReviews.push(reviewInfo);
  listCommentsGlobal.innerHTML = template({ items: arrReviews });
  inputName.value = "";
  inputPlace.value = "";
  inputComment.value = "";
};

export default function addedUserReview(
  map,
  mapEvent,
  buttonAddReview,
  coords,
  firstGeoObject,
  listComments,
  clusterer
) {
  mapGlobal = map;
  coordsGlobal = coords;
  firstGeoObjectGlobal = firstGeoObject;
  clustererGlobal = clusterer;
  listCommentsGlobal = listComments;

  buttonAddReview.removeEventListener("click", buttonHandleClick);
  buttonAddReview.addEventListener("click", buttonHandleClick);
  console.log('tralala map', mapEvent);

  if (mapEvent) {
    listComments.innerHTML = "";
    arrReviews.splice(0, arrReviews.length);
    console.log("clear arrReviews");
  }
}
