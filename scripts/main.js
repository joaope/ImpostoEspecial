function calcularSobretaxa() {

    var salario = parseFloat($('#input-salario').val());
    var perc_retencao = parseFloat($('#input-perc-retencao-na-fonte').val());
    var taxa_unica = parseFloat($('#input-taxa-social-unica').val());
    var salario_minimo = parseFloat($('#input-salario-minimo').val());

    if (salario < 0) {
        alert("Salario Mensal Bruto tem de ser um valor numerico e superior a 0");
        resultText('');
    }
    else if (perc_retencao < 0 || perc_retencao > 100) {
        alert("Percentagem da 'Retencao na Fonte de IRS' tem de ser um valor entre 0 e 100, inclusive");
        resultText('');
    }
    else {
        perc_retencao /= 100;
        taxa_unica /= 100;
        
        var result = (salario * (1 - perc_retencao - taxa_unica) - salario_minimo) * 0.5;
        
        resultText(result + ' \u20AC');   
    }
}

function resultText(text) {
    $('#resultado-sobretaxa').html(text);
}

function pageLoad() {
    calcularSobretaxa();
}