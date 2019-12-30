import { Profile } from './profile.js';

export class Popup {
  constructor(popup) {
    this.popup = popup;
    this.popup.querySelector('.popup__close').addEventListener('click', this.close.bind(this))
  }

  open() {
    this.popup.classList.add('popup_is-opened');
  }

  close() {
    this.popup.classList.remove('popup_is-opened');
  }
}

export class PopupShowCard extends Popup {
  open(event) {
    const showBigPopupImage = this.popup.querySelector('.showBigPopup__image');
    showBigPopupImage.src = event.target.style.backgroundImage.slice(5, -2);
    super.open();
  }
}

export class PopupForm extends Popup {
  constructor(popup, api) {
    super(popup);
    this.api = api;
    this.form = popup.querySelector('form');
  }

  eventListenerSubmit(submit) {
    this.form.addEventListener('submit', submit.bind(this));
  }

  eventListenerInput(render) {
    this.form.addEventListener('input', render.bind(this));
  }

  enableButton() {
    let button = this.form.querySelector('.popup__button');
    button.classList.add('popup__button_enable');
    button.removeAttribute('disabled');
  }

  disabeButton() {
    let button = this.form.querySelector('.popup__button');
    button.classList.remove('popup__button_enable');
    button.setAttribute('disabled', true);
  }

  close() {
    super.close();
    this.form.reset();
    this.disabeButton();
  }
}

export class PopupNewCard extends PopupForm {
  constructor(popup, placesList, curentUserId, api) {
    super(popup, api);
    this.nameComment = this.popup.querySelector('.popup__input_type_name-comment');
    this.linkComment = this.popup.querySelector('.popup__input_type_link-url-comment');
    this.placesList = placesList;
    this.name = this.form.elements.name;
    this.link = this.form.elements.link;
    this.curentUserId = curentUserId;
  }

  submit(event) {
    event.preventDefault();
    this.form.elements.add.textContent = 'Загрузка...';
    this.disabeButton();
    let body = JSON.stringify({
      name: this.name.value,
      link: this.link.value
    });
    this.api.createCard(body, (result) => {
      this.placesList.addCard(result, this.curentUserId, api);
      this.form.reset();
      this.close();

      /* Можно лучше: менять состояние кнопки следует в блоке finally который выполнится
      в любом случае - была ошибка при запросе или нет 
      https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally  */
      this.form.elements.add.textContent = '+';
    });
  }

  validate() {
    let isValid = false;

    if (!this.name.value.length) {
      this.nameComment.textContent = "Это обязательное поле"
      isValid = false;
    } else if (this.name.value.length < 2 || this.name.value.length > 30) {
      this.nameComment.textContent = "Должно быть от 2 до 30 символов"
      isValid = false;
    } else {
      this.nameComment.textContent = "\u00a0";
      isValid = true;
    }
    if (!this.link.value.length) {
      this.linkComment.textContent = "Это обязательное поле"
      isValid = false;
    } else if (!this.link.value.startsWith('https:')) {
      this.linkComment.textContent = "Здесь должна быть ссылка"
      isValid = false;
    } else {
      this.linkComment.textContent = "\u00a0";
      isValid = true & isValid;
    }
    return isValid;
  }

  render() {
    if (this.validate()) {
      this.enableButton();
    } else {
      this.disabeButton();
    }
  }

  close() {
    super.close();
    this.nameComment.textContent = "\u00a0";
    this.linkComment.textContent = "\u00a0";
  }
}

export class PopupEditProfile extends PopupForm {
  constructor(popup, profile, api) {
    super(popup, api);
    this.inputNameComment = this.popup.querySelector('.popup__input_type_name-edit-comment');
    this.inputAboutComment = this.popup.querySelector('.popup__input_type_about-edit-comment');
    this.profile = profile;
    this.name = profile.querySelector('.user-info__name');
    this.job = profile.querySelector('.user-info__job');
    this.author = this.form.elements.author;
    this.about = this.form.elements.about;
  }

  submit(event) {
    event.preventDefault();
    event.currentTarget.elements.save.textContent = 'Загрузка...';
    this.disabeButton();
    setTimeout(() => {
      let body = JSON.stringify({
        name: this.author.value,
        about: this.about.value
      });
      this.api.updateProfil(body, (result) => {
        new Profile(result.name, result.about, result.avatar, result._id).update();
        this.form.reset();
        this.close();

        /* Можно лучше: менять состояние кнопки следует в блоке finally который выполнится
         в любом случае - была ошибка при запросе или нет 
         https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally  */
        this.form.elements.save.textContent = 'Сохранить';
      })
    }, 500);
  }

  validate() {
    let valid = false;
    if (!this.author.value.length) {
      this.inputNameComment.textContent = "Это обязательное поле";
      valid = false;
    } else if (this.author.value.length < 2 || this.author.value.length > 30) {
      this.inputNameComment.textContent = "Должно быть от 2 до 30 символов";
      valid = false;
    } else {
      this.inputNameComment.textContent = "\u00a0";
      valid = true;
    }
    if (!this.about.value.length) {
      this.inputAboutComment.textContent = "Это обязательное поле";
      valid = false;
    } else if (this.about.value.length < 2 || this.about.value.length > 30) {
      this.inputAboutComment.textContent = "Должно быть от 2 до 30 символов";
      valid = false;
    } else {
      this.inputAboutComment.textContent = "\u00a0";
      valid = true & valid;
    }
    return valid;
  }

  render() {
    if (this.validate()) {
      this.enableButton();
    } else {
      this.disabeButton();
    }
  }

  open() {
    super.open();
    this.author.value = this.name.textContent;
    this.about.value = this.job.textContent;
    this.render();
  }

  close() {
    super.close();
    this.inputNameComment.textContent = "\u00a0";
    this.inputAboutComment.textContent = "\u00a0";
  }
}

export class PopupEditAvatar extends PopupForm {
  constructor(popup, profile, api) {
    super(popup, api);
    this.inputAvatar = this.popup.querySelector('.popup__input_type_link-avatar');
    this.inputAvatarCmment = this.popup.querySelector('.popup__input_type_avatar-edit');
    this.profile = profile;
    this.userInfoFoto = profile.querySelector('.user-info__photo');
    this.avatar = '';
  }

  submit(event) {
    let body = JSON.stringify({
      avatar: this.inputAvatar.value,
    });
    event.preventDefault();
    this.api.updateAvatar(body, (result) => {
      this.avatar = result.avatar;
      this.update();
      this.form.reset();
      this.close();
    });
  }

  update() {
    this.userInfoFoto.style.backgroundImage = `url(${this.avatar})`;
  }

  validate() {
    let isValid = false;
    if (!this.inputAvatar.value.length) {
      this.inputAvatarCmment.textContent = "Это обязательное поле"
      isValid = false;
    } else if (!this.inputAvatar.value.startsWith('https:')) {
      this.inputAvatarCmment.textContent = "Здесь должна быть ссылка"
      isValid = false;
    } else {
      this.inputAvatarCmment.textContent = "\u00a0";
      isValid = true;
    }
    return isValid;
  }

  render() {
    if (this.validate()) {
      this.enableButton();
    } else {
      this.disabeButton();
    }
  }

  close() {
    super.close();
    this.inputAvatarCmment.textContent = "\u00a0";
  }
}