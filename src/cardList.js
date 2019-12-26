import { Card } from './card.js';

export class CardList {
  constructor(placesList, popup) {
    this.container = placesList;
    this.popup = popup;
  }

  addCard(item, curentUserId, api) {
    const card = new Card(item, api);
    card.render(this.popup.open.bind(this.popup), curentUserId);
    this.container.appendChild(card.cardElement);
  }
}