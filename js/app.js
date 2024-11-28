import { dictionary } from "./dictionary.js"

const container = document.createElement('div');
container.classList.add('Cart-C'); // Asegúrate de que esta clase se añade al contenedor

const makeCountry = (object, selectedLanguage) => {
    const Cartacontainer = document.createElement('div');
    Cartacontainer.classList.add('carta');

    const Cardcontainer = document.createElement('div');
    Cardcontainer.classList.add('card');

    const CardFrontcontainer = document.createElement('div');
    CardFrontcontainer.classList.add('faceFront');
    CardFrontcontainer.id = "face_front";

    const imgContainer = document.createElement('img');
    imgContainer.src = object.image || ""; // Usar una imagen por defecto si no existe
    imgContainer.classList.add('img');
    imgContainer.alt = "image";

    const nameContainer = document.createElement('h2');
    if (selectedLanguage === 'Español') {
        nameContainer.textContent = object.spanish; // Mostrar en español si el idioma seleccionado es español
    } else {
        nameContainer.textContent = object.english; // Mostrar en inglés si el idioma seleccionado es inglés
    }

    const CardBackcontainer = document.createElement('div');
    CardBackcontainer.classList.add('faceBack');
    CardBackcontainer.id = "face_back";

    const name2Container = document.createElement('h3');
    if (selectedLanguage === 'Español') {
        name2Container.textContent = object.english; // Mostrar en inglés en la parte de atrás si se busca en español
    } else {
        name2Container.textContent = object.spanish; // Mostrar en español en la parte de atrás si se busca en inglés
    }

    const TextContainer = document.createElement('p');
    TextContainer.textContent = object.example;

    container.appendChild(Cartacontainer);
    Cartacontainer.appendChild(Cardcontainer);
    Cardcontainer.appendChild(CardFrontcontainer);
    Cardcontainer.appendChild(CardBackcontainer);
    CardFrontcontainer.appendChild(imgContainer);
    CardFrontcontainer.appendChild(nameContainer);
    CardBackcontainer.appendChild(name2Container);
    CardBackcontainer.appendChild(TextContainer);

    document.querySelector('main').appendChild(container);
}


function allCarts(sortedData = null, selectedLanguage) {
    container.innerHTML = ""; // Limpiar el contenedor antes de agregar nuevas cartas

    const categories = sortedData || dictionary.categories; // Si hay datos ordenados, usarlos

    for (let category in categories) {
        const words = categories[category];

        for (let i = 0; i < words.length; i++) {
            makeCountry(words[i], selectedLanguage); // Pasar el idioma seleccionado
        }
    }
}


// Variables globales para el filtro actual
let currentCategory = ""; // "" significa todas las categorías
let currentOrder = ""; // "" significa sin orden específico

// Función para actualizar y mostrar las cartas según filtro y orden
const updateCarts = () => {
    let filteredData = dictionary.categories;

    // Filtrar por categoría
    if (currentCategory && dictionary.categories[currentCategory]) {
        filteredData = { [currentCategory]: dictionary.categories[currentCategory] };
    }

    // Ordenar las palabras en cada categoría
    if (currentOrder) {
        const sortedData = JSON.parse(JSON.stringify(filteredData));
        for (let category in sortedData) {
            sortedData[category].sort((a, b) => {
                if (currentOrder === "A-Z") {
                    return a.spanish.localeCompare(b.spanish);
                } else if (currentOrder === "Z-A") {
                    return b.spanish.localeCompare(a.spanish);
                }
            });
        }
        filteredData = sortedData;
    }

    // Mostrar las cartas con los datos procesados
    allCarts(filteredData);
};

// Función flecha para manejar selección de categoría
const filterCategory = (categoryName) => {
    if (dictionary.categories[categoryName] || categoryName === '') {
        currentCategory = categoryName; // Actualiza la categoría seleccionada
        updateCarts(); // Llama a la función para actualizar las cartas
    } else {
        console.error(`La categoría "${categoryName}" no existe.`);
    }
};

// Escuchar clics en los botones de categorías
document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', () => {
        const categoryName = button.getAttribute('data-category');
        filterCategory(categoryName);
    });
});

// Escuchar cambios en el select de orden
document.getElementById('order-select').addEventListener('change', (event) => {
    currentOrder = event.target.value; // Actualiza el orden seleccionado
    updateCarts(); // Llama a la función para actualizar las cartas
});

// Llamar a la función inicial cuando cargue el DOM
window.addEventListener("DOMContentLoaded", () => {
    allCarts(); // Muestra todas las cartas al inicio
});

const filterDictionary = () => {
    // Obtener el texto de búsqueda y convertirlo a minúsculas para evitar problemas de sensibilidad
    const searchInput = document.querySelector('#buscar').value.toLowerCase();

    // Obtener el valor del radio seleccionado (español o inglés)
    const selectedLanguage = document.querySelector('input[name="Traducir"]:checked')?.id;

    if (!selectedLanguage) {
        alert('Por favor, seleccione un idioma para buscar.');
        return;
    }

    // Filtrar las palabras de cada categoría
    let filteredDictionary = {}; // Crear un nuevo objeto para las categorías filtradas

    for (let category in dictionary.categories) {
        // Filtrar las palabras dentro de la categoría según el idioma seleccionado
        const filteredWords = dictionary.categories[category].filter(word => {
            if (selectedLanguage === 'Español') {
                return word.spanish.toLowerCase().includes(searchInput); // Filtrar por español
            } else if (selectedLanguage === 'Ingles') {
                return word.english.toLowerCase().includes(searchInput); // Filtrar por inglés
            }
            return false; // No filtrar si no hay un idioma seleccionado
        });

        // Solo agregar categorías que tienen resultados
        if (filteredWords.length > 0) {
            filteredDictionary[category] = filteredWords;
        }
    }

    // Si no se encuentra ninguna palabra, mostrar un mensaje de alerta
    if (Object.keys(filteredDictionary).length === 0) {
        alert('No existen resultados para la búsqueda');
    }

    // Llamar a la función allCarts con los resultados filtrados
    allCarts(filteredDictionary, selectedLanguage);
}


// Añadir evento al botón de "Traducir"
document.getElementById('Traducir').addEventListener('click', filterDictionary);

allCarts()

