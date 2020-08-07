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

export default modals;