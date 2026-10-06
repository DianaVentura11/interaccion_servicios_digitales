function iniciarMultimedia() {

    // Clave API de Pixabay
    const API_KEY = '57866645-b5bf31f70baec282d0e2a0abd';

    const video = document.getElementById('main-video');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const videoSelect = document.getElementById('video-select');

    const statStatus = document.getElementById('stat-status');
    const statAuthor = document.getElementById('stat-author');
    const statDuration = document.getElementById('stat-duration');
    const statCurrentTime = document.getElementById('stat-current-time');
    const statResolution = document.getElementById('stat-resolution');
    const statQuality = document.getElementById('stat-quality');

    let currentVideoList = [];


    // Formatear segundos a MM:SS
    function formatTime(seconds) {

        if (isNaN(seconds) || seconds === null) {
            return '00:00';
        }

        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);

        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }


    // Consumir API de Pixabay
    async function searchVideos(query) {

        const searchTerm = query.trim() || 'nature';

        statStatus.textContent = 'Consultando API...';
        searchBtn.disabled = true;

        try {

            const url =
                `https://pixabay.com/api/videos/?key=${API_KEY}&q=${encodeURIComponent(searchTerm)}&per_page=10`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Error en la petición API: ${response.status}`);
            }

            const data = await response.json();

            currentVideoList = data.hits;

            populateVideoSelect(currentVideoList);

        } catch (error) {

            console.error('Error al consumir la API:', error);

            statStatus.textContent = 'Error al cargar datos';

            alert('Error al consultar la API.');

        } finally {

            searchBtn.disabled = false;

        }
    }


    // Mostrar resultados en el select
    function populateVideoSelect(videos) {

        videoSelect.innerHTML = '';

        if (!videos || videos.length === 0) {

            videoSelect.innerHTML =
                '<option value="">No se encontraron resultados</option>';

            videoSelect.disabled = true;

            return;
        }

        videos.forEach((vid, index) => {

            const option = document.createElement('option');

            option.value = index;

            option.textContent =
                `Video #${vid.id} - Por: ${vid.user} (${vid.duration}s)`;

            videoSelect.appendChild(option);

        });

        videoSelect.disabled = false;

        loadVideoFromAPI(0);
    }


    // Cargar video seleccionado
    function loadVideoFromAPI(index) {

        const videoData = currentVideoList[index];

        if (!videoData) {
            return;
        }

        const videoFiles = videoData.videos;

        const selectedFile =
            videoFiles.medium ||
            videoFiles.large ||
            videoFiles.small ||
            videoFiles.tiny;


        video.src = selectedFile.url;

        video.poster =
            `https://i.vimeocdn.com/video/${videoData.picture_id}_640x360.jpg`;


        // Datos obtenidos de la API
        statAuthor.textContent =
            videoData.user || 'Desconocido';

        statQuality.textContent =
            `${selectedFile.width}x${selectedFile.height}`;

        statStatus.textContent =
            'Cargado';
    }


    // Eventos del reproductor
    video.addEventListener('loadedmetadata', () => {

        statDuration.textContent =
            formatTime(video.duration);

        statResolution.textContent =
            `${video.videoWidth} x ${video.videoHeight}`;
    });


    video.addEventListener('timeupdate', () => {

        statCurrentTime.textContent =
            formatTime(video.currentTime);
    });


    video.addEventListener('play', () => {

        statStatus.textContent =
            'Reproduciendo';
    });


    video.addEventListener('pause', () => {

        statStatus.textContent =
            'Pausado';
    });


    video.addEventListener('waiting', () => {

        statStatus.textContent =
            'Cargando buffer...';
    });


    video.addEventListener('ended', () => {

        statStatus.textContent =
            'Finalizado';
    });


    // Botón buscar
    searchBtn.addEventListener('click', () => {

        searchVideos(searchInput.value);

    });


    // Seleccionar video
    videoSelect.addEventListener('change', (e) => {

        loadVideoFromAPI(e.target.value);

    });


    // Búsqueda inicial
    searchVideos(searchInput.value || 'nature');
}