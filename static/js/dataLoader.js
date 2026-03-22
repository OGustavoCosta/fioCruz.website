window.dadosGeo = null;

fetch('/geojson')
    .then(response => response.json())
    .then(data => {
        window.dadosGeo = data;

        // dispara um evento avisando que os dados estão prontos
        document.dispatchEvent(new Event("dadosCarregados"));
    });
