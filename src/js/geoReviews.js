import getSlider from "./getSlider.js";
import getUserReview from "./getUserReview.js";

// import { buttonHandleClick } from "./addedUserReview.js";

function init() {
  const map = new ymaps.Map("map", {
    center: [55.76, 37.64],
    zoom: 10,
    controls: ["zoomControl"],
    // behaviors: ["drag"],
  });
  let clusterer = new ymaps.Clusterer({
    preset: "islands#invertedVioletClusterIcons",
    clusterDisableClickZoom: true,
    clusterHideIconOnBalloonOpen: true,
    hasBalloon: false,
  });
  let clustererHandleClick = function (e) {
    e.preventDefault();

    if (e.get("target").properties.get("placemarkInfo")) {
      getUserReview("900px", "20px", e, map, clusterer);
      console.log("click marker");
    } else {
      console.log("Cluster placemarkInfo");
      let clusterArr = e.get("target").getGeoObjects();
      getSlider(...e.get("position"), clusterArr, map, clusterer);
    }
  };
  let mapHandleClick = function (e) {
    e.preventDefault();
    e.stopPropagation();
    // document.querySelector(".add-comment").removeEventListener("click", buttonHandleClick);

    getUserReview("900px", "20px", e, map, clusterer);
    console.log("click map");
  };
  clusterer.events.add("click", clustererHandleClick);
  map.events.add("click", mapHandleClick);
}
ymaps.ready(init);
