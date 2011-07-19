function calcularSobretaxa() {

    var salario = parseFloat($('#input-salario').val());
    var perc_retencao = parseFloat($('#input-perc-retencao-na-fonte').val());
    var taxa_unica = parseFloat($('#input-taxa-social-unica').val());
    var salario_minimo = parseFloat($('#input-salario-minimo').val());

    if (isNaN(salario) || salario < 0) {
        resultadoImpostoEspecial('(erro no salario)');
    }
    else if (perc_retencao < 0 || perc_retencao > 100) {
        resultadoImpostoEspecial('(erro na retenção na fonte)');
    }
    else {
        perc_retencao /= 100;
        taxa_unica /= 100;
        
        var result = (salario * (1 - perc_retencao - taxa_unica) - salario_minimo) * 0.5;
        
        resultadoImpostoEspecial(result);   
    }
}

function calcularRetencao() {
    var salario = parseFloat($('#input-salario').val());
    var situacao = parseInt($('#input-situacao').val());
    var nr_filhos = parseInt($('#input-nr-filhos').val())
    var tabela_retencao = null;
    var retencao = null;
    
    if (isNaN(salario) || salario < 0) {
        resultadoRetencao('(salario invalido)');
    }
    else if (nr_filhos < 0 || nr_filhos > 6) {
        resultadoRetencao('(número de filhos inválido)');
    }
    else if (situacao < 0 || situacao > 6) {
        resultadoRetencao('(situação inválida)');
    }
    else {
        switch(situacao) {
            case 1:
                tabela_retencao = tabela_trab_dependente_nao_casado;
                break;
            case 2:
                tabela_retencao = tabela_trab_dependente_casado_unico_titular;
                break;
            case 3:
                tabela_retencao = tabela_trab_dependente_casado_dois_titulares;
                break;
            case 4:
                tabela_retencao = tabela_trab_dependente_nao_casado_deficiente;
                break;
            case 5:
                tabela_retencao = tabela_trab_dependente_casado_unico_titular_deficiente;
                break;
            case 6:
                tabela_retencao = tabela_trab_dependente_casado_dois_titulares_deficiente;
                break;
        }
        
        for (var i = 0; i < tabela_retencao.length - 1; i++) {
            
            if (salario <= tabela_retencao[i][0]) {
                retencao = tabela_retencao[i][nr_filhos];
                break;
            }
        }
        
        if (retencao == null && salario > tabela_retencao[tabela_retencao.length-1][0]) {
            retencao = tabela_retencao[tabela_retencao.length-1][nr_filhos];
        }
        
        resultadoRetencao(retencao == null ? '(erro de calculo)' : retencao);
    }
       
    calcularSobretaxa();
}

function resultadoRetencao(text) {
    $('#input-perc-retencao-na-fonte').val(text);
}

function resultadoImpostoEspecial(text) {
    var result = '(erro de cálculo)';
    
    if (typeof text === "number") {
        result = (text <= 0 ? '0.00' : text.toFixed(2)) + " \u20AC";
    }
    else {
        result = text;
    }
    
    console.log(result);
    
    $('#resultado-sobretaxa').html(result);
}

function pageLoad() {
    calcularRetencao();
}

