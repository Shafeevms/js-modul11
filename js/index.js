'use strict';
const store = {
    starships: [],
    planets: [],
    people: [],
    currentTitle: null,
};
const stringItems = {
    starships: {
        names: ['Модель', 'Изготовитель', 'Длина', 'Вместительность', 'Класс Судна'],
        address: ['model', 'manufacturer', 'length', 'cargo_capacity', 'starship_class'],
    },
    planets: {
        names: ['Диаметр', 'Климат', 'Гравитация', 'Местность', 'Популяция'],
        address: ['diameter', 'climate', 'gravity', 'terrain', 'population']
    },
    people: {
        names: ['Рост', 'Вес', 'Пол', 'Место рождения', 'Корабли'],
        address: ['height', 'mass', 'gender', 'homeworld', 'starships']
    },
}
// функция рендерит заголовок, поле для ввода и список элементов

function inputRender(category) {    
    let htmlString = `<h3 class="block__title">${category}</h3>
                <input class="block__input" type="text">
                <button class="block__btn">Найти</button>
                <ul class="block__list"></ul>`
    document.querySelector('.block').innerHTML = htmlString;
}


           
// запрашивает и получает список данных с сервера по категории запроса и скадывает их в объект store

function requestTitle(name) {
   
    return fetch(`https://swapi.dev/api/${name}/`)
        .then(resp => resp.json())
        .then(json => {
            const {results, count} = json;
            let i = 1;
            let pageCount = 0;
            let requests = [];
            while(i < count) {
                i += results.length;
                pageCount++;
                requests.push(fetch(`https://swapi.dev/api/${name}/?page=${pageCount}`))    
            }
            return Promise.all(requests)
                
        })
        .then(responses => Promise.all(responses.map(r => r.json())))
        .then(json => {
            json.forEach(item => {
                const {results} = item;
                store[name] = [...store[name],...results];
            })
        })
                
    }
            

// Обработчики
document.body.addEventListener('click', function(e){
    let target = e.target;
    let parent = target.parentNode;
    let url = e.target.getAttribute('data-url');
    const name = target.getAttribute('data-name');
    

    if(target.classList.contains('nav__title')) {
        store.starships = [];
        store.people = [];
        store.planets = [];
        document.querySelector('.header').style.backgroundImage = `url("/pics/${target.getAttribute('data-name')}.jpg")`;

        inputRender(target.textContent);

        requestTitle(name)
            .then(() => {
                renderView(name);
                store.currentTitle = name;
            })

    }
    if (target.classList.contains('block__item')) {
        const element = store[store.currentTitle].find(item => item.name === target.textContent);
        itemDetailsRender(element, stringItems, store.currentTitle);
    }
    if (target.classList.contains('block__btn')) {
        const element = store[store.currentTitle].find(item => item.name === parent.querySelector('.block__input').value);
        if(element) {
            itemDetailsRender(element, stringItems, store.currentTitle);
        } else misstake();
        
        
    }
        
});

// функция по нажатию на элемент  и по поиску выдаёт детальную информацию
function itemDetailsRender(element, stringItems, title) {

    let stringHtml = `<article class="article article-person">
                                 <h3 class="block__title">${element.name}</h3>
                                 <ul class="">
                                     <li><span class="block__description">${stringItems[title]['names'][0]}:</span><span class="block__responce">${element[stringItems[title]['address'][0]]}</span></li>
                                     <li><span class="block__description">${stringItems[title]['names'][1]}:</span><span class="block__responce">${element[stringItems[title]['address'][1]]}</span></li>
                                     <li><span class="block__description">${stringItems[title]['names'][2]}:</span><span class="block__responce">${element[stringItems[title]['address'][2]]}</span></li>
                                     <li><span class="block__description">${stringItems[title]['names'][3]}:</span><span class="block__responce">${element[stringItems[title]['address'][3]]}</span></li>
                                     <li><span class="block__description">${stringItems[title]['names'][4]}:</span><span class="block__responce">${element[stringItems[title]['address'][4]]}</span></li>
                                 </ul>
                                 </article>`
    document.querySelector('.block').innerHTML = stringHtml;


}

// функция рендерит список всех элементов
function renderView(name) {
    store[name].forEach(element => {
        let li = document.createElement('li');
        li.textContent = element.name;
        li.classList.add('block__item');
        li.dataset.url = element.url;
        document.querySelector('.block__list').append(li);

    })  
}

// ошибка
function misstake() {
    const misstake = `<div class="block__wrap">
                    <img src="./pics/yoda.jpg" alt="Yoda" class="block__img">
                    <span class="text__misstake">Найдено ничего, раз попробуй ещё!!!</span>
                     </div>`
    document.querySelector('.block').innerHTML = misstake;
}
// разбраться с отсылкой на название планеты у person и массивом кораблей