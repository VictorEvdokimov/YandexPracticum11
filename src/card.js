export class Card {
    constructor(item, api){
      this.name = item.name;
      this.link = item.link;
      this.id = item._id;
      this.likes = item.likes;
      this.author = item.owner._id;
      this.api = api;
    }

    render(popup, curentUserId){
      this.cardElement = this.createCard(this.name, this.link, curentUserId);
      if (curentUserId == this.author){
      this.cardElement.querySelector('.place-card__delete-icon')
             .addEventListener('click', this.remove.bind(this));
      }
      this.cardElement.querySelector('.place-card__like-icon')
              .addEventListener('click', this.like.bind(this));
      this.cardElement.querySelector('.place-card__image')
              .addEventListener('click', popup);
    }

    like(event){
      let count = this.cardElement.querySelector('.place-card__like-count');
      if (event.target.classList.contains('place-card__like-icon_liked')){
        this.api.dislike(this.id, (res) => {
          this.likes = res.likes;
          event.target.classList.toggle('place-card__like-icon_liked');
          count.textContent = this.likes.length;
        })
      } else {
        this.api.like(this.id, (res) => {
          this.likes = res.likes;
          event.target.classList.toggle('place-card__like-icon_liked');
          count.textContent = this.likes.length;
        });
      }
    }

    remove(event){
      event.stopPropagation();
      if (window.confirm('Вы действительно хотите удалить эту карточку?')) {
        this.api.deleteCard(this.id, (res) => {
          this.cardElement.remove();
        });
      }
    }

    createCard(nameValue, linkValue, curentUserId){
      const placeCard = document.createElement('div');
      placeCard.classList.add('place-card');
      
      const placeCardImage = document.createElement('div');
      placeCardImage.classList.add('place-card__image');
      placeCardImage.style.backgroundImage = `url(${linkValue})`;

      const placeCardDescription = document.createElement('div');
      placeCardDescription.classList.add('place-card__description');
      
      const placeCardName = document.createElement('h3');
      placeCardName.classList.add('place-card__name');
      placeCardName.textContent = nameValue;

      const likeContent = document.createElement('div');
      likeContent.classList.add('place-card__like-content');
      
      const placeCardLikeButton = document.createElement('button');
      placeCardLikeButton.classList.add('place-card__like-icon');

      for (let i = 0; i < this.likes.length; ++i) {
        if(this.likes[i]._id == curentUserId) {
          placeCardLikeButton.classList.add('place-card__like-icon_liked');
          break;
        }
      }

      const likeCount = document.createElement('div');
      likeCount.classList.add('place-card__like-count');
      likeCount.textContent = this.likes.length;


      if (curentUserId == this.author){
        const placeCardDeleteButton = document.createElement('button');
        placeCardDeleteButton.classList.add('place-card__delete-icon');
        placeCardImage.appendChild(placeCardDeleteButton);
      }

      placeCard.appendChild(placeCardImage);
      placeCard.appendChild(placeCardDescription);
      placeCardDescription.appendChild(placeCardName);

      likeContent.appendChild(placeCardLikeButton);
      likeContent.appendChild(likeCount);
      
      placeCardDescription.appendChild(likeContent);

      return placeCard;

    }
}