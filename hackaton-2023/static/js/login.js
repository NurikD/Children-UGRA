
const form = $('#login-form');

form.on('submit', (event) => {
  if (!form[0].checkValidity()) {
    event.preventDefault();
    event.stopPropagation();
  } else {
    fetch('/users/login', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: $('#email').val(),
        password: $('#password').val(),
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            localStorage.setItem('token', data.token);
            if (data.role === 'child') {
              window.location.href = '/child/profile';
            } else {
              window.location.href = '/admin/profile';
            }
          });
        } else if (response.status === 401) {
          $('#wrongpass').removeAttr('hidden');
        }
      });
    event.preventDefault();
  }
  form[0].classList.add('was-validated');
});
