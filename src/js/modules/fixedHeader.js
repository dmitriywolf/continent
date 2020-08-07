const fixedHeader = () => {
  const header = document.getElementById('header');
  const intro = document.getElementById('intro');

  let introHeight = intro.offsetHeight;
  let scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

  window.addEventListener('scroll', () => {
    introHeight = intro.offsetHeight;
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollPosition > introHeight) {
      header.classList.add('fixed', 'animated', 'fadeInDown');
    } else {
      header.classList.remove('fixed', 'fadeInDown');
    }

  });
}

export default fixedHeader;

