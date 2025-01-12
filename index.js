document.addEventListener('DOMContentLoaded', () => {
    const movieList = document.getElementById('movie-list');
    const viewedMovieList = document.getElementById('viewed-movie-list');
    const filterTypeSelect = document.getElementById('filter-type');
    const filterGenreSelect = document.getElementById('filter-genre');
    const movieListTitle = document.getElementById('movie-list-title');
    const viewedMoviesTitle = document.getElementById('viewed-movie-list-title');
    
    let movies = JSON.parse(localStorage.getItem('movies')) || [];

    // Functie om genres dynamisch toe te voegen aan de filter
    function populateGenres() {
        const genres = [...new Set(movies.map(movie => movie.genre))]; // Haal unieke genres op
        filterGenreSelect.innerHTML = '<option value="all">Alle Genres</option>'; // Voeg een 'Alle Genres' optie toe

        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            filterGenreSelect.appendChild(option);
        });
    }

    // Function to render movies (both watched and unwatched)
    function renderMovies() {
        movieList.innerHTML = '';

        const filterType = filterTypeSelect.value;
        const filterGenre = filterGenreSelect.value;

        const filteredMovies = movies.filter(movie => {
            const matchesType = filterType === 'all' || movie.type === filterType;
            const matchesGenre = filterGenre === 'all' || movie.genre === filterGenre;
            return matchesType && matchesGenre && !movie.watched;
        });

        if (filterType === 'all') {
            movieListTitle.textContent = 'Te Kijken Films en Series';
        } else if (filterType === 'movie') {
            movieListTitle.textContent = 'Te Kijken Films';
        } else if (filterType === 'serie') {
            movieListTitle.textContent = 'Te Kijken Series';
        }

        filteredMovies.forEach((movie, index) => {
            const li = document.createElement('li');
            const imageSrc = movie.image ? movie.image : (movie.type === 'movie' ? 'img/default-movie.jpg' : 'img/default-serie.jpg');
            const img = `<img src="${imageSrc}" alt="${movie.title}">`;

            // Generating the info for the overlay
            let movieInfo = '';
            if (movie.type === 'movie') {
                movieInfo = `<span class="item">${movie.year}</span>`;
            } else if (movie.type === 'serie') {
                movieInfo = `<span class="item eps" style="background-color: orange;">SS ${movie.seasons} / EPS ${movie.episodes}</span>`;
            }

            li.innerHTML = `
                <button class="delete-btn">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
                <button class="mark-watched-btn">
                    <i class="fa-regular fa-eye"></i>
                </button>
                <button class="edit-btn">
                    <i class="fa-solid fa-pencil-alt"></i>
                </button>
                <div class="thumbnail">${img}</div>
                <div class="overlay">
                    <h3>${movie.title}</h3>
                    <div class="info" style="justify-content: ${movie.type === 'serie' ? 'space-between' : 'flex-start'};">
                        <span class="item">${movie.type}</span>
                        ${movieInfo}
                    </div>
                </div>
            `;

            const deleteButton = li.querySelector('.delete-btn');
            deleteButton.addEventListener('click', () => deleteMovie(movie));

            const markWatchedButton = li.querySelector('.mark-watched-btn');
            markWatchedButton.addEventListener('click', () => markAsWatched(movie));

            const editButton = li.querySelector('.edit-btn');
            editButton.addEventListener('click', () => editMovie(index));

            movieList.appendChild(li);
        });
    }


    // Functie om de bekeken films/series te renderen
    function renderViewedMovies() {
        viewedMovieList.innerHTML = ''; // Maak de lijst leeg voor een nieuwe weergave
    
        const viewedMovies = movies.filter(movie => movie.watched); // Filter films die als bekeken zijn gemarkeerd

        if (viewedMovies.length === 0) {
            viewedMoviesTitle.textContent = 'Geen bekeken films/series';
        } else {
            viewedMoviesTitle.textContent = 'Bekeken Films en Series';
        }

        viewedMovies.forEach((movie) => {
            const li = document.createElement('li');
            const imageSrc = movie.image ? movie.image : (movie.type === 'movie' ? 'img/default-movie.jpg' : 'img/default-serie.jpg');
            const img = `<img src="${imageSrc}" alt="${movie.title}">`;

            // Generating the info for the overlay
            let movieInfo = '';
            if (movie.type === 'movie') {
                movieInfo = `<span class="item">${movie.year}</span>`;
            } else if (movie.type === 'serie') {
                console.log('Adding eps class');
                movieInfo = `<span class="item eps";">SS ${movie.seasons} / EPS ${movie.episodes}</span>`;
            }
            console.log(movieInfo);  // Check if the generated HTML is correct

            li.innerHTML = `
                <button class="delete-btn">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
                <button class="mark-watched-btn">
                    <i class="fa-regular ${movie.watched ? 'fa-eye-slash' : 'fa-eye'}"></i>
                </button>
                <div class="thumbnail">${img}</div>
                <div class="overlay">
                    <h3>${movie.title}</h3>
                    <div class="info" style="justify-content: ${movie.type === 'serie' ? 'space-between' : 'flex-start'};">
                        <span class="item">${movie.type}</span>
                        ${movieInfo}
                    </div>
                </div>
            `;

            const deleteButton = li.querySelector('.delete-btn');
            deleteButton.addEventListener('click', () => deleteMovie(movie));

            const markWatchedButton = li.querySelector('.mark-watched-btn');
            markWatchedButton.addEventListener('click', () => markAsWatched(movie));

            viewedMovieList.appendChild(li);
        });
    }


    // Functie om een film/serie te verwijderen
    function deleteMovie(movieToDelete) {
        movies = movies.filter(movie => movie !== movieToDelete); // Verwijder de geselecteerde film
        localStorage.setItem('movies', JSON.stringify(movies)); // Sla de bijgewerkte lijst op
        renderMovies();
        renderViewedMovies();
    }

    function editMovie(index) {
        const movie = movies[index];
        
        // Save the index or movie data to localStorage
        localStorage.setItem('movieToEdit', JSON.stringify(movie));
        
        // Redirect to the edit page
        window.location.href = 'edit.html';  // Redirect to edit.html
    }

    // Functie om een film/serie te markeren als bekeken of onbeschouwd
    function markAsWatched(movieToMark) {
        // Toggle the watched status
        movieToMark.watched = !movieToMark.watched; 

        // Save updated movie list to localStorage
        localStorage.setItem('movies', JSON.stringify(movies)); 

        // Re-render both movie and viewed lists
        renderMovies();
        renderViewedMovies();
    }

    // Filter eventlisteners
    filterTypeSelect.addEventListener('change', () => {
        renderMovies();
        renderViewedMovies();
    });
    filterGenreSelect.addEventListener('change', () => {
        renderMovies();
        renderViewedMovies();
    });

    // Laad de films bij het starten van de pagina
    populateGenres();
    renderMovies();
    renderViewedMovies();
});
