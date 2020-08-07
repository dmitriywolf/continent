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
export default forms;