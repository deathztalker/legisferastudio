document.addEventListener('DOMContentLoaded', () => {

    // --- Inicialización de Partículas (Estrellas Elegantes) ---
    if (typeof tsParticles !== 'undefined') {
        tsParticles.load("tsparticles", {
            preset: "stars",
            background: {
                color: "transparent",
            },
            particles: {
                color: {
                    value: ["#ffffff", "#d4af37", "#a0aec0"] // Blanco, Oro, Plata
                },
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        area: 800
                    }
                },
                opacity: {
                    value: { min: 0.1, max: 0.5 }
                },
                size: {
                    value: { min: 1, max: 3 }
                },
                move: {
                    enable: true,
                    speed: 0.8,
                    direction: "none",
                    outModes: {
                        default: "bounce"
                    }
                }
            }
        });
    }
    
    // --- Configuración de Correo Directo (Web3Forms) ---
    // IMPORTANTE: Ve a web3forms.com, pon tu correo y pega aquí tu Access Key
    const WEB3FORMS_ACCESS_KEY = 'TU_ACCESS_KEY_AQUI';

    // --- Configuración de Flatpickr (Fechas y Horas Elegantes) ---
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');

    if (typeof flatpickr !== 'undefined') {
        // Selector de Fecha (solo días hábiles)
        flatpickr(dateInput, {
            locale: "es",
            minDate: "today",
            dateFormat: "Y-m-d",
            disable: [
                function(date) {
                    // Deshabilitar fines de semana (0 = Domingo, 6 = Sábado)
                    return (date.getDay() === 0 || date.getDay() === 6);
                }
            ],
            onChange: function(selectedDates, dateStr, instance) {
                formMessage.textContent = ''; // Limpiar errores
            }
        });

        // Selector de Hora
        flatpickr(timeInput, {
            enableTime: true,
            noCalendar: true,
            dateFormat: "h:i K", // Formato 12 horas AM/PM
            minTime: "09:00",
            maxTime: "18:00",
            minuteIncrement: 30 // Intervalos de 30 minutos
        });
    }

    // --- Lógica del Formulario de Agendamiento ---
    const form = document.getElementById('appointment-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');

    // Manejar el envío del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (WEB3FORMS_ACCESS_KEY.includes('TU_ACCESS_KEY_AQUI')) {
            showMessage('El sistema está en modo demostración. Configura tu Access Key de Web3Forms para recibir los correos.', 'error');
            return;
        }

        // Obtener valores del formulario
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const reason = document.getElementById('reason').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;

        // Validar (básico)
        if (!name || !email || !phone || !reason || !date || !time) {
            showMessage('Por favor completa todos los campos.', 'error');
            return;
        }

        // Estado de carga
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Enviando Solicitud... <i class="fa-solid fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        try {
            // Enviar correo a través de Web3Forms
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: WEB3FORMS_ACCESS_KEY,
                    subject: `Nueva solicitud de cita legal: ${name}`,
                    from_name: "Web Legisfera",
                    Nombre: name,
                    Email_Cliente: email,
                    Telefono: phone,
                    Motivo: reason,
                    Fecha_Solicitada: date,
                    Hora_Solicitada: time
                })
            });

            const result = await response.json();

            if (response.status === 200) {
                // Éxito
                showMessage('¡Cita solicitada con éxito! Revisa tu correo.', 'success');
                form.reset();
            } else {
                console.error("Error Web3Forms:", result);
                throw new Error(result.message || "Error al enviar");
            }
        } catch (error) {
            console.error('Error enviando cita:', error);
            showMessage('Ocurrió un error al intentar agendar. Por favor intenta más tarde.', 'error');
        } finally {
            // Restaurar botón
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            
            // Limpiar mensaje después de 5 segundos si fue exitoso
            if (!formMessage.classList.contains('msg-error')) {
                setTimeout(() => {
                    formMessage.textContent = '';
                }, 5000);
            }
        }
    });

    // --- Lógica del Botón Volver Arriba ---
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Lógica del Menú Hamburguesa ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en un enlace
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // --- Animaciones de Scroll (Reveal) ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animamos solo una vez
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Se activa cuando el 15% del elemento es visible
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Función auxiliar para mostrar mensajes
    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = 'form-message'; // Reset clases
        if (type === 'success') {
            formMessage.classList.add('msg-success');
        } else if (type === 'error') {
            formMessage.classList.add('msg-error');
        }
    }

});
