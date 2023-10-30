import {filterUsers, searchUsers, sortUsers} from "./userOperation";
import L from 'leaflet';
import Chart from 'chart.js/auto';
function renderCharts(usersToCharts) {
  const params = ['course', 'age', 'gender', 'country'];
  const pieChartContainer = document.getElementById('pieChartContainer');

  params.forEach((param) => {
    const chartElement = document.createElement('div');
    chartElement.className = 'chart-container';
    pieChartContainer.appendChild(chartElement);

    const canvasElement = document.createElement('canvas');
    chartElement.appendChild(canvasElement);

    const data = {};

    usersToCharts.forEach((user) => {
      const paramValue = user[param];
      if (data[paramValue]) {
        data[paramValue] += 1;
      } else {
        data[paramValue] = 1;
      }
    });

    createPieChart(canvasElement, data, param);
  });
}

function createPieChart(chartElement, data, title) {
  const chartObject = new Chart(chartElement, {
    type: 'pie',
    data: {
      labels: Object.keys(data),
      datasets: [{
        label: 'amount',
        data: Object.values(data),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: title,
        },
      },
    },
  });
}
function toggleMap(userOnMap){
  console.log('toggleMap');
  const mapContainer = document.getElementById('mapContainer');
  console.log(mapContainer);
  mapContainer.classList.toggle("none");
  mapContainer.innerHTML = '';
  if(!mapContainer.classList.contains("none")) {
    const mapContainerHTML = `<div id="map" class="map__container"></div>`;
    mapContainer.insertAdjacentHTML('beforeend', mapContainerHTML);
    const map = L.map('map').setView([userOnMap.coordinates.latitude, userOnMap.coordinates.longitude], 13);

// Add a tile layer (you can change the URL to your preferred map provider)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

// Add a marker for the teacher's location
    L.marker([userOnMap.coordinates.latitude, userOnMap.coordinates.longitude]).addTo(map)
      .bindPopup(`${userOnMap.full_name}`)
      .openPopup();
  }

}
export function renderUser(usersToRender, addToEnd = false, place = "topTeachers") {
  let userContainer;
  if (place === "topTeachers") {
    userContainer = document.getElementById('top-teachers-container');
  } else {
    userContainer = document.getElementById('favoriteContainer');
  }

  let userHTML = '';
  usersToRender.forEach((user) => {
    let starSrc;
    let userPic = user.picture_large || '';
    let userPicToDisplay;
    if (userPic === '') {
      userPicToDisplay = `<p class="teacher__card-img">${user.full_name}</p>`
    } else {
      userPicToDisplay = `<img class="teacher__card-img" src="${userPic}">`
    }
    if (user.favorite) {
      starSrc = 'images/star.svg'
    } else {
      starSrc = ''
    }
    userHTML += `
        <div class="teacher__card" data-teacher-email="${user.email}" >
            <div class="teacher__card-img-box" >
                ${userPicToDisplay}
            </div>
        <img class="teacher__card-favorite" src="${starSrc}" alt="" >
        <p class="teacher__card-name">${user.full_name}</p>
            <p class="teacher__card-subject">${user.course}</p>
            <p class="teacher__card-country">${user.country}</p>
        </div>`;
  })
  if (addToEnd) {
    userContainer.insertAdjacentHTML('beforeend', userHTML);
  } else {
    userContainer.innerHTML = userHTML;
  }
}

