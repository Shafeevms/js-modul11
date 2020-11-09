'use strict';
const store = {
    starships: [],
    planets: [],
    people: [],
    currentTitle: null,
};
// функция рендерит заголовок, поле для ввода и список элементов

function inputRender(category) {    
    let htmlString = `<h3 class="block__title">${category}</h3>
                <input class="block__input" type="text">
                <button class="block__btn">Найти</button>
                <ul class="block__list"></ul>`
    document.querySelector('.block').innerHTML = htmlString;
}


           
// запрашивает и получает список данных с сервера по категории запроса 
// разобраться как считать количество страниц в категории..
function requestTitle(name) {
    // for(let count = 1; count < 10; count++) {
    //     fetch(`https://swapi.dev/api/${name}/?page=${count}`)
    //       .then(resp => resp.json())
    //       .then(json => {
    //         const {results } = json;
    //         results.forEach(element => {
    //             let li = document.createElement('li');
    //             li.textContent = element.name;
    //             li.classList.add('block__item');
    //             li.dataset.url = element.url;
    //             document.querySelector('.block__list').append(li);
    //         })
    //     })      
    // }
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
                store[name] =[...store[name],...results];
            })
        })
                
    }
            


document.body.addEventListener('click', function(e){
    let target = e.target;
    let parent = target.parentNode;
    let url = e.target.getAttribute('data-url');
    const name = target.getAttribute('data-name');
    

    if(target.classList.contains('nav__title')) {
        inputRender(target.textContent);

        requestTitle(name)
            .then(() => {
                renderView(name);
                store.currentTitle = name;
            })



    }
    if (target.classList.contains('block__item')) {
        itemDetailsRender(url)
    }
    if (target.classList.contains('block__btn')) {
        const element = store[store.currentTitle].find(item => item.name === parent.querySelector('.block__input').value)
        itemDetailsRender(element.url);
        
    }
        
});

// функция по нажатию на элемент выдаёт детальную информацию
function itemDetailsRender(url) {
    fetch(url)
      .then(resp => (resp.json()))
      .then(json => {
        const {
            name, 
            height, 
            mass, 
            gender, 
            homeworld, 
            starships,
            model,
            manufacturer,
            length,
            cargo_capacity: capacity,
            starship_class: starshipClass,
            diameter,
            climate,
            terrain,
            population,
            gravity

        } = json;
        
            let personHtml = `<article class="article article-person">
                                <h3 class="block__title">${name}</h3>
                                <ul class="">
                                    <li><span class="block__description">Рост:</span><span class="block__responce">${height}</span></li>
                                    <li><span class="block__description">Вес:</span><span class="block__responce">${mass}</span></li>
                                    <li><span class="block__description">Пол:</span><span class="block__responce">${gender}</span></li>
                                    <li><span class="block__description">Место рождения:</span><span class="block__responce">${homeworld}</span></li>
                                    <li><span class="block__description">Корабли:</span><span class="block__responce">${starships}</span></li>
                                </ul>
                                </article>`

            let starShipHtml = `<article class="article article-person">
                                <h3 class="block__title">${name}</h3>
                                <ul class="">
                                    <li><span class="block__description">Модель:</span><span class="block__responce">${model}</span></li>
                                    <li><span class="block__description">Изготовитель:</span><span class="block__responce">${manufacturer}</span></li>
                                    <li><span class="block__description">Длина:</span><span class="block__responce">${length}</span></li>
                                    <li><span class="block__description">Вместительность:</span><span class="block__responce">${capacity}</span></li>
                                    <li><span class="block__description">Класс судна:</span><span class="block__responce">${starshipClass}</span></li>
                                </ul>
                            </article>`
            let planetHtlm = `<article class="article article-person">
                                <h3 class="block__title">${name}</h3>
                                <ul class="">
                                    <li><span class="block__description">Диаметр:</span><span class="block__responce">${diameter}</span></li>
                                    <li><span class="block__description">Климат:</span><span class="block__responce">${climate}</span></li>
                                    <li><span class="block__description">Гравитация:</span><span class="block__responce">${gravity}</span></li>
                                    <li><span class="block__description">Местность:</span><span class="block__responce">${terrain}</span></li>
                                    <li><span class="block__description">Популяция:</span><span class="block__responce">${population}</span></li>
                                </ul>
                            </article>`
        if (url.includes('people')) {
            document.querySelector('.block').innerHTML = personHtml;
        } else if (url.includes('starships')) {
            document.querySelector('.block').innerHTML = starShipHtml;
        } else if (url.includes('planets')) {
            document.querySelector('.block').innerHTML = planetHtlm;
        }


      })


}

function renderView(name) {
    store[name].forEach(element => {
        let li = document.createElement('li');
        li.textContent = element.name;
        li.classList.add('block__item');
        li.dataset.url = element.url;
        document.querySelector('.block__list').append(li);

    })

   
}
// разобраться с максимальным значением счетчика

// разбраться с отсылкой на название планеты у person и массивом кораблей