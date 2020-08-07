const scrolling = () => {
  /* PageUp */
  const upElement = document.querySelector('.pageup');
  window.addEventListener('scroll', () => {
    if (document.documentElement.scrollTop > 1700) {
      upElement.classList.add('fadeIn');
      upElement.classList.remove('fadeOut');
    } else {
      upElement.classList.add('fadeOut');
      upElement.classList.remove('fadeIn');
    }
  });

  // Вспомогательные переменные для кроссбраузерности
  const element = document.documentElement;
  const {body} = document;

  // Якоря
  const anchors = document.querySelectorAll('[href^="#"]');

  // Подсчет расстояния скролинга
  const calcScroll = () => {
    anchors.forEach((item) => {
      item.addEventListener('click', function (event) {
        console.log(item.hash);

        const scrollTop = Math.round(body.scrollTop || element.scrollTop);

        if (this.hash !== '') {
          event.preventDefault();

          // Элемент к которому будет произведен скрол
          let hashElement = document.querySelector(this.hash);
          let hashElementTop = 0;

          while (hashElement.offsetParent) {
            hashElementTop += hashElement.offsetTop;
            hashElement = hashElement.offsetParent;
          }

          hashElementTop = Math.round(hashElementTop);

          smoothScroll(scrollTop, hashElementTop, this.hash);
        }
      });
    });
  };

  // Функция скролинга
  const smoothScroll = (from, to, hash) => {
    const timeInterval = 1;
    let prevScrollTop;
    let speed;

    // Скорость
    if (to > from) {
      speed = 30;
    } else {
      speed = -30;
    }

    // Анимация скролла
    const move = setInterval(() => {
      const scrollTop = Math.round(body.scrollTop || element.scrollTop);

      if (
          prevScrollTop === scrollTop
          || (to > from && scrollTop >= to)
          || (to < from && scrollTop <= to)
      ) {
        clearInterval(move);
        history.replaceState(history.state, document.title, location.href.replace(/#.*$/g, '') + hash);
      } else {
        body.scrollTop += speed;
        element.scrollTop += speed;
        prevScrollTop = scrollTop;
      }
    }, timeInterval);
  };

  calcScroll();
};

export default scrolling;