import './pages/index.css';
import { Api } from './api.js';
import { Profile } from './profile.js';
import { CardList } from './cardList.js';
import { PopupShowCard, PopupNewCard, PopupEditProfile, PopupEditAvatar } from './popup.js';

const serverUrl = NODE_ENV === 'development' ? 'http://praktikum.tk/cohort5' : 'https://praktikum.tk/cohort5'
let idProfile = '';

const api = new Api({
  'baseUrl': serverUrl,
  'token': '764b7d37-6c81-493b-bddf-01325b213ef0'
});

const profile = document.querySelector('.profile');
const addPopupButton = document.querySelector('.user-info__button');
const userEditButton = document.querySelector('.user_edit')
const popupShowCard = new PopupShowCard(document.querySelector('#foto'));
const placesList = new CardList(document.querySelector('.places-list'), popupShowCard);

const popupProfile = new PopupEditProfile(document.querySelector('#profile'), profile, api);
popupProfile.eventListenerSubmit(popupProfile.submit);
popupProfile.eventListenerInput(popupProfile.render);
userEditButton.addEventListener('click', popupProfile.open.bind(popupProfile));

const popupAvatar = new PopupEditAvatar(document.querySelector('#avatar'), profile, api);
popupAvatar.eventListenerSubmit(popupAvatar.submit);
popupAvatar.eventListenerInput(popupAvatar.render);
popupAvatar.userInfoFoto.addEventListener('click', popupAvatar.open.bind(popupAvatar));


// =================================== API ======================================

api.getProfile((result) => {
  new Profile(result.name, result.about, result.avatar, result._id).update();
  idProfile = result._id;

  const popupCard = new PopupNewCard(document.querySelector('#card'), placesList, idProfile, api);
  popupCard.eventListenerSubmit(popupCard.submit);
  popupCard.eventListenerInput(popupCard.render);

  addPopupButton.addEventListener('click', popupCard.open.bind(popupCard));

  api.getInitialCards((result) => {
    result.forEach(function (item) {
      placesList.addCard(item, idProfile, api);
    });
  })
});


/*
  Хорошая работа:
  - отлично, что сделано также дополнительное задание
  - есть обработка ошибок в конце цепочки блоков then
  - изменения на странице происходят только после ответа сервера
  - код хорошо организован

  Можно лучше:
  - менять надпись на кнопке нужно в блоке finally
  - передавать настройки сервера как параметры конструктора, а не хардкодить в самом классе
  - не дублировать проверку ответа сервера

  Так же хочу обратить внимание на альтернативное решение данной задачи.
  Сейчас для выполнения действий после ответа сервера в метод запроса передается
  колбэк, а можно было все зделать на промисах, их также можно возвращать из метода, вот пример кода:
  Метод getUserData класса Api:
    getUserData() { //в методе getUserData делаем запрос к серверу и
      return fetch(`${this.baseUrl}/users/me`,{ // <-- возвращаем промис с данными
        headers: this.headers
      })
      .then((res) => {            //в этом методе также обработка ошибок
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
      })
    }

    Использование метода:
    api.getUserData()
      .then((userData) => {   //обрабатывает возвращенный промис
        ........
      })
      .catch((err) => console.log(err));  // <-- обработка ошибок здесь, в самом конце цепочки then
    }

    Если у Вас будет свободное время попробуйте изучить работу с сервером
    с использованием async/await для работы с асинхронными запросами.
    https://learn.javascript.ru/async-await
    https://habr.com/ru/company/ruvds/blog/414373/
    Это часто используется в реальной работе

    Успехов в дальнейшем обучении!
*/