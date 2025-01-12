document.addEventListener('DOMContentLoaded', () => {
    const movie = JSON.parse(localStorage.getItem('movieToEdit'));

    if (!movie) {
        alert("Filmgegevens niet gevonden!");
        return;
    }

    // Formulier elementen
    const movieTitleInput = document.getElementById('movie-title');
    const movieGenreInput = document.getElementById('movie-genre');
    const movieYearInput = document.getElementById('movie-year');
    const movieTypeSelect = document.getElementById('movie-type');
    const addMovieForm = document.getElementById('edit-movie-form');
    const yearContainer = document.getElementById('year-container');
    const seriesContainer = document.getElementById('series-container');
    const imageTypeSelect = document.getElementById('image-type');
    const imageUrlInput = document.getElementById('image-url');
    const imageFileInput = document.getElementById('image-file');
    const seasonsInput = document.getElementById('seasons');
    const episodesInput = document.getElementById('episodes');

    // Controle
    if (!addMovieForm) {
        console.error('Formulier niet gevonden!');
        return;
    }

    // Gegevens van de film/serie
    movieTitleInput.value = movie.title;
    movieGenreInput.value = movie.genre;
    movieYearInput.value = movie.year || '';
    movieTypeSelect.value = movie.type;

    // Afbeeldingsveld op basis van het type
    if (movie.image) {
        if (movie.image.startsWith('http')) {
            imageTypeSelect.value = 'url';
            imageUrlInput.value = movie.image;
            imageUrlInput.disabled = false;
            imageFileInput.disabled = true;
        } else {
            imageTypeSelect.value = 'file';
            imageFileInput.disabled = false;
            imageUrlInput.disabled = true;
        }
    }

    // Toon of verberg velden afhankelijk van het type film (movie of serie)
    function updateFormBasedOnType() {
        if (movieTypeSelect.value === 'serie') {
            yearContainer.style.display = 'none'; // Verberg jaar voor series
            seriesContainer.style.display = 'block'; // Toon seizoenen en afleveringen voor series
            movieYearInput.removeAttribute('required'); // Verwijder verplicht voor jaar bij series
        } else {
            yearContainer.style.display = 'block'; // Toon jaar voor films
            seriesContainer.style.display = 'none'; // Verberg seizoenen en afleveringen voor films
            movieYearInput.setAttribute('required', 'true'); // Jaar is verplicht bij films
        }
    }

    // Afbeeldingsvelden in- of uitschakelen op basis van de keuze (url of bestand)
    function toggleImageFields() {
        if (imageTypeSelect.value === 'url') {
            imageUrlInput.disabled = false;
            imageFileInput.disabled = true;
        } else if (imageTypeSelect.value === 'file') {
            imageUrlInput.disabled = true;
            imageFileInput.disabled = false;
        }
    }

    movieTypeSelect.addEventListener('change', () => {
        updateFormBasedOnType();
    });

    imageTypeSelect.addEventListener('change', () => {
        toggleImageFields();
    });

    updateFormBasedOnType();
    toggleImageFields();

    addMovieForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Verplichte velden
        if (!movieTitleInput.value || !movieGenreInput.value) {
            alert('Vul alle velden in.');
            return;
        }

        const updatedMovie = {
            title: movieTitleInput.value,
            genre: movieGenreInput.value,
            image: imageTypeSelect.value === 'url' ? imageUrlInput.value : imageFileInput.files[0],
            type: movieTypeSelect.value,
            watched: movie.watched
        };

        if (movieTypeSelect.value === 'movie') {
            const movieYear = parseInt(movieYearInput.value);
            if (isNaN(movieYear) || movieYear < 1900 || movieYear > 2025) {
                alert("Vul een geldig jaartal in.");
                return;
            }
            updatedMovie.year = movieYear;
        } else {
            // Voor series, seizoenen en afleveringen
            const seasons = parseInt(seasonsInput.value);
            const episodes = parseInt(episodesInput.value);

            if (seasons && episodes) {
                if (isNaN(seasons) || isNaN(episodes) || seasons < 1 || episodes < 1) {
                    alert("Vul geldige seizoenen en afleveringen in.");
                    return;
                }
                updatedMovie.seasons = seasons;
                updatedMovie.episodes = episodes;
            }
        }

        // Werk de film/serie bij in localStorage
        let movies = JSON.parse(localStorage.getItem('movies')) || [];
        const movieIndex = movies.findIndex(m => m.title === movie.title);
        if (movieIndex !== -1) {
            movies[movieIndex] = updatedMovie;
            localStorage.setItem('movies', JSON.stringify(movies));
        }

        // Reset formulier en ga terug naar de hoofdpagina
        addMovieForm.reset();
        updateFormBasedOnType();
        toggleImageFields();
        window.location.href = 'index.html';  // Redirect naar de hoofdpagina
    });
});
