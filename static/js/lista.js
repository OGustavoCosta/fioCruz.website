document.addEventListener("dadosCarregados", function () {

    const dados = window.dadosGeo;
    const listaContainer = document.getElementById("listaMunicipios");
    const inputBusca = document.getElementById("buscaMunicipio");

    const indicadores = [
        "Ind_mun",
        "Ind_rep_materna",
        "Ind_rn_cr",
        "Ind_doen_infec",
        "Ind_doen_nt",
        "Ind_les_viol",
        "Ind_risc_amb",
        "Ind_cob_saude"
    ];

    // ===============================
    // 🔹 FUNÇÃO NORMALIZAR TEXTO (ignorar acentos)
    // ===============================

    function normalizar(texto) {
        return texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    // ===============================
    // 1️⃣ ORDENAR MUNICÍPIOS
    // ===============================

    const ordenados = [...dados.features].sort((a, b) =>
        a.properties.Municipio.localeCompare(b.properties.Municipio)
    );

    // ===============================
    // 2️⃣ CALCULAR MÉDIAS POR IED
    // ===============================

    const mediasPorIED = {};

    ordenados.forEach(f => {

        const p = f.properties;
        const ied = p.IED;

        if (!mediasPorIED[ied]) {

            mediasPorIED[ied] = {
                total: 0,
                soma: {}
            };

            indicadores.forEach(ind => {
                mediasPorIED[ied].soma[ind] = 0;
            });
        }

        mediasPorIED[ied].total++;

        indicadores.forEach(ind => {
            mediasPorIED[ied].soma[ind] += Number(p[ind]);
        });
    });

    Object.keys(mediasPorIED).forEach(ied => {
        indicadores.forEach(ind => {
            mediasPorIED[ied][ind] =
                mediasPorIED[ied].soma[ind] / mediasPorIED[ied].total;
        });
    });

    // ===============================
    // 3️⃣ CRIAR GRÁFICO
    // ===============================

    const ctx = document.getElementById("graficoIndicadores");

    const grafico = new Chart(ctx, {
        type: "bar",
        data: {
            labels: indicadores,
            datasets: [
                {
                    label: "Município",
                    data: []
                },
                {
                    label: "Média do mesmo IED",
                    data: []
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // ===============================
    // 4️⃣ FUNÇÃO ATUALIZAR GRÁFICO
    // ===============================

    function atualizarGrafico(p) {

        const valoresMunicipio = indicadores.map(ind =>
            Number(p[ind])
        );

        const valoresMedia = indicadores.map(ind =>
            mediasPorIED[p.IED][ind]
        );

        grafico.data.datasets[0].data = valoresMunicipio;
        grafico.data.datasets[1].data = valoresMedia;

        grafico.data.datasets[0].label = p.Municipio;
        grafico.data.datasets[1].label = "Média IED " + p.IED;

        grafico.update();
    }

    // ===============================
    // 5️⃣ CRIAR CARDS
    // ===============================

    listaContainer.innerHTML = "";

    ordenados.forEach(f => {

        const p = f.properties;

        const card = document.createElement("div");
        card.className = "card mb-3 shadow-sm";

        card.innerHTML = `
            <div class="card-body">
                <h6 class="fw-bold">${p.Municipio}</h6>
                <p class="mb-1"><strong>UF:</strong> ${p.UF}</p>
                <p class="mb-1"><strong>Região:</strong> ${p.NM_REGIA}</p>
                <p class="mb-1"><strong>Área (Km²):</strong> ${p.AREA_KM2}</p>
                <p class="mb-1"><strong>População:</strong> ${p.populacao_2022}</p>
                <p class="mb-1"><strong>IED:</strong> ${p.IED}</p>

                <button class="btn btn-sm btn-primary mt-2">
                    Atualizar gráfico
                </button>
            </div>
        `;

        const botao = card.querySelector("button");

        botao.addEventListener("click", function () {
            atualizarGrafico(p);
        });

        listaContainer.appendChild(card);
    });

    // ===============================
    // 6️⃣ PESQUISA DINÂMICA
    // ===============================

    inputBusca.addEventListener("input", function () {

        const termo = normalizar(inputBusca.value);
        const cards = listaContainer.querySelectorAll(".card");

        cards.forEach(card => {

            const nomeMunicipio = normalizar(
                card.querySelector("h6").textContent
            );

            if (nomeMunicipio.includes(termo)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }

        });

    });

});
