const main = $('#AnyThing');
const firstnameinp = $('#firstname');
const patronymicinp = $('#patronymic');
const lastnameinp = $('#lastname');
const phone = $('#phone');
const email = $('#email');
const studyplace = $('#studyplace');

const ARRAY = [];
const cities = {};
const talents = {};

function exit() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}

$(document).ready(() => {
  const token = localStorage.getItem('token');
  if (!token) exit();

  $.get('/search/cities', {}, (citiesData) => {
    citiesData.forEach((city) => {
      cities[city.id] = city.name;
      const option = $('<option></option>').text(city.name).val(city.id);
      $('#city-input').append(option);
    });
  });

  $.get('/search/talents', {}, (talentsData) => {
    talentsData.forEach((talent) => {
      talents[talent.id] = talent.name;
      const option = $('<option></option>').text(talent.name).val(talent.id);
      $('#talent-input').append(option);
    });
  });

  $.get('/users/getMe', { headers: { Authorization: token } }, (data) => {
    if (data.role === 'child') exit();
    $('#name-surname').text(`${data.firstname} ${data.lastname}`);
  });

  $.get('/search/childrens', {}, (data) => {
    data.forEach((user) => {
      if (user.role === 'admin') return;
      const tr = $('<tr></tr>').css('background-color', '#14814E4D').addClass('py-2');

      tr.append($('<td></td>').css('height', '60px').text(user.lastname));
      tr.append($('<td></td>').text(user.firstname));
      tr.append($('<td></td>').text(user.patronymic));

      const date = new Date(user.birthdate);
      var ageDifMs = Date.now() - user.birthdate;
      var ageDate = new Date(ageDifMs);

      tr.append($('<td></td>').text(Math.abs(ageDate.getUTCFullYear() - 1970)));
      tr.append($('<td></td>').text(cities[user.city]));
      tr.append($('<td></td>').text(talents[user.talent]));
      tr.append($('<td></td>').text(user.studyplace));
      tr.append($('<td></td>').text(user.phone));
      tr.append($('<td></td>').text(user.email));

      const img = $('<img>').attr('src', '/images/trash.svg').attr('height', 32).attr('width', 32);
      tr.append($('<td></td>').append(img));

      ARRAY.push(tr);
      main.append(tr);
    });
  });
});

firstnameinp.on('input', () => {
  let filteredArray = ARRAY.filter((elem) => elem.children().eq(1).text().slice(0, firstnameinp.val().length).toLowerCase() === firstnameinp.val().toLowerCase());
  main.empty();
  filteredArray.forEach((elem) => {
    main.append(elem);
  });
});

patronymicinp.on('input', () => {
  let filteredArray = ARRAY.filter((elem) => elem.children().eq(2).text().slice(0, patronymicinp.val().length).toLowerCase() === patronymicinp.val().toLowerCase());
  main.empty();
  filteredArray.forEach((elem) => {
    main.append(elem);
  });
});

lastnameinp.on('input', () => {
  let filteredArray = ARRAY.filter((elem) => elem.children().eq(0).text().slice(0, lastnameinp.val().length).toLowerCase() === lastnameinp.val().toLowerCase());
  main.empty();
  filteredArray.forEach((elem) => {
    main.append(elem);
  });
});

studyplace.on('input', () => {
  let filteredArray = ARRAY.filter((elem) => elem.children().eq(7).text().slice(0, studyplace.val().length).toLowerCase() === studyplace.val().toLowerCase());
  main.empty();
  filteredArray.forEach((elem) => {
    main.append(elem);
  });
});


phone.on('input', () => {
  let filteredArray = ARRAY.filter((elem) => elem.children().eq(7).text().slice(0, phone.val().length).toLowerCase() === phone.val().toLowerCase());
  main.empty();
  filteredArray.forEach((elem) => {
    main.append(elem);
  });
});

email.on('input', () => {
  let filteredArray = ARRAY.filter((elem) => elem.children().eq(8).text().slice(0, email.val().length).toLowerCase() === email.val().toLowerCase());
  main.empty();
  filteredArray.forEach((elem) => {
    main.append(elem);
  });
});

function sortByAge() {
  let ageFrom = $('#ageFrom').val();
  let ageTo = $('#ageTo').val();
  let filteredArray = ARRAY.filter((elem) => {
    let age = parseInt(elem.children().eq(3).text());
    return age >= ageFrom && age <= ageTo;
  });

  main.empty();
  filteredArray.forEach((elem) => {
    main.append(elem);
  });

  if (!$('#ageFrom').val() && !$('#ageTo').val()) {
    main.empty();
    ARRAY.forEach((elem) => {
      main.append(elem);
    });
  }
}

$('#ageFrom').on('input', sortByAge);
$('#ageTo').on('input', sortByAge);

$('#city-input').on('change', (event) => {
  if (parseInt(event.target.value)) {
    let filteredArray = ARRAY.filter((elem) => elem.children().eq(4).text() === cities[event.target.value]);
    main.empty();
    filteredArray.forEach((elem) => {
      main.append(elem);
    });
  } else {
    main.empty();
    ARRAY.forEach((elem) => {
      main.append(elem);
    });
  }
});

$('#talent-input').on('change', (event) => {
  if (parseInt(event.target.value)) {
    let filteredArray = ARRAY.filter((elem) => elem.children().eq(5).text() === talents[event.target.value]);
    main.empty();
    filteredArray.forEach((elem) => {
      main.append(elem);
    });
  } else {
    main.empty();
    ARRAY.forEach((elem) => {
      main.append(elem);
    });
  }
});