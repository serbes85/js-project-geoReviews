import { getParentByClass, getParentById } from "./support.js";

export default function getUserReview(left, top, marker, map, cluster) {
  // Установим центр карты в точку клика
  let arrReviews = [];
  let coords;

  if (Array.isArray(marker)) {
    marker.forEach((elem) => {
      coords = elem.geometry.getCoordinates();
      arrReviews.push(elem.properties.get("placemarkInfo"));
      console.log("marker is array", marker);
    });
  } else if (marker.get("target").properties !== undefined) {
    console.log("marker is not array", marker, marker.get("target").properties);

    coords = marker.get("target").geometry.getCoordinates();
    arrReviews.push(marker.get("target").properties.get("placemarkInfo"));
  } else {
    console.log("simple else marker", marker, marker.get("target").properties);
    coords = marker.get("coords");
  }
  map.setCenter(coords, 16, {
    checkZoomRange: true,
  });
  // Вернём результат выполнения функции geocode, т.к. это промис и нужно дождаться когда он отработает
  // return ymaps.geocode(marker.get('coords'),{results:"20"})
  return ymaps.geocode(coords, { results: "20" }).then(function (res) {
    let reviewWindow = document.querySelector(".wrapper"); // обертка для формы ввода данных
    let adress = document.querySelector(".adress"); // div, в который мы запишем адрес, полученный с пом. метода geocode
    let listComments = document.querySelector(".list-comments"); // обертка для списка отзывов по объекту в форме ввода данных
    let template = require("../template.hbs"); // подгружаем шаблон отзыва
    let inputName = document.querySelector("#input-name"); // поле ввода имени
    let inputPlace = document.querySelector("#input-place"); // поле ввода названия места
    let inputComment = document.querySelector("#input-comment"); // поле ввода комментария
    let firstGeoObject = res.geoObjects.get(0).getAddressLine();

    listComments.innerHTML = template({ items: arrReviews });

    adress.innerHTML = firstGeoObject; // записали в форму адрес места клика
    reviewWindow.style.left = left; // смещаем форму в определенное место для досупа пользователя
    reviewWindow.style.top = top; // смещаем форму в определенное место для досупа пользователя

    function eHandler(e) {
      e.preventDefault(); // отключаем действие по умолчанию, чтобы не перезагружалась страница
      event.stopPropagation(); // останавливае продвижение, чтобы не первый сработал обработчик на карте. Событие ловится на фазе захвата

      let buttonCloseReview = getParentByClass(e.target, "button-close"); // определяем: цель клика - это элемент закрывания формы или нет
      let mapEvent = getParentById(e.target, "map"); // определяем: цель клика - это элемент карты, который тоже приведёт к закрытию формы или нет
      let buttonAddReview = getParentByClass(e.target, "add-comment"); // определяем: цель клика - это элемент добавления отзыва или нет
      let reviewInfo = {}; // объект для хранения имени-места-отзыва

      console.log("mapEvent", mapEvent);
      // Если цель клика - это элемент добавления отзыва, то выполняем код ниже
      if (buttonAddReview) {
        let userName = inputName.value; // получаем введённое пользователем имя
        let userPlace = inputPlace.value; // получаем введённое пользователем место
        let userReview = inputComment.value; // получаем введённый пользователем комментарий

        // Если все поля заполнены
        if (userName && userPlace && userReview) {
          let mark = new ymaps.Placemark(
            coords,
            {},
            {
              // preset: "islands#violetIcon",
              iconLayout: "default#image",
              iconImageHref: "img/red-marker.png",
              iconImageSize: [30, 45],
              iconImageOffset: [-15, -45],
            }
          ); // создаем геообъект маркер
          let now = new Date();
          var options = {
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
            coords: coords,
            adress: firstGeoObject,
            date: now.toLocaleString("ru", options),
          }; // заполняем объект для хранения имени-места-отзыва введенными данными
          mark.properties.set("placemarkInfo", reviewInfo); // добавляем объект для хранения имени-места-отзыва в свойства маркера
          cluster.add(mark); // добавляем маркер в кластер
          map.geoObjects.add(cluster); // добавляем кластер на карту
          let clusterArr = cluster.getGeoObjects(); // получаем массив объектов в кластере
        }

        arrReviews.push(reviewInfo);
        listComments.innerHTML = template({ items: arrReviews });
        inputName.value = "";
        inputPlace.value = "";
        inputComment.value = "";
      }
      if (mapEvent || buttonCloseReview) {
        reviewWindow.style.left = "-9999px";
        listComments.innerHTML = "";
        inputName.value = "";
        inputPlace.value = "";
        inputComment.value = "";
        document.removeEventListener("click", eHandler);
        console.log("remove click button");
      }
    }

    document.addEventListener("click", eHandler);
    console.log("click button");
  });
}