export function teacherInfoPopUp(usersToShow) {
  const popUpContainer = document.getElementById('popUpContainer');
  window.addEventListener('click', event => {
    try {
      if (event.target.closest('.teacher__card').classList.contains('teacher__card')) {
        const card = event.target.closest('.teacher__card');
        // console.log(card);
        const userId = card.dataset.teacherEmail;
        // console.log(userId);
        const userToShow = usersToShow.find(user => user.email === userId);
        const userToShowIndex = usersToShow.findIndex(user => user.email === userId);
        // console.log(userToShow);
        let favoriteStar;
        if (userToShow.favorite) {
          favoriteStar = 'images/star.svg'
        } else {
          favoriteStar = 'images/empty-star.svg'
        }
        popUpContainer.classList.toggle("none");
        const teacherInfoHTML = `
    <div class="none" id="mapContainer"></div>
        <div class="teacher-info__popup">
        <div class="add-teacher__title">
            <h3 class="title-3">Teacher Info</h3>
            <button id="closeButton">
                <img src="images/x.svg" alt="close" class="img-x" >
            </button>
        </div>
        <div class="teacher-info__content">
            <div class="teacher-info__content-top-row">
                <img class="teacher-info__img" src="${userToShow.picture_large}" alt="teacher img">
                <div class="teacher-info__block">
                    <div class="teacher-info__block-text">
                        <h4 class="teacher-info__title">${userToShow.full_name}</h4>
                        <p class="teacher-info__subject">${userToShow.course}</p>
                        <p class="teacher-info__country-city">${userToShow.city}, ${userToShow.country}</p>
                        <p class="teacher-info__age-sex">${userToShow.age}, ${userToShow.gender}</p>
                        <p class="teacher-info__email">${userToShow.email}</p>
                        <p class="teacher-info__number">${userToShow.phone}</p>
                    </div>
                    <button>
                        <img class="teacher-info__add-to-favorite" src=${favoriteStar} alt="add to favorite" id="addToFavoriteButton">
                    </button>
                </div>
            </div>
            <p class="teacher-info__description">${userToShow.note}</p>
            <a href="#"><p class="teacher-info__map" id="toggleMapButton">toggle map</p></a>
        </div>
    </div>`;
        // popUpContainer.insertAdjacentHTML('beforeend', teacherInfoHTML);
        popUpContainer.innerHTML = teacherInfoHTML;
        const closeButton = document.getElementById("closeButton");
        closeButton.addEventListener('click', () => {
          popUpContainer.innerHTML = '';
          popUpContainer.classList.toggle("none");
        })
        const addToFavoriteButton = document.getElementById("addToFavoriteButton");
        addToFavoriteButton.addEventListener('click', () => {
          const userToRemoveEmail = usersToShow[userToShowIndex].email;

          const favoriteContainer = document.getElementById('favoriteContainer');
          const userContainer = document.getElementById('top-teachers-container');

          const userToRemove = favoriteContainer.querySelector(`[data-teacher-email="${userToRemoveEmail}"]`);
          const topTeacherStarToRemove = userContainer.querySelector(`[data-teacher-email="${userToRemoveEmail}"]`);
          // console.log(usersToRemove);

          usersToShow[userToShowIndex].favorite = !usersToShow[userToShowIndex].favorite;
          const favoriteStatusImg = card.querySelector('.teacher__card-favorite');
          // console.log(favoriteStatusImg);
          if (usersToShow[userToShowIndex].favorite) {

            addToFavoriteButton.src = "./images/star.svg";
            favoriteStatusImg.src = "./images/star.svg";
            // console.log([usersToShow[userToShowIndex]]);
            renderUser([usersToShow[userToShowIndex]], true, 'favoriteTeacher')
            // console.log(favoriteStatusImg);
          } else {
            const removeInitialFavImg = topTeacherStarToRemove.querySelector('.teacher__card-favorite');
            removeInitialFavImg.src = '';

            addToFavoriteButton.src = "./images/empty-star.svg";
            favoriteStatusImg.src = "";
            // console.log(userToRemove);
            userToRemove.remove();
            // renderUser([usersToShow[userToShowIndex]], false, 'favoriteTeacher')
          }
          updateSlider();

          // renderUser(usersToShow);
          // console.log(userToShow);
        })
        const toggleMapButton = document.getElementById('toggleMapButton');
        toggleMapButton.addEventListener('click', () => {
          console.log('click')
          toggleMap(userToShow);
        })
      }
    } catch (e) {
    }
  })

}

