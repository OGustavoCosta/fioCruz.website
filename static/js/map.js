document.addEventListener("DOMContentLoaded", function () {

    // ============================================================
    //  MAPA BASE
    // ============================================================

    let map = L.map('map', {
        minZoom: 4,
        scrollWheelZoom: false,
        zoomControl: true,
    }).setView([-14.2350, -51.9253], 4);

    L.rectangle(
        [[-90, -180], [90, 180]],
        {color: "#ffffff", weight: 0, fillOpacity: 1}
    ).addTo(map);

    map.removeControl(map.attributionControl)

    // ============================================================
    //  VARIÁVEIS GLOBAIS
    // ============================================================

    let dadosOriginais = null;
    let camadaGeojson = L.geoJSON().addTo(map);

    let indiceSelecionado = "Ind_mun";
    let regiaoSelecionada = "Brasil";
    let paletaSelecionada = 1;

    // ============================================================
    //  8 PALETAS (COLORBREWER)
    // ============================================================

    const palettes = {
        1: ['#f7fbff','#deebf7','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#08519c','#08306b'],
        2: ['#f7fcf5','#e5f5e0','#c7e9c0','#a1d99b','#74c476','#41ab5d','#238b45','#006d2c','#00441b'],
        3: ['#fff5eb','#fee6ce','#fdd0a2','#fdae6b','#fd8d3c','#f16913','#d94801','#a63603','#7f2704'],
        4: ['#fff5f0','#fee0d2','#fcbba1','#fc9272','#fb6a4a','#ef3b2c','#cb181d','#a50f15','#67000d'],
        5: ['#fcfbfd','#efedf5','#dadaeb','#bcbddc','#9e9ac8','#807dba','#6a51a3','#54278f','#3f007d'],
        6: ['#f7f7f7','#e0e0e0','#cccccc','#bdbdbd','#969696','#737373','#525252','#252525','#000000'],
        7: ['#ffffe5','#fff7bc','#fee391','#fec44f','#fe9929','#ec7014','#cc4c02','#993404','#662506'],
        8: ['#f7fcfd','#e5f5f9','#ccece6','#99d8c9','#66c2a4','#41ae76','#238b45','#006d2c','#00441b']
    };

    // ============================================================
    //  MAPA ÍNDICE → PALETA
    // ============================================================

    const mapaIndicePaleta = {
        "Ind_mun": 1,
        "Ind_rep_materna": 2,
        "Ind_rn_cr": 3,
        "Ind_doen_infec": 4,
        "Ind_doen_nt": 5,
        "Ind_les_viol": 6,
        "Ind_risc_amb": 7,
        "Ind_cob_saude": 8
    };

    // ============================================================
    //  FUNÇÃO ZOOM MAPA
    // ============================================================

    function zoomParaRegiao() {

        if (regiaoSelecionada === "Brasil") {
            map.setView([-14.2350, -51.9253], 4);
            return;
        }

        const layersDaRegiao = [];

        camadaGeojson.eachLayer(layer => {
            if (layer.feature.properties.SIGLA_RG === regiaoSelecionada) {
                layersDaRegiao.push(layer);
            }
        });

        if (layersDaRegiao.length > 0) {

            const group = L.featureGroup(layersDaRegiao);

            map.fitBounds(group.getBounds(), {
                padding: [20, 20]
            });
        }
    }

    // ============================================================
    //  FUNÇÃO DE COR PROPORCIONAL
    // ============================================================

    function getColor(valor, min, max) {

        const palette = palettes[paletaSelecionada];

        if (max === min) return palette[0];

        const normalizado = (valor - min) / (max - min);
        const index = Math.floor(normalizado * (palette.length - 1));

        return palette[index];
    }

    // ============================================================
    //  FUNÇÃO PRINCIPAL
    // ============================================================

    function atualizarMapa() {

        camadaGeojson.clearLayers();

        const valores = dadosOriginais.features
            .filter(f =>
                regiaoSelecionada === "Brasil" ||
                f.properties.SIGLA_RG === regiaoSelecionada
            )
            .map(f => Number(f.properties[indiceSelecionado]))
            .filter(v => !isNaN(v));

        const min = Math.min(...valores);
        const max = Math.max(...valores);

        camadaGeojson.addData(dadosOriginais);

        camadaGeojson.eachLayer(function(layer) {

            const p = layer.feature.properties;
            const valorIndice = Number(p[indiceSelecionado]);

            const pertenceRegiao =
                regiaoSelecionada === "Brasil" ||
                p.SIGLA_RG === regiaoSelecionada;

            if (pertenceRegiao) {

                layer.setStyle({
                    fillColor: getColor(valorIndice, min, max),
                    weight: 1,
                    color: '#333',
                    fillOpacity: 0.9
                });

                layer.bindTooltip(`
                    <div style="font-size:14px">
                        <strong>Município:</strong> ${p.Municipio}<br>
                        <strong>UF:</strong> ${p.UF}<br>
                        <strong>Região:</strong> ${p.NM_REGIA}<br>
                        <strong>Área (km²):</strong> ${Number(p.AREA_KM2).toLocaleString('pt-BR', {minimumFractionDigits: 2})}<br>
                        <strong>População:</strong> ${Number(p.populacao_2022).toLocaleString('pt-BR')}<br>
                        <strong>Índice:</strong> ${valorIndice.toFixed(3)}
                    </div>
                `, { sticky: true });

                layer.on({
                    mouseover: function(e) {
                        e.target.setStyle({
                            weight: 2,
                            color: '#000'
                        });
                    },
                    mouseout: function(e) {
                        e.target.setStyle({
                            fillColor: getColor(valorIndice, min, max),
                            weight: 1,
                            color: '#333',
                            fillOpacity: 0.9
                        });
                    }
                });

            } else {

                layer.setStyle({
                    fillColor: '#eeeeee',
                    color: '#cccccc',
                    weight: 1,
                    fillOpacity: 1
                });

            }

        });
    }

    // ============================================================
    //  CARREGAMENTO DOS DADOS
    // ============================================================

    document.addEventListener("dadosCarregados", function () {
        dadosOriginais = window.dadosGeo;
        atualizarMapa();
    });

    // ============================================================
    //  SELECT DE ÍNDICE
    // ============================================================

    document.getElementById("selectIndice")
    .addEventListener("change", function () {

        indiceSelecionado = this.value;

        paletaSelecionada = mapaIndicePaleta[indiceSelecionado] || 1;

        console.log("Índice:", indiceSelecionado);
        console.log("Paleta:", paletaSelecionada);

        atualizarMapa();
    });

    // ============================================================
    //  TOGGLE REGIÃO
    // ============================================================

    const botoes = document.querySelectorAll("#modo-toggle button");

botoes.forEach(btn => {
    btn.addEventListener("click", () => {

        botoes.forEach(b => {
            b.classList.remove("btn-primary");
            b.classList.add("btn-outline-primary");
        });

        btn.classList.remove("btn-outline-primary");
        btn.classList.add("btn-primary");

        regiaoSelecionada = btn.dataset.regiao;

        atualizarMapa();
        zoomParaRegiao();
    });
});

});