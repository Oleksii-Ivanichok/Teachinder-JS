export function mergeAndFormatUser(randomUserListMock, additionalUsersList) {
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

export function validateUsers(usersToValidate) {
  // const regExpEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const schema = {
    full_name: (value) => isFirstLetterUpperCase(value),
    city: (value) => isFirstLetterUpperCase(value),
    state: (value) => isFirstLetterUpperCase(value),
    country: (value) => isFirstLetterUpperCase(value),
    note: (value) => isFirstLetterUpperCase(value),
    age: (value) => Number.isInteger(value) && value > 0,
    email: (value) => value.includes("@"),
    // gender: (value) => isFirstLetterUpperCase(value),
    // phone: (value, user) => validatePhone(value, user.country),
  };
  function isFirstLetterUpperCase(str) {
    if (typeof str !== 'string' || str.length === 0) {
      return false;
    }

    const firstLetter = str.charAt(0);
    return firstLetter === firstLetter.toUpperCase();
  }

  function validatePhone(phone, country) {
    const countryToPhoneCode = {
      'United States': '+1',
      'United Kingdom': '+44',
      'Australia': '+61',
      'Germany': '+49',
      'Ukraine': '+380',
    };
    const expectedPhoneCode = countryToPhoneCode[country];
    if(expectedPhoneCode !== undefined){
      const phoneCodeLength = expectedPhoneCode.length;
      const providedPhoneCode = phone.substring(0, phoneCodeLength);
      return providedPhoneCode === expectedPhoneCode;
    }
    return false;
  }

  function validate(user) {
    return Object
      .keys(schema)
      .filter((key) => !schema[key](user[key], user))
      .map((key) => new Error(`${key}: ${user[key]} is invalid.`));
  }

  const errors = usersToValidate.map((user) => validate(user));
  console.log('Error list:');
  console.log(errors);

  function isValidUser(user) {
    return Object
      .keys(schema)
      .every((key) => schema[key](user[key], user));
  }

  const validUsers = usersToValidate.filter((user) => isValidUser(user));
  return validUsers;
}

export function filterUsers(usersToFilter, country, age, gender, favorite) {
  const ageArray = age.split("-");
  const startAge =  parseInt(ageArray[0]);
  const endAge =  parseInt(ageArray[1]);
  const filteredUsers = usersToFilter
    .filter((user) => (country === 'any' || user.country === country)
      && (age === 'any' || user.age > startAge && user.age < endAge)
      && (gender === 'any' || user.gender === gender)
      && (favorite === false || user.favorite === favorite));
  return (filteredUsers);
}

export function sortUsers(usersToSort, sortBy, sortOrder) {
  return usersToSort.sort((a, b) => {
    if (typeof a[sortBy] === 'string') {
      if (sortOrder === true) {
        return a[sortBy].localeCompare(b[sortBy]);
      }
      return b[sortBy].localeCompare(a[sortBy]);
    }
    if (typeof a[sortBy] === 'number') {
      if (sortOrder === true) {
        return a[sortBy] - b[sortBy];
      }
      return b[sortBy] - a[sortBy];
    }
    return 0;
  });
}

export function searchUsers(usersToSearch, searchBy, query) {
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


export function findSearchPercent(usersToCompare, searchedUsersToCompare) {
  if (searchedUsersToCompare.length > 0) {
    const result = ((searchedUsersToCompare.length / usersToCompare.length) * 100).toFixed(2);
    return result;
  }
  return 0;
}

