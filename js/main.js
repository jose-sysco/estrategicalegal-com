document.addEventListener('DOMContentLoaded', () => {
    // Carousel Logic
    const track = document.querySelector(".carousel-track");
    const cards = document.querySelectorAll(".card");
    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");

    if (track && cards.length > 0) {
        let currentIndex = 0;
        
        const updateCarousel = () => {
             // Get the width of a single card including margin/gap
            // In CSS we calculate flex-basis, but here getting clientWidth of one item is safer for responsive
            const cardWidth = cards[0].offsetWidth; 
            const gap = 30; // Matches CSS gap
            // Calculate how many cards are visible
            const containerWidth = document.querySelector('.carousel-viewport').offsetWidth;
            const visibleCards = Math.round(containerWidth / (cardWidth + gap)); // Approximate
            
            // Limit index
            const maxIndex = cards.length - visibleCards;
            
            // Safety check if we resize and index is out of bounds
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            if (currentIndex < 0) currentIndex = 0;

            const moveAmount = currentIndex * (cardWidth + gap);
            track.style.transform = `translateX(-${moveAmount}px)`;
        };

        nextBtn.addEventListener('click', () => {
            const cardWidth = cards[0].offsetWidth; 
            const gap = 30;
            const containerWidth = document.querySelector('.carousel-viewport').offsetWidth;
            const visibleCards = Math.floor(containerWidth / (cardWidth));
            const maxIndex = cards.length - visibleCards;

            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        // Recalculate on resize
        window.addEventListener('resize', updateCarousel);
    }

    // Contact Form Validation
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Stop actual submission for demo
            
            const nombre = document.getElementById('nombre').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const correo = document.getElementById('correo').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();

            if (!nombre || !telefono || !correo || !mensaje) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            // Simulate sending
            const btn = form.querySelector('.btn-submit');
            const originalText = btn.innerText;
            btn.innerText = 'Enviando...';
            btn.disabled = true;

            setTimeout(() => {
                alert(`Gracias ${nombre}, hemos recibido tu mensaje. Nos pondremos en contacto contigo al ${telefono}.`);
                form.reset();
                btn.innerText = originalText;
                btn.disabled = false;
            }, 1500);
        });
    }

    // Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80; // Height of fixed header
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});

