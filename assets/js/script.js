document.addEventListener("DOMContentLoaded", () => {
    const sidebarMenu = document.getElementById('sidebarMenu');
    const menuIcon = document.getElementById('menuIcon');
    sidebarMenu.style.display = 'none';
    menuIcon.innerHTML = '&#9776;'; // Hamburger icon

    // Call the function to update the map on page load
    initMap();
    // Call the function to update the Reviews on page load
    loadReviews();
    // Call the function to update the Gallery on page load
    loadGallery();
    // Call the function to update the year on page load
    updateYear();

    document.querySelectorAll('.nav-link').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            item.classList.add('active');
            toggleMenu(); // Close the sidebar after clicking a link
        });
    });
});

function toggleMenu() {
    const sidebarMenu = document.getElementById('sidebarMenu');
    const menuIcon = document.getElementById('menuIcon');
    const body = document.body;

    if (sidebarMenu.style.display === 'block') {
        sidebarMenu.style.display = 'none';
        menuIcon.innerHTML = '&#9776;'; // Hamburger icon
        body.classList.remove('sidebar-visible');
    } else {
        sidebarMenu.style.display = 'block';
        menuIcon.innerHTML = '&times;'; // Close icon
        body.classList.add('sidebar-visible');
    }
}

function initMap() {
    const latitude = 9.670182;
    const longitude = 76.889733;

    const map = L.map('map').setView([latitude, longitude], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    const marker = L.marker([latitude, longitude]).addTo(map);
    marker.bindPopup("<b>Wild Jacket</b>").openPopup();
}

function loadReviews() {
    const reviewsContainer = document.querySelector('.reviews-container'); // Use '.reviews-container' to select by class
    const reviews = [
        { user: "John Doe", review: "Amazing camping experience! " },
        { user: "Jane Smith", review: "Loved the locations and the service. " },
        { user: "Bob Johnson", review: "A wonderful escape into nature. " }
    ];

    // Clear existing content in the reviews container
    reviewsContainer.innerHTML = '';
    
    reviews.forEach(review => {
        const reviewDiv = document.createElement('div');
        reviewDiv.textContent = `${review.user}: ${review.review}`; // Use 'review' instead of 'reviews'
        reviewsContainer.appendChild(reviewDiv);
    });
}

function loadGallery() {
    const galleryContainer = document.querySelector('.gallery-container');
    const images = [
        '/assets/images/My\ Space.jpg',
        '/assets/images/Untitled\ design.jpg',
        '/assets/images/Untitled\ design\ \(1\).jpg',
        '/assets/images/Untitled\ design\ \(2\).jpg',
        '/assets/images/Untitled\ design\ \(3\).jpg'
    ];
    images.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = "Camping Image";
        img.style.maxWidth = '200px';
        galleryContainer.appendChild(img);
    });
}

function updateYear() {
    const currentYear = new Date().getFullYear();
    const copyrightElement = document.getElementById("yearUpdate");
    copyrightElement.textContent = `© ${currentYear} Tent Camping Adventures`;
}