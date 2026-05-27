document.addEventListener('DOMContentLoaded', () => {

    // --- Inicialización de Partículas ---
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
                links: {
                    enable: true,
                    color: "random",
                    opacity: 0.2,
                    distance: 100
                },
                move: {
                    enable: true,
                    speed: 0.8,
                    direction: "none",
                    outModes: {
                        default: "bounce"
                    }
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
                }
            }
        });
    }
    
    // --- Configuración de Supabase ---
    // IMPORTANTE: Reemplaza estas variables con las credenciales de tu proyecto Supabase
    const SUPABASE_URL = 'https://TU_PROYECTO.supabase.co';
    const SUPABASE_ANON_KEY = 'TU_ANON_KEY';

    // Inicializar cliente de Supabase (asume que se cargó el script en HTML)
    let supabase;
    try {
        if (window.supabase) {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        } else {
            console.warn('Supabase no está cargado. Asegúrate de tener el script CDN en el HTML.');
        }
    } catch (error) {
        console.error('Error inicializando Supabase. Verifica tus credenciales.', error);
    }

    // --- Lógica del Formulario de Agendamiento ---
    const form = document.getElementById('appointment-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');

    // Configurar fecha mínima (hoy) para el input de fecha
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    // Evitar agendar fines de semana (opcional)
    dateInput.addEventListener('input', function(e) {
        const day = new Date(this.value).getUTCDay();
        if ([6, 0].includes(day)) { // 6 = Sábado, 0 = Domingo
            e.preventDefault();
            this.value = '';
            showMessage('Atendemos de Lunes a Viernes. Por favor selecciona otro día.', 'error');
        } else {
            formMessage.textContent = '';
        }
    });

    // Manejar el envío del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Si no se han configurado las credenciales de Supabase
        if (SUPABASE_URL.includes('TU_PROYECTO')) {
            showMessage('El sistema está en modo demostración. Configura Supabase para guardar la cita.', 'error');
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
        submitBtn.innerHTML = 'Procesando... <i class="fa-solid fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        try {
            // Guardar en Supabase
            const { data, error } = await supabase
                .from('appointments')
                .insert([
                    { 
                        full_name: name, 
                        email: email, 
                        phone: phone, 
                        reason: reason, 
                        appointment_date: date, 
                        appointment_time: time,
                        status: 'pending' // Estado por defecto
                    }
                ]);

            if (error) {
                console.error("Supabase insert error:", error);
                throw error;
            }

            // Éxito
            showMessage('¡Cita solicitada con éxito! Nos pondremos en contacto pronto.', 'success');
            form.reset();

            // Aquí, en el futuro, podrías llamar a una Edge Function para enviar correo:
            // supabase.functions.invoke('send-email', { body: { email, name, date, time } })
            
        } catch (error) {
            console.error('Error guardando cita:', error);
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

    // --- Navegación Suave (Smooth Scroll) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