export function filterTeachers(usersToFilter) {
  const filterAge = document.getElementById("filter-age");
  const filterRegion = document.getElementById("filter-region");
  const filterSex = document.getElementById("filter-sex");
  const filterCheckboxPhoto = document.getElementById("filter-checkbox-photo");
  const filterOnlyFavorites = document.getElementById("filter-only-favorites");
  const searchInput = document.getElementById('teacherSearchInput');
  filterAge.addEventListener("change", applyFilters);
  filterRegion.addEventListener("change", applyFilters);
  filterSex.addEventListener("change", applyFilters);
  filterCheckboxPhoto.addEventListener("change", applyFilters);
  filterOnlyFavorites.addEventListener("change", applyFilters);

  function applyFilters() {
    const selectedCountry = filterRegion.value;
    const selectedAge = filterAge.value;
    const selectedGender = filterSex.value;
    const selectedFavorite = filterOnlyFavorites.checked;
    const selectedWithPhoto = filterCheckboxPhoto.checked;
    searchInput.value = '';

    const filteredUsers = filterUsers(usersToFilter, selectedCountry, selectedAge, selectedGender, selectedFavorite, selectedWithPhoto);
    console.log(filteredUsers);
    renderUser(filteredUsers);
    filterStatistics(filteredUsers);
    renderStatistics(filteredUsers);
  }
}

function clearFilterInputs() {
  document.getElementById("filter-age").value = "any";
  document.getElementById("filter-region").value = "any";
  document.getElementById("filter-sex").value = "any";
  document.getElementById("filter-checkbox-photo").checked = false;
  document.getElementById("filter-only-favorites").checked = false;
}

export function filterStatistics(usersToSort) {
  const sortButtons = [
    {id: "statisticsSortByName", key: "full_name"},
    {id: "statisticsSortBySpeciality", key: "course"},
    {id: "statisticsSortByAge", key: "age"},
    {id: "statisticsSortByGender", key: "gender"},
    {id: "statisticsSortByNationality", key: "country"},
  ];

  sortButtons.forEach((buttonInfo) => {
    const button = document.getElementById(buttonInfo.id);
    button.setAttribute("data-toggle", "true");

    button.addEventListener("click", () => {
      sortButtons.forEach((btnInfo) => {
        const btn = document.getElementById(btnInfo.id);
        btn.classList.remove("thead-asc", "thead-desc");
      });

      const currentToggleState = button.getAttribute("data-toggle") === "true";
      button.setAttribute("data-toggle", !currentToggleState);

      if (currentToggleState) {
        button.classList.add("thead-desc");
      } else {
        button.classList.add("thead-asc");
      }

      applySort(buttonInfo.key, currentToggleState);
    });
  });


  function applySort(sortBy, sortOrder) {

    // console.log(selectedAge);
    // console.log(selectedCountry);
    // console.log(selectedGender);
    // console.log(selectedFavorite);
    // console.log(selectedWithPhoto);
    // const filteredUsers = filterUsers(usersToFilter, selectedCountry, selectedAge, selectedGender, selectedFavorite)
    // const sortBy = 'age';
    // const sortOrder = 'asc';
    const sortedUsers = sortUsers(usersToSort, sortBy, sortOrder);
    // console.log(filteredUsers);
    renderStatistics(sortedUsers);
  }
}

export function renderStatistics(usersToRender) {
  const statisticContainer = document.getElementById('statisticContainer');
  let userStatisticHTML = ``;
  usersToRender.slice(0, 10).forEach(user => {
    userStatisticHTML += `
                            <tr>
                                <td>${user.full_name}</td>
                                <td>${user.course}</td>
                                <td>${user.age}</td>
                                <td>${user.gender}</td>
                                <td>${user.country}</td>
                            </tr>`;
  })
  statisticContainer.innerHTML = userStatisticHTML;
  renderPagination(usersToRender);
  // renderCharts(usersToRender);
}

function renderPieChartStatistic(userToStatistics){


}
let paginationState = {
  currentPage: 0,
  usersOnPage: 10
}

