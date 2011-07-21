function calcularSobretaxa() {
    
    var salario = parseFloat($('#input-salario').val());
    var taxa_unica = parseFloat($('#input-taxa-social-unica').val());
    var salario_minimo = parseFloat($('#input-salario-minimo').val());
    var regiao = parseInt($('#input-regiao').val());
    
    if (isNaN(salario) || salario < 0) {
        resultadoImpostoEspecial('(erro no salario)');
        return;
    }
    
    // TRABALHADOR DEPENDENTE
    if ($('#radio-trab-dependente:checked').val())
    {
        // Enable/disable inputs
        $('#input-trab-dependente-titular').removeAttr('disabled');
        $('#input-trab-dependente-filhos').removeAttr('disabled');
        $('#input-pensionista-categoria').attr('disabled', 'disabled');
        $('#input-pensionista-titulares').attr('disabled', 'disabled');
        
        var titular = parseInt($('#input-trab-dependente-titular').val());
        var nr_filhos = parseInt($('#input-trab-dependente-filhos').val())
        var tabela_retencao = null;
        var retencao = null;
        
        // Calcular retenção na fonte de IRS
        switch(titular) {
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
        
        tabela_retencao = tabela_retencao[regiao];
        
        console.log(regiao);
        
        console.log(tabela_retencao.toString());
        
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
        
        // Calcular sobretaxa   
        var perc_retencao = parseFloat($('#input-perc-retencao-na-fonte').val());
        
        perc_retencao /= 100;
        taxa_unica /= 100;
        
        var result = (salario * (1 - perc_retencao - taxa_unica) - salario_minimo) * 0.5;
        
        // Imprimir resultado
        resultadoImpostoEspecial(result); 
    }
    // PENSIONISTA
    else
    {
        // Enable/disable inputs
        $('#input-trab-dependente-titular').attr('disabled', 'disabled');
        $('#input-trab-dependente-filhos').attr('disabled', 'disabled');
        $('#input-pensionista-categoria').removeAttr('disabled');
        $('#input-pensionista-titulares').removeAttr('disabled');
        
        var categoria = parseInt($('#input-pensionista-categoria').val());
        var titulares = parseInt($('#input-pensionista-titulares').val());
        titulares = (titulares == 2 ? 2 : 1);
        var retencao = null;
        
        switch(categoria) {
            case 1:
                tabela_retencao = tabela_pensionista_normal;
                break;
            case 2:
                tabela_retencao = tabela_pensionista_deficiente;
                break;
            case 3:
                tabela_retencao = tabela_pensionista_deficiente_forcas_armadas;
                break;
        }
        
        tabela_retencao = tabela_retencao[regiao];
        
        for (var i = 0; i < tabela_retencao.length - 1; i++) {
            
            if (salario <= tabela_retencao[i][0]) {
                retencao = tabela_retencao[i][titulares];
                break;
            }
        }
        
        if (retencao == null && salario > tabela_retencao[tabela_retencao.length-1][0]) {
            retencao = tabela_retencao[tabela_retencao.length-1][titulares];
        }

        resultadoRetencao(retencao == null ? '(erro de calculo)' : retencao);
        
        // Calcular sobretaxa
        var result = (salario - (salario * (retencao/100)) - salario_minimo) * 0.5;
                      
        // Imprimir resultado
        resultadoImpostoEspecial(result); 
    }
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
    
    $('#resultado-sobretaxa').html(result);
}

function pageLoad() {
    calcularSobretaxa();
}

