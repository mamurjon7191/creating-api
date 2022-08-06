// const { default: axios } = require('axios');

const enterSystem1 = async (formData) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMe',
      data: formData,
    });
    console.log(res.status);
    if (res.status === 201) {
      alert('Siz malumotingizni ozgartirdingiz');
      window.setTimeout(() => {
        location.assign('/account');
      }, 1000);
    }
  } catch (err) {
    console.log(err);
  }
};

document.querySelector('.update-me-btn').addEventListener('click', (e) => {
  e.preventDefault();
  const name = document.querySelector('.input-name').value;
  const email = document.querySelector('.input-email').value;
  const photo = document.querySelector('#photo').files[0];

  let formData = new FormData(); // Rasmni base64 shifrlab jonatish un hamma malumotlani bittaga jamladi

  formData.append('name', name);
  formData.append('email', email);
  formData.append('photo', photo);

  enterSystem1(formData);
});

const enterSystem2 = async (passwordCurrent, newPassword, confirmPassword) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMyPassword',
      data: {
        oldPassword: passwordCurrent,
        newPassword: newPassword,
        confirmNewPassword: confirmPassword,
      },
    });
    console.log(res.status);
    if (res.status === 200) {
      alert('Siz parolingizni ozgartirdingiz');
      window.setTimeout(() => {
        location.assign('/account');
      }, 1000);
    }
  } catch (err) {
    console.log(err);
  }
};

document
  .querySelector('.change-password-btn')
  .addEventListener('click', (e) => {
    e.preventDefault();
    const passwordCurrent = document.querySelector('#password-current').value;
    const newPassword = document.querySelector('#password').value;
    const confirmPassword = document.querySelector('#password-confirm').value;
    enterSystem2(passwordCurrent, newPassword, confirmPassword);
    console.log(passwordCurrent, newPassword, confirmPassword);
  });
