require('../css/app.css');
import { randomUserMock, additionalUsers } from './FE4U-Lab2-mock.js';
import {mergeAndFormatUser, formatFetchedUser, validateUsers, filterUsers, sortUsers,  searchUsers, findSearchPercent} from './userOperation'
import {
  renderUser,
  teacherInfoPopUp,
  filterTeachers,
  filterStatistics,
  renderStatistics,
  addTeacher,
  renderSearchUsers,
  updateSlider, renderPagination
} from './domOperation'
import {paginationStatistic} from "./pagination";
import  {fetchUsers} from './fetchUsers'

fetchData();
async function fetchData(){
  const url = 'https://randomuser.me/api/?results=50';
  let response = await fetch(url);
  let result = await response.json();
  console.log(result);
  main(result.results);
}
function main(fetchedUsers){
  // let fetchedUsers;
  // fetchUsers().then(res => {
  //   fetchedUsers = res.results;
  //   console.log(res.results);
  // })

  // task 1
  console.log(fetchedUsers);

  console.log('task 1');
  // let users = mergeAndFormatUser(fetchedUsers, fetchedUsers);
  let users = formatFetchedUser(fetchedUsers)
  console.log(users);

// task2
  console.log('task 2');
  const correctUser = {
    "gender": "Male",
    "title": "Mr",
    "full_name": "Oleksii Ivanichok",
    "city": "Kyiv",
    "state": "Kyiv",
    "country": "Ukraine",
    "postcode": 4919,
    "coordinates": {
      "latitude": "-73.3324",
      "longitude": "-63.8552"
    },
    "timezone": {
      "offset": "+7:00",
      "description": "Bangkok, Hanoi, Jakarta"
    },
    "email": "oleksii.ivanichok@gmail.com",
    "b_date": "1994-07-04T12:08:05.427Z",
    "age": 19,
    "phone": "+380678842837",
    "picture_large": "https://randomuser.me/api/portraits/men/51.jpg",
    "picture_thumbnail": "https://randomuser.me/api/portraits/thumb/men/51.jpg",
    "id": "756.2023.5649.57",
    "bg_color": "#000000",
    "favorite": false,
    "note": "Note",
    "course": "Chemistry"
  }
// users.push(correctUser);

  const validUsers = validateUsers(users);
  users = validUsers;
  console.log('validUsers:');
  console.log(validUsers);

  renderUser(users);
  teacherInfoPopUp(users);
  filterTeachers(users);
  renderPagination(users);
  renderStatistics(users);
  filterStatistics(users);
  addTeacher(users);
  renderSearchUsers(users);
  // paginationStatistic(users);
  console.log(users);
  updateSlider();
  window.addEventListener('resize', updateSlider);

  // task3
  console.log('task 3');


  const filteredUsers = filterUsers(users, 'Germany', '18-40', 'female', false);
  console.log(filteredUsers);

// task4
  console.log('task 4');
  const sortBy = 'age';
  const sortOrder = true;
  const sortedUsers = sortUsers(users, sortBy, sortOrder);
  console.log(sortedUsers);

// task5
  console.log('task 5');
  const searchQuery = 'Aa';

  const searchedUsers = searchUsers(users, searchQuery);
  console.log(searchedUsers);

// task 6
  console.log('task 6');
  const searchPercent = findSearchPercent(users, searchUsers(users, searchQuery));
  console.log(`${searchPercent}%`);

}

// main();



