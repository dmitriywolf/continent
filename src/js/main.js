document.addEventListener('DOMContentLoaded', () => {
    "use strict";

    /*Fixed Header*/
    const navHeader = () => {

        let header = document.getElementById('header');
        let intro = document.getElementById('intro');

        let introHeight = intro.offsetHeight;
        let scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        //Fixed TopHeader
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
    navHeader();

    /*Smooth Scroll*/
    const scrolling = () => {
        /*PageUp*/
        let upElement = document.querySelector('.pageup');
        window.addEventListener('scroll', () => {

            if (document.documentElement.scrollTop > 1700) {
                upElement.classList.add('fadeIn');
                upElement.classList.remove('fadeOut');

            } else {
                upElement.classList.add('fadeOut');
                upElement.classList.remove('fadeIn');
            }
        });

        //Вспомогательные переменные для кроссбраузерности
        const element = document.documentElement,
            body = document.body;

        //Якоря
        let anchors = document.querySelectorAll('[href^="#"]');

        //Подсчет расстояния скролинга
        const calcScroll = () => {

            anchors.forEach(item => {
                item.addEventListener('click', function (event) {

                    console.log(item.hash);

                    let scrollTop = Math.round(body.scrollTop || element.scrollTop);

                    if (this.hash !== '') {
                        event.preventDefault();

                        //Элемент к которому будет произведен скрол
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
            })

        };

        //Функция скролинга
        const smoothScroll = (from, to, hash) => {

            let timeInterval = 1,
                prevScrollTop,
                speed;

            //Скорость
            if (to > from) {
                speed = 30;
            } else {
                speed = -30;
            }

            //Анимация скролла
            let move = setInterval(function () {
                let scrollTop = Math.round(body.scrollTop || element.scrollTop);

                if (
                    prevScrollTop === scrollTop ||
                    (to > from && scrollTop >= to) ||
                    (to < from && scrollTop <= to)
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

    /*Tabs*/
    const tabs = () => {
        function tab(tabNavSelector, tabContentSelector) {

            let tabNav = document.querySelectorAll(tabNavSelector);
            let tabContent = document.querySelectorAll(tabContentSelector);
            let tabName;

            tabNav.forEach(item => {
                item.addEventListener('click', selectTabNav)
            });

            function selectTabNav() {
                tabNav.forEach(item => {
                    item.classList.remove('active');
                });
                this.classList.add('active');
                tabName = this.getAttribute('data-tab-name');
                selectTabContent(tabName);
            }

            function selectTabContent(tabName) {
                tabContent.forEach(item => {
                    item.classList.contains(tabName) ? item.classList.add('active', 'animated', 'bounceIn') :
                        item.classList.remove('active', 'bounceIn');
                });
            }
        }

        tab('.nav-tab', '.tab-content');
    };
    tabs();

    /*Forms*/
    const forms = () => {

        let form = document.querySelectorAll('form');
        let inputs = document.querySelectorAll('input');
        let phoneFields = document.querySelectorAll('input[type="tel"]');

        //В полях номера телефона вводить только цифры
        phoneFields.forEach(input => {
            input.addEventListener('input', () => {
                input.value = input.value.replace(/\D/, '');
            });
        });

        //Ответы для пользователя
        const answers = {
            loadingMessage: 'Загрузка...',
            successMessage: 'Спасибо! Мы ответим Вам в течении 60 секунд',
            failMessage: 'Извините! Что-то пошло не так...',
            loadingImg: './img/loading.gif',
            successImg: './img/success.png'
        };

        //Функция отправки запроса
        const postData = async (url, data) => {
            let response = await fetch(url, {
                method: "POST",
                body: data
            });
            return await response.text();
        };

        //Очистка полей формы после отправки
        const clearFields = () => {
            inputs.forEach(input => {
                input.value = "";
            });
        };

        //Обрабочик на отправку формы Submit
        form.forEach(item => {

            item.addEventListener('submit', (event) => {

                //Отмена стандартного поведения браузера
                event.preventDefault();

                //Блок ответа для пользователя
                let answerPopup = document.createElement('div');
                answerPopup.classList.add('popup--answer', 'animated', 'flipInX');
                document.body.append(answerPopup);

                let answerImg = document.createElement('img');
                answerImg.setAttribute('src', answers.loadingImg);
                answerPopup.append(answerImg);

                let answerText = document.createElement('p');
                answerText.textContent = answers.loadingMessage;
                answerPopup.append(answerText);

                let divFail = document.createElement('div');
                divFail.classList.add('img__failed');

                //Собрание всех данных которые ввел пользователь
                const formData = new FormData(item);

                //Осуществляем post запрос
                postData('./server.php', formData)
                //Успешное выполнение
                    .then(response => {
                        // console.log(response);
                        answerImg.setAttribute('src', answers.successImg);
                        answerText.textContent = answers.successMessage;
                    })
                    //Обработка ошибки
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
                    })
            });

        });

    };
    forms();

});