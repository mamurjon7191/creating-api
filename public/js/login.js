const enterSystem = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signin',
      data: {
        email: email,
        password: password,
      },
    });

    if (res.status === 200) {
      alert('Siz tizimga kirdingiz');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    console.log(err);
  }
};

document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  enterSystem(email, password);
  console.log(email, password);
});
