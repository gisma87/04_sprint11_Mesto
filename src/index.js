import "./style.css";
import {Api} from './js/Api.js';
import {Card} from './js/Card.js';
import {CardList} from './js/CardList.js';
import {FormValidator} from './js/FormValidator.js';
import {PopupAvatar} from './js/PopupAvatar.js';
import {PopupCard} from './js/PopupCard.js';
import {PopupImage} from './js/PopupImage.js';
import {PopupProfile} from './js/PopupProfile.js';
import {UserInfo} from './js/UserInfo.js';

const container = document.querySelector('.places-list');
const userPhoto = document.querySelector('.user-info__photo');
const errorMessages = {
    valueMissing: 'Это обязательное поле',
    tooShort: 'Должно быть от 2 до 30 символов',
    typeMismatch: 'Здесь должна быть ссылка'
};
const popupNewCard = document.querySelector('#popupNewPlace');
const userInfoName = document.querySelector('.user-info__name');
const userInfoJob = document.querySelector('.user-info__job');
const popupProfileNode = document.querySelector('#popupProfile');
new FormValidator(popupNewCard.querySelector('form'), errorMessages);
new FormValidator(popupProfileNode.querySelector('form'), errorMessages);
const cardList = new CardList(container);
const api = new Api({
    baseUrl: 'https://praktikum.tk/cohort10',
    headers: {
        authorization: 'e1b45cd6-f123-45ce-bec1-2b97665df892',
        'Content-Type': 'application/json'
    }
});

// получаем карточки с Api и отрисовываем на странице
function getInitialCards() {
    api.getInitialCards()
        .then(result => {
            // в cardsFilter убираю трёх спамеров, наплодили 50 пустых карточек
            const cardsFilter = result.filter(item => {
                return (item.owner._id !== '8e5308053b2657893352cde6' && item.owner._id !=='23a40bc402fd00844fffe55d' && item.owner._id !== '1efaef5b38d89184686eacbe');
            });
            const cards = cardsFilter.map(item => {
                    const oneCard = new Card(item.name, item.link, item._id, item.likes, userInfo.idUser, item.owner._id, api);
                    return oneCard.create();
            });
            cardList.render(cards);
        })
        .catch((err) => {
            console.log(err);
        });
}

function createCard(name, link, cardId, likeCounter, idUser, idOwner, api) {
    const newCard = new Card(name, link, cardId, likeCounter, idUser, idOwner, api);
    cardList.addCard(newCard.create());
}

const userInfo = new UserInfo(popupProfileNode, [userInfoName, userInfoJob], api, userPhoto);

const popupCard = new PopupCard(popupNewCard, createCard, api, userInfo);
new PopupProfile(popupProfileNode, userInfo);

const imageContainer = document.querySelector('#popupImage');
new PopupImage(imageContainer);

// добавление аватара
const popupAvatarNode = document.querySelector('#popupAvatar');
new PopupAvatar(popupAvatarNode, popupCard, api);
new FormValidator(popupAvatarNode.querySelector('form'), errorMessages);


userInfo.getUserInfo();
getInitialCards();