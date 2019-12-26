export class Api {
  constructor(options) {
    this.baseUrl = options.baseUrl;
    this.token = options.token;
  }

  getInitialCards(doFunction) {
    this.fetchData(`${this.baseUrl}/cards`, "GET", doFunction);
  }

  getProfile(doFunction) {
    this.fetchData(`${this.baseUrl}/users/me`, "GET", doFunction);
  }

  like(id, doFunction) {
    this.fetchData(`${this.baseUrl}/cards/like/${id}`, "PUT", doFunction);
  }

  dislike(id, doFunction) {
    this.fetchData(`${this.baseUrl}/cards/like/${id}`, "DELETE", doFunction);
  }

  createCard(body, doFunction) {
    this.postData(`${this.baseUrl}/cards`, 'POST', body, doFunction);
  }

  updateProfil(body, doFunction) {
    this.postData(`${this.baseUrl}/users/me`, 'PATCH', body, doFunction);
  }

  updateAvatar(body, doFunction) {
    this.postData(`${this.baseUrl}/users/me/avatar`, 'PATCH', body, doFunction);
  }

  fetchData(url, method, doFunction) {
    fetch(url, {
      method: method,
      headers: {
        authorization: this.token
      }
    }).then(res => {
      /*
        Можно лучше: проверка ответа сервера и преобразование из json
        дублируется, лучше вынести в отдельный метод:
        getResponseData(res) {
          if (res.ok) {
            return res.json();
          }
          return Promise.reject(`Ошибка: ${res.status}`);
        }
      */
      if (res.ok) {
        return res.json()
      }
      return Promise.reject(`Что-то пошло не так: ${res.status}`);
    }).then((res) => {
      doFunction(res);
    }).catch((error) => {
      console.log(error);
    });
  }

  postData(url, metod, body, doFunction) {
    fetch(url, {
      method: metod,
      headers: {
        authorization: this.token,
        'Content-Type': 'application/json'
      },
      body: body
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Что-то пошло не так: ${res.status}`);
      })
      .then((result) => {
        doFunction(result);
      })
      .catch(error => {
        console.log(error);
      })
  }

  deleteCard(id, doFunction) {
    this.fetchData(`${this.baseUrl}/cards/${id}`, 'DELETE', doFunction);
  }
}
