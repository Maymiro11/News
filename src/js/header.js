import axios from 'axios';

function updateDateTime() {
    const datetimeElem = document.getElementById('datetime');
    const now = new Date();
    datetimeElem.textContent = now.toLocaleString('uk-UA');
}

setInterval(updateDateTime, 60000); // Оновлення кожну хвилину

window.onload = function() {
    updateDateTime();
};
/*------------------------------------------------------------*/
            //про всяк випадок))
            //'X-RapidAPI-Key': 'lBp7LWFNtxgQl7GMexTziOoDiH4llbEN',
            //'X-RapidAPI-Host': 'AccuWeatherstefan-skliarovV1.p.rapidapi.com'
/*___________________________________________________________*/

const apiKey = 'lBp7LWFNtxgQl7GMexTziOoDiH4llbEN';

async function getLocationKey(latitude, longitude) {
    const apiKey = 'lBp7LWFNtxgQl7GMexTziOoDiH4llbEN';
    const url = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${apiKey}&q=${latitude},${longitude}`;

    try {
        const response = await axios.get(url);
        if (response.data && response.data.Key) {
            return response.data.Key;
        } else {
            throw new Error('Не вдалося отримати ключ розташування');
        }
    } catch (error) {
        console.error('Помилка отримання ключа розташування:', error);
        return null;
    }
}

// Отримання геолокації користувача
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    resolve({ latitude, longitude });
                },
                error => {
                    reject('Помилка отримання геолокації');
                }
            );
        } else {
            reject('Геолокація не підтримується вашим браузером');
        }
    });
}

// Отримання і відображення погоди
async function updateWeather() {
    const apiKey = 'lBp7LWFNtxgQl7GMexTziOoDiH4llbEN';
    const weatherElem = document.getElementById('weather');
    try {
        // Отримання геолокації користувача
        const { latitude, longitude } = await getUserLocation();
        
        // Отримання ключа розташування за координатами
        const locationKey = await getLocationKey(latitude, longitude);

        // Запит погоди за отриманим ключем розташування
        const weatherUrl = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;
        const response = await axios.get(weatherUrl);

        // Відображення погодних даних на сторінці
        const city = response.data[0].LocalizedName;
        const temperature = response.data.temperature;
        const description = response.data.description;

        weatherElem.textContent = `Погода у місті ${city}: ${temperature}°C, ${weatherText}`;
    } catch (error) {
        console.error('Помилка отримання погоди:', error);
        weatherElem.textContent = 'Погода: неможливо отримати дані';
    }
}

// Виклик функції оновлення погоди при завантаженні сторінки
updateWeather();