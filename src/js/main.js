document.addEventListener('DOMContentLoaded', () => {

  /* Fixed Header */
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
  };
  fixedHeader();

  /* Smooth Scroll */
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
    const { body } = document;

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

  scrolling();


  /* Tabs */
  const tabs = () => {
    function tab(tabNavSelector, tabContentSelector) {
      const tabNav = document.querySelectorAll(tabNavSelector);
      const tabContent = document.querySelectorAll(tabContentSelector);
      let tabName;

      tabNav.forEach((item) => {
        item.addEventListener('click', selectTabNav);
      });

      function selectTabNav() {
        tabNav.forEach((item) => {
          item.classList.remove('active');
        });
        this.classList.add('active');
        tabName = this.getAttribute('data-tab-name');
        selectTabContent(tabName);
      }

      function selectTabContent(tabName) {
        tabContent.forEach((item) => {
          item.classList.contains(tabName) ? item.classList.add('active', 'animated', 'zoomIn')
            : item.classList.remove('active', 'zoomIn');
        });
      }
    }

    tab('.nav-tab', '.tab-content');
  };
  tabs();

  /* Modals */
  const modals = () => {
    function bindModal(triggerSelector, modalSelector, closeSelector) {
      const trigger = document.querySelectorAll(triggerSelector);
      const modal = document.querySelector(modalSelector);
      const close = document.querySelector(closeSelector);
      const windows = document.querySelectorAll('.popup');
      const scroll = calcScroll();

      trigger.forEach((item) => {
        item.addEventListener('click', (e) => {
          if (e.target) {
            e.preventDefault();
          }

          // Скрываем все открытые окна если такие есть
          windows.forEach((item) => {
            item.classList.remove('show');
          });

          modal.classList.add('show', 'animated');
          document.body.style.overflow = 'hidden';
          document.body.style.marginRight = `${scroll}px`;
        });
      });

      close.addEventListener('click', () => {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        document.body.style.marginRight = '0px';
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          windows.forEach((item) => {
            item.classList.remove('show');
          });

          modal.classList.remove('show');
          document.body.style.overflow = '';
          document.body.style.marginRight = '0px';
        }
      });
    }

    // Получаем ширину скролла
    function calcScroll() {
      const div = document.createElement('div');

      div.style.width = '50px';
      div.style.height = '50px';

      div.style.overflowY = 'scroll';
      div.style.visibility = 'hidden';

      document.body.appendChild(div);
      const scrollWidth = div.offsetWidth - div.clientWidth;
      div.remove();
      return scrollWidth;
    }

    bindModal('.button--consultation', '.popup--consultation', '.popup--consultation .popup__close');
  };
  modals();


  /* Carousel */
  const carousel = () => {
    const configPartners = {
      type: 'carousel',
      startAt: 0,
      perView: 3,
      breakpoints: {
        990: {
          perView: 2,
        },
        575: {
          perView: 1,
        },
      },
    };
    new Glide('.glide--thanks-federal', configPartners).mount();
    new Glide('.glide--thanks-parents', configPartners).mount();
  };
  carousel();

  /* Forms */
  const forms = () => {
    const form = document.querySelectorAll('form');
    const inputs = document.querySelectorAll('input');
    const phoneFields = document.querySelectorAll('input[type="tel"]');

    // В полях номера телефона вводить только цифры
    phoneFields.forEach((input) => {
      input.addEventListener('input', () => {
        input.value = input.value.replace(/\D/, '');
      });
    });

    // Ответы для пользователя
    const answers = {
      loadingMessage: 'Загрузка...',
      successMessage: 'Спасибо! Мы ответим Вам в течении 60 секунд',
      failMessage: 'Извините! Что-то пошло не так...',
      loadingImg: './img/loading.gif',
      successImg: './img/success.png',
    };

    // Функция отправки запроса
    const postData = async (url, data) => {
      const response = await fetch(url, {
        method: 'POST',
        body: data,
      });
      return await response.text();
    };

    // Очистка полей формы после отправки
    const clearFields = () => {
      inputs.forEach((input) => {
        input.value = '';
      });
    };

    // Обрабочик на отправку формы Submit
    form.forEach((item) => {
      item.addEventListener('submit', (event) => {
        // Отмена стандартного поведения браузера
        event.preventDefault();

        // Блок ответа для пользователя
        const answerPopup = document.createElement('div');
        answerPopup.classList.add('popup--answer', 'animated', 'flipInX');
        document.body.append(answerPopup);

        const answerImg = document.createElement('img');
        answerImg.setAttribute('src', answers.loadingImg);
        answerPopup.append(answerImg);

        const answerText = document.createElement('p');
        answerText.textContent = answers.loadingMessage;
        answerPopup.append(answerText);

        const divFail = document.createElement('div');
        divFail.classList.add('img__failed');

        // Собрание всех данных которые ввел пользователь
        const formData = new FormData(item);

        // Осуществляем post запрос
        postData('./server.php', formData)
        // Успешное выполнение
          .then((response) => {
            // console.log(response);
            answerImg.setAttribute('src', answers.successImg);
            answerText.textContent = answers.successMessage;
          })
        // Обработка ошибки
          .catch(() => {
            answerImg.remove();
            answerPopup.prepend(divFail);
            answerText.textContent = answers.failMessage;
          })
          .finally(() => {
            clearFields();
            setTimeout(() => {
              answerPopup.classList.remove('flipInX');
              answerPopup.classList.add('flipOutX');
              // answerPopup.remove();
            }, 4000);
          });
      });
    });
  };
  forms();
});
