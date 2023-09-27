import { randomUserMock, additionalUsers } from './FE4U-Lab2-mock.js';

// const testModules = require('./test-module');
require('../css/app.css');

/** ******** Your code here! *********** */

// console.log(userMock.randomUserMock)
// console.log(userMock.additionalUsers)
// console.log(userMock.additionalUsers[0])
// console.log(formatRandomUser(userMock.additionalUsers[0]))

// task 1
console.log('task 1');

function mergeAndFormatUser(randomUserListMock, additionalUsersList) {
  const courses = ['Mathematics', 'Physics', 'English', 'Computer Science', 'Dancing', 'Chess', 'Biology', 'Chemistry', 'Law', 'Art', 'Medicine', 'Statistics'];

  function formatRandomUser(user) {
    return {
      gender: user.gender || '',
      title: user.name.title || '',
      full_name: `${user.name.first} ${user.name.last}` || '',
      city: user.location.city || '',
      state: user.location.state || '',
      country: user.location.country || '',
      postcode: user.location.postcode || '',
      coordinates: {
        latitude: user.location.coordinates.latitude || '',
        longitude: user.location.coordinates.longitude || '',
      },
      timezone: {
        offset: user.location.timezone.offset || '', description: user.location.timezone.description || '',
      },
      email: user.email || '',
      b_date: user.dob.date || user.b_day,
      age: user.dob.age || user.b_day,
      phone: user.cell || '',
      picture_large: user.picture.large || '',
      picture_thumbnail: user.picture.thumbnail || '',
      id: user.id.value || Date.now() || '',
      bg_color: user.bg_color || '#000000',
      favorite: user.favorite || false,
      note: user.note || 'Note',
      course: user.course || courses[Math.floor(Math.random() * courses.length)],
    };
  }

  function formatAdditionalUser(user) {
    return {
      gender: user.gender || '',
      title: user.title || '',
      full_name: user.full_name || '',
      city: user.city || '',
      state: user.state || '',
      country: user.country || '',
      postcode: user.postcode || '',
      coordinates: {
        latitude: (user.coordinates && user.coordinates.latitude) || '',
        longitude: (user.coordinates && user.coordinates.longitude) || '',
      },
      timezone: {
        offset: (user.timezone && user.timezone.offset) || '',
        description: (user.timezone && user.timezone.description) || '',
      },
      email: user.email || '',
      b_date: user.b_day || '',
      age: user.b_day || '',
      phone: user.phone || '',
      picture_large: user.picture_large || '',
      picture_thumbnail: user.picture_thumbnail || '',
      id: user.id || Date.now(),
      bg_color: user.bg_color || '#000000',
      favorite: user.favorite || false,
      note: user.note || 'Note',
      course: user.course || courses[Math.floor(Math.random() * courses.length)],
    };
  }

  function removeDuplicateObjects(array, property) {
    const uniqueIds = [];

    return array.filter((element) => {
      const isDuplicate = uniqueIds.includes(element[property]);

      if (!isDuplicate) {
        uniqueIds.push(element[property]);

        return true;
      }

      return false;
    });
  }

  const randomUsersFormatted = randomUserListMock.map(formatRandomUser);
  const additionalUsersFormatted = additionalUsersList.map(formatAdditionalUser);
  const usersCombined = randomUsersFormatted.concat(additionalUsersFormatted);
  // console.log(usersCombined)

  const users = removeDuplicateObjects(usersCombined, 'email');
  // console.log(users);
  return users;
}

const users = mergeAndFormatUser(randomUserMock, additionalUsers);
console.log(users);

// task2
console.log('task 2');

function validateUsers(usersToValidate) {
  const regExpWord = /^[A-Z]/;
  const regExpEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const schema = {
    // gender: value => regExpWord.test(value),
    full_name: (value) => regExpWord.test(value),
    city: (value) => regExpWord.test(value),
    state: (value) => regExpWord.test(value),
    note: (value) => regExpWord.test(value),
    age: (value) => Number.isInteger(value) && value > 0,
    email: (value) => regExpEmail.test(value),
    phone: (value) => value !== '',
  };

  function validate(user) {
    return Object
      .keys(schema)
      .filter((key) => !schema[key](user[key]))
      .map((key) => new Error(`${key}: ${user[key]} is invalid.`));
  }

  const errors = usersToValidate.map((user) => validate(user));
  console.log('Error list:');
  console.log(errors);

  function isValidUser(user) {
    return Object
      .keys(schema)
      .every((key) => schema[key](user[key]));
  }

  const validUsers = usersToValidate.filter((user) => isValidUser(user));
  return validUsers;
}

const validUsers = validateUsers(users);
console.log('validUsers:');
console.log(validUsers);

// task3
console.log('task 3');

// users.map(user => console.log(user.country === true))

function filterUsers(usersToFilter, country = null, age = null, gender = null, favorite = null) {
  const filteredUsers = usersToFilter
    .filter((user) => (country === null || user.country === country)
    && (age === null || user.age === age)
    && (gender === null || user.gender === gender)
    && (favorite === null || user.favorite === favorite));
  return (filteredUsers);
}

const filteredUsers = filterUsers(users, 'Germany', 35, 'female', false);
console.log(filteredUsers);

// task4
console.log('task 4');

function sortUsers(usersToSort, sortBy, sortOrder) {
  return usersToSort.sort((a, b) => {
    if (typeof a[sortBy] === 'string') {
      if (sortOrder === 'asc') {
        return a[sortBy].localeCompare(b[sortBy]);
      }
      return b[sortBy].localeCompare(a[sortBy]);
    }
    if (typeof a[sortBy] === 'number') {
      if (sortOrder === 'asc') {
        return a[sortBy] - b[sortBy];
      }
      return b[sortBy] - a[sortBy];
    }
    return 0;
  });
}

const sortBy = 'age';
const sortOrder = 'asc';
const sortedUsers = sortUsers(users, sortBy, sortOrder);
console.log(sortedUsers);

// task5
console.log('task 5');

function searchUsers(usersToSearch, searchBy, query) {
  const queryToLower = query.toLowerCase();
  const searchedUsers = usersToSearch.filter((user) => {
    if (Object.prototype.hasOwnProperty.call(user, searchBy)) {
      const paramValue = user[searchBy].toLowerCase();
      if (typeof paramValue === 'string') {
        // Якщо параметр - рядок, перевіряємо на часткове співпадіння
        return paramValue.includes(queryToLower);
      }
      if (typeof paramValue === 'number') {
        // Якщо параметр - число, перевіряємо на часткове співпадіння, перетворюючи число на рядок
        return paramValue.toString().includes(queryToLower.toString());
      }
    }
    return false;
  });
  return searchedUsers;
}

const searchByParam = 'full_name';
const searchQuery = 'Aa';

const searchedUsers = searchUsers(users, searchByParam, searchQuery);
console.log(searchedUsers);

// task 6
console.log('task 6');

function findSearchPercent(usersToCompare, searchedUsersToCompare) {
  if (searchedUsersToCompare.length > 0) {
    const result = ((searchedUsersToCompare.length / usersToCompare.length) * 100).toFixed(2);
    return result;
  }
  return 0;
}

const searchPercent = findSearchPercent(users, searchUsers(users, searchByParam, searchQuery));
console.log(`${searchPercent}%`);

// console.log('users:')
// console.log(users)
