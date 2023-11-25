const token = localStorage.getItem('token');
if (token) window.location.href = '/child/profile';

$(document).ready(() => {
  const form = $('#registration-form');
  const citySelect = $('#city-input');

  $(form).on('submit', (event) => {
    if (!form[0].checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      const formData = new FormData(form[0]);
      console.log(formData);
      fetch('/users/register', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem('token', data);
          window.location.href = '/html/child/profile.html';
        });
    }
    form.addClass('was-validated');

    event.preventDefault();
  });

  fetch('/search/cities', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach((talent) => {
        const option = $('<option></option>').text(talent.name).val(talent.id);
        citySelect.append(option);
      });
    });
  if ($('input[name="role"]').val() === 'child') {
    const talentSelect = $('#talent-input');
    fetch('/search/talents', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        data.forEach((talent) => {
          const option = $('<option></option>').text(talent.name).val(talent.id);
          talentSelect.append(option);
        });
      });
  }
});
