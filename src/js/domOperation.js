import {filterUsers, searchUsers, sortUsers} from "./userOperation";

export function renderUser(usersToRender, addToEnd = false) {
  const userContainer = document.getElementById('top-teachers-container');
  let userHTML = '';
  usersToRender.forEach((user) => {
    let starSrc;
    let userPic = user.picture_large || '';
    if (user.favorite) {
      starSrc = 'images/star.svg'
    } else {
      starSrc = ''
    }
    userHTML += `
        <div class="teacher__card" data-teacher-email="${user.email}" >
            <div class="teacher__card-img-box" >
                <img class="teacher__card-img" src="${userPic}" alt="${user.full_name}">
            </div>
        <img class="teacher__card-favorite" src="${starSrc}" alt="" >
        <p class="teacher__card-name">${user.full_name}</p>
            <p class="teacher__card-subject">${user.course}</p>
            <p class="teacher__card-country">${user.country}</p>
        </div>`;
  })
  if(addToEnd){
    userContainer.insertAdjacentHTML('beforeend', userHTML);
  } else{
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
        const teacherInfoHTML = `<div class="teacher-info__popup">
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
            <a href="#"><p class="teacher-info__map">toggle map</p></a>
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
          usersToShow[userToShowIndex].favorite = !usersToShow[userToShowIndex].favorite;
          const favoriteStatus = card.querySelector('.teacher__card-favorite');
          if (usersToShow[userToShowIndex].favorite) {
            addToFavoriteButton.src = "./images/star.svg";
            favoriteStatus.src = "./images/star.svg";
            // console.log(favoriteStatus);
          } else {
            addToFavoriteButton.src = "./images/empty-star.svg";
            favoriteStatus.src = "";
          }
          // renderUser(usersToShow);
          // console.log(userToShow);
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

    // console.log(selectedAge);
    // console.log(selectedCountry);
    // console.log(selectedGender);
    // console.log(selectedFavorite);
    // console.log(selectedWithPhoto);
    const filteredUsers = filterUsers(usersToFilter, selectedCountry, selectedAge, selectedGender, selectedFavorite)
    console.log(filteredUsers);
    renderUser(filteredUsers);
  }
}

export function filterStatistics(usersToSort) {
  const sortByName = document.getElementById("statisticsSortByName");
  const sortBySpeciality = document.getElementById("statisticsSortBySpeciality");
  const sortByAge = document.getElementById("statisticsSortByAge");
  const sortByGender = document.getElementById("statisticsSortByGender");
  const sortByNationality = document.getElementById("statisticsSortByNationality");

  let sortByNameToggle = true;
  sortByName.addEventListener("click", () => {
    sortByNameToggle = !sortByNameToggle;
    applySort('full_name', sortByNameToggle)
  });
  let sortBySpecialityToggle = true;
  sortBySpeciality.addEventListener("click", () => {
    sortBySpecialityToggle = !sortBySpecialityToggle;
    applySort('course', sortBySpecialityToggle);
  });

  let sortByAgeToggle = true;
  sortByAge.addEventListener("click", () => {
    sortByAgeToggle = !sortByAgeToggle;
    applySort('age', sortByAgeToggle);
  });

  let sortByGenderToggle = true;
  sortByGender.addEventListener("click", () => {
    sortByGenderToggle = !sortByGenderToggle;
    applySort('gender', sortByGenderToggle);
  });

  let sortByNationalityToggle = true;
  sortByNationality.addEventListener("click", () => {
    sortByNationalityToggle = !sortByNationalityToggle;
    applySort('country', sortByNationalityToggle);
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
  usersToRender.forEach(user => {
    userStatisticHTML += `
                            <tr>
                                <td>${user.full_name}</td>
                                <td>${user.course}</td>
                                <td>${user.age}</td>
                                <td>${user.gender}</td>
                                <td>${user.country}</td>
                            </tr>`;
    // statisticContainer.insertAdjacentHTML('beforeend', userStatisticHTML);
  })
  statisticContainer.innerHTML = userStatisticHTML;
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
                <input type="text" id="add-teacher-name" name="name" placeholder="Enter name">
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
                <input type="text" id="add-teacher-city" name="city">
            </div>

            <div class="form__element">
                <label for="add-teacher-email">Email</label>
                <input type="email" id="add-teacher-email" name="email">
            </div>

            <div class="form__element">
                <label for="add-teacher-phone">Phone</label>
                <input type="tel" id="add-teacher-phone" name="phone">
            </div>

            <div class="form__element">
                <label for="add-teacher-birthdate">Date of birth</label>
                <input type="date" id="add-teacher-birthdate" name="birthdate">
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

            <button class="add-teacher__button button" id="add-new-teacher">Add</button>
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
          const sex = document.querySelector('input[name="sex"]:checked').value;
          const color = document.getElementById("color").value;
          const notes = document.getElementById("add-teacher-notes").value;

          const newTeacher = {
            'full_name': name,
            'course': speciality,
            'country': country,
            'city' :city,
            'email': email,
            'phone': phone,
            'b_date': birthdate,
            "gender": sex,
            'bg_color': color,
            'note': notes || 'Note',
          };
          // console.log([newTeacher])
          usersToExpand.push(newTeacher);
          renderUser([newTeacher], true);
          renderStatistics(usersToExpand);

          popUpContainer.innerHTML = '';
          popUpContainer.classList.toggle("none");
          document.body.classList.toggle("body-overflow");
        })
        const closeButton = document.getElementById("closeButton");
        closeButton.addEventListener('click', () => {
          popUpContainer.innerHTML = '';
          popUpContainer.classList.toggle("none");
          document.body.classList.toggle("body-overflow");
        })
        // console.log("click");
      })
    }
  )
}

export function renderSearchUsers(userToSearch){
  const searchInput = document.getElementById('teacherSearchInput');
  const searchButton = document.getElementById('teacherSearchButton');
  searchButton.addEventListener('click', () => {
    const searchedUsers = searchUsers(userToSearch, searchInput.value);
    renderUser(searchedUsers);
  })
}

export function renderFavoriteUsers(favoriteUsersToRender){
  // users.filter(user => user.favorite === true)
  const favoriteContainer = document.getElementById('favoriteContainer');
  favoriteUsersToRender.forEach(user => {

  })
}