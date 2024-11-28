// importacion del diccionario 
import { dictionary } from "./dictionary.js"

// la constante del contenedor principal de las cartas en global 
const container = document.createElement('div');
container.classList.add('Cart-C'); // la clase del contenedor

// la funcion para crear las cartas 
const makeDictionary = (object, selectedLanguage) => {
    // segundo contenedor 
    const Cartacontainer = document.createElement('div');
    Cartacontainer.classList.add('carta'); //la clase del segundo contenedor
    // tercer contenedor 
    const Cardcontainer = document.createElement('div');
    Cardcontainer.classList.add('card'); //la clase del tercer contenedor
    // cuarto contenedor 
    const CardFrontcontainer = document.createElement('div');
    CardFrontcontainer.classList.add('faceFront'); // la clase del cuarto contenedor
    CardFrontcontainer.id = "face_front"; // el id del cuarto contenedor
    // la imagen 
    const imgContainer = document.createElement('img'); 
    imgContainer.src = object.image || ""; // Usar una imagen por defecto si no existe
    imgContainer.classList.add('img');  // la clase de la imagen
    imgContainer.alt = "image"; // el alt o nombre de referencia de la imagen
    // el titulo de la carta por fuera
    const nameContainer = document.createElement('h2');
    // bifurcasion para elegir entre idiomas 
    if (selectedLanguage === 'Español') {
        // cambiar el titulo de afuera q esta en español a ingles eligiendo este camino 
        nameContainer.textContent = object.english; // Mostrar en español si el idioma seleccionado es en ingles
    } else {
        // cambiar el titulo de afuera q esta en ingles a español eligiento este camino 
        nameContainer.textContent = object.spanish; // Mostrar en inglés si el idioma seleccionado es español
    }
    // quinto contenedor 
    const CardBackcontainer = document.createElement('div');
    CardBackcontainer.classList.add('faceBack'); // la clase del quinto contenedor
    CardBackcontainer.id = "face_back"; // el id del quinto contenedor
    // el titulo de la carta por dentro
    const name2Container = document.createElement('h3');
    if (selectedLanguage === 'Español') {
          // cambiar el titulo de adentro q esta en ingles a español eligiendo este camino 
        name2Container.textContent = object.spanish; // Mostrar en español el titulo de adentro
    } else {
        // cambiar el titulo de adentro q esta en español a ingles eligiento este camino 
        name2Container.textContent = object.english; // Mostrar en inglés el titulo de adentro
    }
    // parrafo de ejemplo 
    const TextContainer = document.createElement('p');
    TextContainer.textContent = object.example; // agregar el texto contenido en el dictionary

    // agregamos los items al contenedor principal 
    container.appendChild(Cartacontainer);
    Cartacontainer.appendChild(Cardcontainer);
    Cardcontainer.appendChild(CardFrontcontainer);
    Cardcontainer.appendChild(CardBackcontainer);
    CardFrontcontainer.appendChild(imgContainer);
    CardFrontcontainer.appendChild(nameContainer);
    CardBackcontainer.appendChild(name2Container);
    CardBackcontainer.appendChild(TextContainer);
    // seleccionamos donde queremos q las cartas aparescan
    document.querySelector('main').appendChild(container);
}

// funcion para imprimir las cartas 
function allCarts(sortedData = null, selectedLanguage = "Español") {
    container.innerHTML = ""; // Limpia el contenedor

    // Obtener las categorías filtradas o el diccionario completo
    const categories = sortedData || dictionary.categories;

    for (let category in categories) {
        // Aplicar el filtro de categoría si está seleccionado
        if (currentCategory && currentCategory !== category) continue;

        let words = categories[category];

        // Ordenar palabras según el orden seleccionado
        if (currentOrder === "A-Z") {
            words = words.sort((a, b) => a.spanish.localeCompare(b.spanish));
        } else if (currentOrder === "Z-A") {
            words = words.sort((a, b) => b.spanish.localeCompare(a.spanish));
        }

        // Crear cartas para cada palabra en la categoría
        for (let i = 0; i < words.length; i++) {
            makeDictionary(words[i], selectedLanguage);
        }
    }

    // Mostrar las cartas en el contenedor principal
    document.querySelector('main').appendChild(container);
}


// Variables globales para el filtro actual
let currentCategory = ""; // ""crea la variable todas las categorías
let currentOrder = ""; // "" crea la variable sin orden específico

// Función para actualizar y mostrar las cartas según filtro y orden
const updateCarts = () => {
    let filteredDictionary = {};

    // Aplicar el filtro de categoría
    if (currentCategory) {
        filteredDictionary[currentCategory] = dictionary.categories[currentCategory] || [];
    } else {
        filteredDictionary = dictionary.categories;
    }

    // Llamar a `allCarts` con el diccionario filtrado
    allCarts(filteredDictionary, "Español");
};

// Función flecha para manejar selección de categoría
const filterCategory = (categoryName) => { // selecciona el nombre de la categoria 
    if (dictionary.categories[categoryName] || categoryName === '') { // en el diccionario con sus categorias seleciona la categoria del nombre q elijimos
        currentCategory = categoryName; // Actualiza la categoría seleccionada
        updateCarts(); // Llama a la función para actualizar las cartas
    } else {
        // nos dice si existe o no la categoria
        console.error(`La categoría "${categoryName}" no existe.`);
    }
};

