// para cada container hidden_information
document.querySelectorAll('.hidden_information').forEach(container => {
    // pega a radio interna e o grupo (name)
    const radio = container.querySelector('input[type="radio"]');
    const grupo = radio.name;

    // quando essa radio muda para checked, ativa o input
    radio.addEventListener('change', () => {
        if (radio.checked) {
        container.classList.add('active');
        }
    });

    // quando qualquer outra radio do mesmo grupo mudar, desativa
    document.querySelectorAll(`input[name="${grupo}"]`)
        .forEach(r => {
        if (r !== radio) {
            r.addEventListener('change', () => {
            container.classList.remove('active');
            });
        }
        });
});