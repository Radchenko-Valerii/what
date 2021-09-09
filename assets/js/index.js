'use strict';

const cardsContainer = document.querySelector('#root');

const userCards = data.map(function (userObj) {
  return generateUserCard(userObj);
});
cardsContainer.append(...userCards);


/**
 * Создает карточку на основании обьекта пользователя
 * @param {object} userObj обьект с даннывми пользователя
 * @returns {HTMLLIElement} верстка карточки
 */
function generateUserCard(userObj) {
  let { id, firstName, lastName, description='Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Maecenas sed diam eget risus varius blandit sit amet non magna. Nullam quis risus eget urna mollis ornare vel eu leo.', profilePicture, contacts} = userObj;

  if(typeof firstName !== 'string' || firstName == false){
    firstName = 'unknown'
  }
  if(typeof lastName !== 'string' || lastName == false){
    lastName = 'unknown'
  }

  const img = createElement('img', {
    classNames: ['img'],
    attrs: { src: profilePicture, alt: firstName+' '+lastName, 'data-id' : id, "title": firstName + ' ' + lastName},
  });
  img.addEventListener('error', deleteHandler);
  img.addEventListener('load', imageLoadHandler);

  const userName = createElement(
    'h2',
    { classNames: ['cardName'] },
    
    document.createTextNode(firstName+' '+lastName)
  );
 

  const cardDescription = createElement(
    'p',
    {
      classNames: ['cardDescription'],
    },
    document.createTextNode(description)
  );

  const initails = createElement(
    'div',
    { classNames: ['initials'] },
    document.createTextNode(
      (firstName + " " + lastName)
        .trim()
        .split(' ')
        .map((word) => word[0])
        .join('')
    )
  );
  
  initails.style.backgroundColor = stringToColour(firstName+' '+lastName);

  const imgWrapper = createElement(
    'div',
    { classNames: ['imgWrapper'], attrs: {id: `wrapper${id}`} },
    initails
  );

  const linkWrapper = createElement('div', {classNames: ['linkWrapper']}, ...generateLinks(contacts));

  const article = createElement(
    'article',
    { classNames: ['userCard'] },
    imgWrapper,
    userName,
    cardDescription,
    linkWrapper
  );

  const userCard = createElement(
    'li',
    { classNames: ['cardWrapper'] },
    article
  );
  userCard.addEventListener('click', function(){this.classList.add('clicked-card')})
  
  return userCard;
}

/*
  UTILS
*/
/**
 * Функция генерации цвета для строки
 * @param {string} str 
 * @returns {string} строка в виде хекс-кода (#FF3610)
 */
function stringToColour(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}



function generateLinks(contacts){
  const linksArray = contacts.map((contact) => {

    const url = new URL(contact).hostname;
    if(SUPPORTED_SOCIAL_NETWORKS.has(url)){
      const link = createElement('a', { classNames: SUPPORTED_SOCIAL_NETWORKS.get(url)})
      link.href = contact;
      return link;
    };
  });
  return linksArray;
}