export function renderPagination(userToPagination) {
  const paginationContainer = document.getElementById('paginationContainer');
  paginationContainer.innerHTML = ``;
  const pageAmount = (userToPagination.length / paginationState.usersOnPage);
  for (let i = 0; i < pageAmount; i++) {
    const paginationElement = document.createElement("li");
    paginationElement.textContent = `${i + 1}`;
    if(i === paginationState.currentPage){
      paginationElement.classList.add('current__page')
    }
    addClickListenerPagination(paginationElement, i);
    paginationContainer.appendChild(paginationElement);
  }

  function addClickListenerPagination(paginationElement, page) {
    paginationElement.addEventListener('click', () => {
      paginationState.currentPage = page;
      const paginationSlice = paginationState.currentPage * paginationState.usersOnPage;
      const userToRender = userToPagination.slice(paginationSlice, paginationSlice + paginationState.usersOnPage)
      renderStatistics(userToRender);
      renderPagination(userToPagination);
    })
  }
}

export function addTeacher(usersToExpand) {
  const popUpContainer = document.getElementById('popUpContainer');
  const addTeacherButtons = document.querySelectorAll('.add-teacher-button')
  addTeacherButtons.forEach(button => {
      button.addEventListener('click', () => {
        document.body.classList.toggle("body-overflow");
        popUpContainer.classList.toggle("none");
        popUpContainer.innerHTML = `
    <div class="add-teacher__popup">
        <div class="add-teacher__title">
            <h3 class="title-3">Add Teacher</h3>
            <button id="closeButton">
                <img src="images/x.svg" alt="close" class="img-x">
            </button>
        </div>
        <form class="add-teacher__form">
            <div class="form__element">
                <label for="add-teacher-name">Name</label>
                <input type="text" id="add-teacher-name" name="name" placeholder="Enter name" required>
            </div>

            <div class="form__element">
                <label for="add-teacher-speciality">Speciality</label>
                <select id="add-teacher-speciality" name="speciality">
                    <option value="Mathematics">Mathematics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                </select>
            </div>

            <div class="form__element">
                <label for="add-teacher-country">Country</label>
                <select id="add-teacher-country" name="country">
                    <option value="Ukraine">Ukraine</option>
                    <option value="USA">USA</option>
                    <option value="Great Britain">Great Britain</option>
                </select>
            </div>

            <div class="form__element">
                <label for="add-teacher-city">City</label>
                <input type="text" id="add-teacher-city" name="city" required>
            </div>

            <div class="form__element">
                <label for="add-teacher-email">Email</label>
                <input type="email" id="add-teacher-email" name="email" required>
            </div>

            <div class="form__element">
                <label for="add-teacher-phone">Phone</label>
                <input type="tel" id="add-teacher-phone" name="phone">
            </div>

            <div class="form__element">
                <label for="add-teacher-birthdate">Date of birth</label>
                <input type="date" id="add-teacher-birthdate" name="birthdate" required>
            </div>

            <div class="form__element">
                <p>Sex</p>
                <label for="add-teacher-male">Male</label>
                <input type="radio" id="add-teacher-male" name="sex" value="male">
                <label for="add-teacher-female">Female</label>
                <input type="radio" id="add-teacher-female" name="sex" value="female">
            </div>

            <div class="form__element">
                <label for="color">Background color</label>
                <input type="color" id="color" name="color">
            </div>

            <div class="form__element">
                <label for="add-teacher-notes">Notes (optional)</label>
                <textarea id="add-teacher-notes" name="notes"></textarea>
            </div>

            <button class="add-teacher__button button" id="add-new-teacher" type="button">Add</button>
        </form>
    </div>`;

        const addNewTeacherButton = document.getElementById('add-new-teacher');

        addNewTeacherButton.addEventListener('click', (event) => {
            event.preventDefault();
            const name = document.getElementById("add-teacher-name").value;
            const speciality = document.getElementById("add-teacher-speciality").value;
            const country = document.getElementById("add-teacher-country").value;
            const city = document.getElementById("add-teacher-city").value;
            const email = document.getElementById("add-teacher-email").value;
            const phone = document.getElementById("add-teacher-phone").value;
            const birthdate = document.getElementById("add-teacher-birthdate").value;
            const sex = document.querySelector('input[name="sex"]').value;
            const color = document.getElementById("color").value;
            const notes = document.getElementById("add-teacher-notes").value;

            const newTeacher = {
              'full_name': name,
              'course': speciality,
              'country': country,
              'city': city,
              'email': email,
              'phone': phone,
              'b_date': birthdate,
              "gender": sex,
              'bg_color': color,
              'note': notes || 'Note',
            };

            function validateNewTeacher(newTeacher) {
              const regExpEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
              if (!regExpEmail.test(newTeacher.email)) {
                return 'Email is not valid.';
              }
              const currentDate = new Date();
              const birthdate = new Date(newTeacher.b_date);
              console.log(birthdate);
              const eighteenYearsAgo = new Date(
                currentDate.getFullYear() - 18,
                currentDate.getMonth(),
                currentDate.getDate()
              );
              if (birthdate > eighteenYearsAgo) {
                return 'You have to be 18 years old at least.';
              }
              if (newTeacher.full_name === '') {
                return 'Name is empty';
              }
              if (newTeacher.gender === '') {
                return 'Gender is empty';
              }
              if (newTeacher.city === '') {
                return 'City is empty';
              }
              if (newTeacher.country === '') {
                return 'Country is empty';
              }
              if (newTeacher.phone === '') {
                return 'Phone is empty';
              }

              return true;
            }

            let check = validateNewTeacher(newTeacher);
            if (check === true) {

              // console.log([newTeacher])
              usersToExpand.push(newTeacher);
              // postNewTeacher(newTeacher); // json-server --watch src/db.json
              renderUser([newTeacher], true);
              renderStatistics(usersToExpand);
              filterStatistics(usersToExpand);
              clearFilterInputs();

              popUpContainer.innerHTML = '';
              popUpContainer.classList.toggle("none");
              document.body.classList.toggle("body-overflow");
            } else {
              alert(check);
            }
          }
        )
        const closeButton = document.getElementById("closeButton");
        closeButton.addEventListener('click', () => {
          popUpContainer.innerHTML = '';
          popUpContainer.classList.toggle("none");
          document.body.classList.toggle("body-overflow");
        })
      })
    }
  )
}

