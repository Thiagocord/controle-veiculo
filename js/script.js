let dados = JSON.parse(localStorage.getItem("controleVeiculo")) || [];

const tabela = document.getElementById("tabela");
const form = document.getElementById("form");
const relatorioDiv = document.getElementById("relatorioHoras");


function salvarLocal() {
    localStorage.setItem("controleVeiculo", JSON.stringify(dados));
}


function calcularMinutos(saida, retorno) {
    let s = new Date("1970-01-01T" + saida);
    let r = new Date("1970-01-01T" + retorno);
    return (r - s) / 1000 / 60;
}

function formatarHoras(minutos) {
    let h = Math.floor(minutos / 60);
    let m = minutos % 60;
    return `${h}h ${m}m`;
}


function render() {
    tabela.innerHTML = "";
    let resumo = {};

    dados.forEach((item, index) => {
        tabela.innerHTML += `
        <tr>
            <td>${item.data}</td>
            <td>${item.cliente}</td>
            <td>${item.saida}</td>
            <td>${item.retorno}</td>
            <td>${formatarHoras(calcularMinutos(item.saida, item.retorno))}</td>
            <td>${item.funcionario}</td>
            <td><button onclick="excluir(${index})" class="danger">X</button></td>
        </tr>
        `;


        let min = calcularMinutos(item.saida, item.retorno);
        if (!resumo[item.funcionario]) resumo[item.funcionario] = 0;
        resumo[item.funcionario] += min;
    });

    relatorioDiv.innerHTML = "";
    for (let func in resumo) {
        relatorioDiv.innerHTML += `<p>${func}: ${formatarHoras(resumo[func])}</p>`;
    }
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    let novo = {
        data: document.getElementById("data").value,
        cliente: document.getElementById("cliente").value,
        saida: document.getElementById("saida").value,
        retorno: document.getElementById("retorno").value,
        funcionario: document.getElementById("funcionario").value
    };

    dados.push(novo);
    salvarLocal();
    render();
    form.reset();
});

function excluir(index) {
    dados.splice(index, 1);
    salvarLocal();
    render();
}

function exportarCSV() {
    let csv = "Data,Cliente,Saida,Retorno,Funcionario\n";
    dados.forEach(d => {
        csv += `${d.data},${d.cliente},${d.saida},${d.retorno},${d.funcionario}\n`;
    });

    let blob = new Blob([csv], { type: 'text/csv' });
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "controle_veiculo.csv";
    a.click();
}

function limparDados() {
    if (confirm("Tem certeza que deseja apagar tudo?")) {
        dados = [];
        salvarLocal();
        render();
    }
}

render();
