module.exports = {
  hello: 'world',
};

const randUser = {
  gender: 'male',
  name: { title: 'Mr', first: 'Norbert', last: 'Weishaupt' },
  location: {
    street: { number: 5597, name: 'Mittelstraße' },
    city: 'Rhön-Grabfeld',
    state: 'Mecklenburg-Vorpommern',
    country: 'Germany',
    postcode: 52640,
    coordinates: { latitude: '-42.1817', longitude: '-152.1685' },
    timezone: { offset: '+9:30', description: 'Adelaide, Darwin' },
  },
};

const courses = [
  'Mathematics',
  'Physics',
  'English',
  'Computer Science',
  'Dancing',
  'Chess',
  'Biology',
  'Chemistry',
  'Law',
  'Art',
  'Medicine',
  'Statistics',
];

const randUser1 = {
  gender: 'male',
  title: 'Mr',
  full_name: 'Norbert Weishaupt',
  city: 'Rhön-Grabfeld',
  state: 'Mecklenburg-Vorpommern',
  country: 'Germany',
  postcode: 52640,
  coordinates: { latitude: '-42.1817', longitude: '-152.1685' },
  timezone: { offset: '+9:30', description: 'Adelaide,Darwin' },
  email: 'norbert.weishaupt@example.com',
  b_date: '1956-12-23T19:09:19.602Z',
  age: 65,
  phone: '0079-8291509',
  picture_large: 'https://randomuser.me/api/portraits/men/28.jpg',
  picture_thumbnail: 'https://randomuser.me/api/portraits/thumb/men/28.jpg',
  id: Date.now(),
  bg_color: '#000000',
  favorite: ' ',
  note: ' ',
  course: courses[Math.floor(Math.random() * courses.length)],
};