function postNewTeacher(data){
  fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log('Дані були успішно відправлені на сервер', result);
    })
    .catch((error) => {
      console.error('Помилка під час відправки POST-запиту', error);
    });
}
export function renderSearchUsers(userToSearch) {
  const searchInput = document.getElementById('teacherSearchInput');
  const searchButton = document.getElementById('teacherSearchButton');
  searchButton.addEventListener('click', () => {
    const searchedUsers = searchUsers(userToSearch, searchInput.value);
    clearFilterInputs();
    renderUser(searchedUsers);
    filterStatistics(searchedUsers);
    renderStatistics(searchedUsers);
  })
}


export function updateSlider() {
  // console.log("update")
  let offset = 0;
  const sliderContainer = document.getElementById('favoriteContainer');
  const leftButton = document.getElementById('sliderLeftButton');
  const rightButton = document.getElementById('sliderRightButton');
  // console.log(sliderContainer.childElementCount);
  const elementAmount = sliderContainer.childElementCount;
  const screenWidth = window.innerWidth;
  // console.log(screenWidth);

  let elementsOnScreen = 5;

  if (screenWidth < 1158 && screenWidth > 858) {
    elementsOnScreen = 4;
  } else if (screenWidth <= 858 && screenWidth > 658) {
    elementsOnScreen = 3;
  } else if (screenWidth <= 658 && screenWidth > 458) {
    elementsOnScreen = 2;
  } else if (screenWidth <= 458) {
    elementsOnScreen = 1;
  }
  const maxOffset = (elementAmount - elementsOnScreen) * 200;
  // console.log(elementsOnScreen);

  // console.log(maxOffset);

  if (elementsOnScreen < elementAmount) {
    leftButton.addEventListener('click', () => {
      console.log('click')
      offset = offset - 200;
      if (offset < 0) {
        offset = maxOffset;
      }
      sliderContainer.style.left = -offset + 'px';
    })

    rightButton.addEventListener('click', () => {
      console.log('click')
      offset = offset + 200;
      if (offset > maxOffset) {
        offset = 0;
      }
      sliderContainer.style.left = -offset + 'px';
    })
  }
}