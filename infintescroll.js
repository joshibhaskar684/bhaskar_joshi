
    document.addEventListener('DOMContentLoaded', function () {
        const sections = document.querySelectorAll('.anim');

        function checkScroll() {
            sections.forEach(section => {
                const sectionPos = section.getBoundingClientRect().top;
                const screenPos = window.innerHeight / 1.3;

                if (sectionPos < screenPos) {
                    section.classList.add('appear');
                }
            });
        }

        window.addEventListener('scroll', checkScroll);
    });

    