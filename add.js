const movieTitleInput = document.getElementById('movie-title');
const movieGenreInput = document.getElementById('movie-genre');
const movieYearInput = document.getElementById('movie-year');
const movieTypeSelect = document.getElementById('movie-type');
const addMovieForm = document.getElementById('add-movie-form');
const yearContainer = document.getElementById('year-container');
const seriesContainer = document.getElementById('series-container');

const imageTypeSelect = document.getElementById('image-type');
const imageUrlInput = document.getElementById('image-url');
const imageFileInput = document.getElementById('image-file');
document.addEventListener('DOMContentLoaded', () => {

    // Update form display based on movie type (movie or series)
    function updateFormBasedOnType() {
        if (movieTypeSelect.value === 'serie') {
            yearContainer.style.display = 'none'; // Hide year for series
            seriesContainer.style.display = 'block'; // Show seasons and episodes for series
            movieYearInput.removeAttribute('required'); // Remove required for year input when adding a series
        } else {
            yearContainer.style.display = 'block'; // Show year for movies
            seriesContainer.style.display = 'none'; // Hide seasons and episodes for movies
            movieYearInput.setAttribute('required', 'true'); // Make year input required for movies
        }
    }

    // Toggle image input fields based on image type selection
    function toggleImageFields() {
        if (imageTypeSelect.value === 'url') {
            imageUrlInput.disabled = false;
            imageFileInput.disabled = true;
        } else if (imageTypeSelect.value === 'file') {
            imageUrlInput.disabled = true;
            imageFileInput.disabled = false;
        }
    }

    // Call the functions on page load
    imageTypeSelect.addEventListener('change', toggleImageFields);
    movieTypeSelect.addEventListener('change', updateFormBasedOnType);

    // Add movie/serie to the localStorage
    function addMovie(event) {
        event.preventDefault(); // Prevent form from submitting normally

        // Validate required fields
        if (!movieTitleInput.value || !movieGenreInput.value) {
            alert('Vul alle velden in.');
            return;
        }

        const newMovie = {
            title: movieTitleInput.value,
            genre: movieGenreInput.value,
            image: imageTypeSelect.value === 'url' ? imageUrlInput.value : imageFileInput.files[0],
            type: movieTypeSelect.value,
            watched: false
        };

        if (movieTypeSelect.value === 'movie') {
            const movieYear = parseInt(movieYearInput.value);
            if (isNaN(movieYear) || movieYear < 1900 || movieYear > 2025) {
                alert("Vul een geldig jaartal in.");
                return;
            }
            newMovie.year = movieYear;
        } else {
            // For series, make seasons and episodes optional
            const seasons = parseInt(document.getElementById('seasons').value);
            const episodes = parseInt(document.getElementById('episodes').value);
    
            // Only add seasons and episodes if they are provided and valid
            if (seasons && episodes) {
                if (isNaN(seasons) || isNaN(episodes) || seasons < 1 || episodes < 1) {
                    alert("Vul geldige seizoenen en afleveringen in.");
                    return;
                }
                newMovie.seasons = seasons;
                newMovie.episodes = episodes;
            }
        }

        // Check if image is valid
        //if (!newMovie.image) {
          //  alert("Kies een afbeelding.");
            //return;
        //}

        // Save to localStorage
        let movies = JSON.parse(localStorage.getItem('movies')) || [];
        movies.push(newMovie);
        localStorage.setItem('movies', JSON.stringify(movies));

        // Reset form and update display
        addMovieForm.reset();
        updateFormBasedOnType();
        toggleImageFields();
    }

    addMovieForm.addEventListener('submit', addMovie);

    // Initialize form display
    updateFormBasedOnType();
    toggleImageFields();
});
