function exit() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}

$(document).ready(() => {
  const token = localStorage.getItem('token');
  if (!token) exit();
  const citySelect = $('#city-input');
  fetch('/search/cities', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach((talent) => {
        const option = $('<option></option>').text(talent.name).val(talent.id);
        citySelect.append(option);
      });
    });
  const talentSelect = $('#talent-input');
  fetch('/search/talents', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach((talent) => {
        const option = $('<option></option>').text(talent.name).val(talent.id);
        talentSelect.append(option);
      });
    });

  fetch('/users/getMe', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      citySelect.val(data.city);
      talentSelect.val(data.talent);
      $('#name-surname').text(`${data.firstname} ${data.lastname}`);
      $('#surname').val(data.lastname);
      $('#name').val(data.firstname);
      $('#patronymic').val(data.lastname);
      $('#date')[0].valueAsDate = new Date(data.birthdate);
      $('#placestudy').val(data.studyplace);
      $('#phone').val(data.phone);
    });
});