// Escuchar clics en los botones de categorías
document.querySelectorAll('.category-btn').forEach(button => { // funcion flecha del clickeo de las categorias
    button.addEventListener('click', () => { // evento de clickear las categorias
        const categoryName = button.getAttribute('data-category'); // elije el atributo data category
        filterCategory(categoryName); // filtro por el nombre de la categoria
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
    const searchInput = document.querySelector('#buscar').value.toLowerCase(); // creamos la constante buscar el input seleccionando el input existente de buscar con su id
    // y hacemos q se vuelta minuscula si esta en mayuscula
    // Obtener el valor del radio seleccionado (español o inglés)
    const selectedLanguage = document.querySelector('input[name="Traducir"]:checked')?.id; // crea la constante seleccionar el lenguaje y selecciona el input español o ingles 
    // si no seleccionamos nada sale un alert
    if (!selectedLanguage) {
        alert('Por favor, seleccione un idioma para buscar.');
        return;
    }

    // Filtrar las palabras de cada categoría
    let filteredDictionary = {}; // Crear un nuevo objeto para las categorías filtradas

    for (let category in dictionary.categories) { // crea la variable categoria en el diccionario con las categorias
        // Filtrar las palabras dentro de la categoría según el idioma seleccionado
        const filteredWords = dictionary.categories[category].filter(word => { // crea la constante filtrar palabras que es igual el diccionario con las categorias
            // Y llama una categoria y usa la funcion filtrar para buscar la palabra con un parametro llamado word - palabra
            if (selectedLanguage === 'Español') { // coge el camino de seleccionar el lenguaje español
                return word.spanish.toLowerCase().includes(searchInput); // busca la palabra en español con una funcion donde asi alla mayusculas sale todo en minuscula y incluye
                // el buscador de input
            } else if (selectedLanguage === 'Ingles') { // coge el camino de seleccionar el lenguaje ingles
                return word.english.toLowerCase().includes(searchInput); // busca la palabra en ingles con una funcion donde asi alla mayusculas sale todo en minuscula y incluye
                // el buscador de input
            }
            return false; // No filtra si no hay un idioma seleccionado
        });

        // Solo agregar categorías que tienen resultados
        if (filteredWords.length > 0) { // en el filtro de palabras busca si la pocision es mayor a 0 haber si existe
            filteredDictionary[category] = filteredWords; // en el filtro diccionario elejimos una categoria que es igual al filtro de palabras para selecionar solo si existen las
            // categorias
        }
    }

    // Si no se encuentra ninguna palabra, mostrar un mensaje de alerta
    if (Object.keys(filteredDictionary).length === 0) { // elije un objeto de el diccionario con su pocision
        alert('No existen resultados para la búsqueda'); // alerta de q no existe la palabra buscada
    }

    // Llamar a la función allCarts con los resultados filtrados
    allCarts(filteredDictionary, selectedLanguage); 
}
// Añadir evento al botón de "Traducir"
document.getElementById('Traducir').addEventListener('click', filterDictionary); // el boton para q busquemos y traduscamos la palabra

// Seleccionar los elementos del DOM
const addWordButton = document.getElementById('add-word-button');
const addWordModal = document.getElementById('add-word-modal');
const closeModalButton = document.getElementById('close-modal');
const addWordForm = document.getElementById('add-word-form');

// Mostrar el modal al hacer clic en el botón "Agregar Palabra"
addWordButton.addEventListener('click', () => {
    addWordModal.style.display = 'flex'; // Muestra el modal
});

// Ocultar el modal al hacer clic en "Cancelar"
closeModalButton.addEventListener('click', () => {
    addWordModal.style.display = 'none'; // Oculta el modal
});

// Función para agregar la palabra
const addWord = (event) => {
    event.preventDefault(); // Prevenir la recarga de la página

    // Obtener los valores del formulario
    const spanish = document.getElementById('spanish').value.trim();
    const english = document.getElementById('english').value.trim();
    const description = document.getElementById('description').value.trim();
    const imageInput = document.getElementById('image');
    const selectedCategory = document.querySelector('input[name="category"]:checked');

    if (selectedCategory && spanish && english && description) {
        const categoryValue = selectedCategory.value;

        // Manejar la imagen
        let imageUrl = null;
        if (imageInput.files.length > 0) {
            const file = imageInput.files[0];
            imageUrl = URL.createObjectURL(file); // Genera una URL temporal para la imagen
        }

        // Crear el nuevo objeto palabra
        const newWord = {
            spanish: spanish,
            english: english,
            example: description,
            image: imageUrl, // Guardar la URL de la imagen
        };

        // Agregar la palabra a la categoría correspondiente
        if (!dictionary.categories[categoryValue]) {
            dictionary.categories[categoryValue] = []; // Crear la categoría si no existe
        }
        dictionary.categories[categoryValue].push(newWord);

        // Limpiar y cerrar el formulario después de agregar la palabra
        addWordForm.reset();
        addWordModal.style.display = 'none'; // Oculta el modal

        // Actualizar las cartas en la interfaz
        updateCarts();

        alert('¡Palabra e imagen agregadas con éxito!');
    } else {
        alert('Por favor, completa todos los campos y selecciona una categoría.');
    }
};
// Asociar la función `addWord` al evento submit del formulario
addWordForm.addEventListener('submit', addWord);

document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', () => {
        currentCategory = button.getAttribute('data-category') || ""; // Actualiza la categoría seleccionada
        updateCarts(); // Refresca las cartas
    });
});
document.getElementById('order-select').addEventListener('change', (event) => {
    currentOrder = event.target.value; // Actualiza el orden seleccionado
    updateCarts(); // Refresca las cartas
});
window.addEventListener("DOMContentLoaded", () => {
    allCarts(); // Mostrar todas las cartas inicialmente
});

allCarts() // llama la funcion imprimir cartas

