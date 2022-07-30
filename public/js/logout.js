document
  .querySelector('.nav__el--logout')
  .addEventListener('click', async () => {
    try {
      const res = await axios({
        method: 'POST',
        url: '/logout',
      });
      if (res.status === 200) {
        alert('Siz tizimdan chiqdingiz');
        window.setTimeout(() => {
          location.assign('/login');
        }, 1000);
      }
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  });
