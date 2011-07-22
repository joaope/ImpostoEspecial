categorias = {
    TrabalhadorDependente: 0,
    RegimeSimplificado: 1,
    Pensionista: 2
}

function calcularSobretaxa() {
    
    var salario = parseFloat($('#input-salario').val());
    var taxa_unica = parseFloat($('#input-taxa-social-unica').val());
    var salario_minimo = parseFloat($('#input-salario-minimo').val());
    var regiao = parseInt($('#input-regiao').val());
    
    if ((isNaN(salario) || salario < 0) && !$('#radio-regime-simplificado:checked').val()) {
        resultadoImpostoEspecial('(erro no salario)');
        return;
    }
    
    // TRABALHADOR DEPENDENTE
    if ($('#radio-trab-dependente:checked').val())
    {
        // Enable/disable inputs
        $('#input-regiao').removeAttr('disabled');
        $('#input-salario').removeAttr('disabled');
        
        $('#input-trab-dependente-titular').removeAttr('disabled');
        $('#input-trab-dependente-filhos').removeAttr('disabled');
        $('#input-pensionista-categoria').attr('disabled', 'disabled');
        $('#input-pensionista-titulares').attr('disabled', 'disabled');
        $('#input-regime-simpl-rend-anual').attr('disabled', 'disabled');
        
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
        imprimirDetalhes(categorias.TrabalhadorDependente, {
            regiao: $('#input-regiao option:selected').html(),
            rendimento_mensal: salario,
            salario_minimo: salario_minimo,
            tipo_titular: $('#input-trab-dependente-titular option:selected').html(),
            filhos: $('#input-trab-dependente-filhos option:selected').html(),
            retencao: retencao,
            retencao_total: (salario * perc_retencao).toFixed(2),
            seguranca_social: (salario * taxa_unica).toFixed(2),
            taxa_unica: parseFloat($('#input-taxa-social-unica').val()),
            sobretaxa: result.toFixed(2),
            salario_minimo: salario_minimo
        });
    }
    // REGIME SIMPLIFICADO
    else if ($('#radio-regime-simplificado:checked').val())
    {
        // Enable/disable inputs
        $('#input-regiao').attr('disabled', 'disabled');
        $('#input-salario').attr('disabled', 'disabled');
        
        $('#input-trab-dependente-titular').attr('disabled', 'disabled');
        $('#input-trab-dependente-filhos').attr('disabled', 'disabled');
        $('#input-pensionista-categoria').attr('disabled', 'disabled');
        $('#input-pensionista-titulares').attr('disabled', 'disabled');
        $('#input-regime-simpl-rend-anual').removeAttr('disabled');
        
        resultadoRetencao('');

        var rend_anual = parseInt($('#input-regime-simpl-rend-anual').val());
        
        if (isNaN(rend_anual) || rend_anual < 0) {
            resultadoImpostoEspecial('(erro no rendimento anual)');
            return;
        }
        
        // Calcular sobretaxa
        var result = ((rend_anual * 0.7) - (14 * salario_minimo)) * 0.035;
        
        // Imprimir resultado
        resultadoImpostoEspecial(result);
        imprimirDetalhes(categorias.RegimeSimplificado, {
            rendimento_anual: rend_anual,
            salario_minimo: salario_minimo,
            rendimento_colectavel: (rend_anual * 0.7).toFixed(2),
            sobretaxa: result.toFixed(2)
        });
    }
    // PENSIONISTA
    else
    {
        // Enable/disable inputs
        $('#input-regiao').removeAttr('disabled');
        $('#input-salario').removeAttr('disabled');
        
        $('#input-trab-dependente-titular').attr('disabled', 'disabled');
        $('#input-trab-dependente-filhos').attr('disabled', 'disabled');
        $('#input-regime-simpl-rend-anual').attr('disabled', 'disabled');
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
        
        imprimirDetalhes(categorias.Pensionista, {
            regiao: $('#input-regiao option:selected').html(),
            rendimento_mensal: salario,
            categoria: $('#input-pensionista-categoria option:selected').html(),
            tipo_titular: $('#input-pensionista-titulares option:selected').html(),
            retencao: retencao,
            retencao_total: (salario * (retencao/100)).toFixed(2),
            sobretaxa: result.toFixed(2),
            salario_minimo: salario_minimo
        });
    }
}

function resultadoRetencao(text)
{
    $('#input-perc-retencao-na-fonte').val(text);
}

function resultadoImpostoEspecial(text)
{
    var result = '(erro de cálculo)';
    
    if (typeof text === "number") {
        result = (text <= 0 ? '0.00' : text.toFixed(2)) + " \u20AC";
    }
    else {
        result = text;
    }
    
    $('#resultado-sobretaxa').html(result);
}

function imprimirDetalhes(categoria, d)
{
    if (categoria == categorias.TrabalhadorDependente)
    {
        $('#detalhes-dialog').html(
            "<p> " +
                "Estes c&#xe1;lculos aplicam-se &#xe0; regi&#xe3;o: <b>" + d.regiao + "</b>" +
            "</p>" +
            "<br/>" +
            "<p>" +
                "O seu rendimento mensal &#xe9; de <b>" + d.rendimento_mensal + "\u20AC</b>. Estando na situa&#xe7;&#xe3;o de <b>" + d.tipo_titular + "</b> e " +
                "com <b>" + d.filhos + "</b> filho(s) a reten&#xe7;&#xe3;o na fonte de IRS ir&#xe1; ser de <b>" + d.retencao + "%</b> desse mesmo rendimento." +
            "</p>" +
            "<br/>" +
            "<p>" +
                "Ir&#xe1;, portanto, reter na fonte de IRS um total de <b>" + d.retencao_total + "\u20AC</b> e descontar para a Seguran&#xe7;a Social um total" +
                " de <b>" + d.seguranca_social + "\u20AC</b> (<b>" + d.taxa_unica + "%</b>)." +
            "</p>" +
            "<br/>" +
            "<p><b>F&#xf3;rmula usada:</b></p>" +
            "<p>(RendimentoMensal - Retenc&#xe3;oNaFonteIRS - DescontoSeguran&#xe7;aSocial - Sal&#xe1;rioM&#xed;nimo) x 50%</p>" +
            "<br/>" +
            "<p><b>F&#xf3;rmula final:</b></p>" +
            "<p>(" + d.rendimento_mensal + "\u20AC - " + d.retencao_total + "\u20AC - " + d.seguranca_social + "\u20AC - " + d.salario_minimo + "\u20AC) x 50% = <u><b>" + d.sobretaxa + "</b></u>\u20AC</p>" 
        );
    }
    else if (categoria == categorias.Pensionista)
    {
        $('#detalhes-dialog').html(
            "<p>" +
                "Estes c&#xe1;lculos aplicam-se &#xe0; regi&#xe3;o: <b>" + d.regiao + "</b>" +
            "</p>" +
            "<br/>" +
            "<p>" +
                "O seu rendimento mensal, como pensionista, &#xe9; de <b>" + d.rendimento_mensal + "\u20AC</b>. Estando inserido na categoria <b>" + d.categoria + "</b> e " +
                "<b>" + d.tipo_titular + "</b> a sua reten&#xe7;&#xe3;o na fonte de IRS ir&#xe1; ser de <b>" + d.retencao + "%</b> desse mesmo rendimento." +
            "</p>" +
            "<br/>" +
            "<p>" +
                "Ir&#xe1;, portanto, reter na fonte de IRS um total de <b>" + d.retencao_total + "\u20AC</b>." +
            "</p>" +
            "<br/>" +
            "<p><b>F&#xf3;rmula usada:</b></p>" +
            "<p>(RendimentoMensal - Retenc&#xe3;oNaFonteIRS - Sal&#xe1;rioM&#xed;nimo) x 50%</p>" +
            "<br/>" +
            "<p><b>F&#xf3;rmula final:</b></p>" +
            "<p>(" + d.rendimento_mensal + "\u20AC - " + d.retencao_total + "\u20AC - " + d.salario_minimo + "\u20AC) x 50% = <u><b>" + d.sobretaxa + "</b></u>\u20AC</p>" 
        );
    }
    else {
        $('#detalhes-dialog').html(
            "<p>" +
                "<i><b>Sendo trabalhador independente paga o imposto em 2012, depois de entregar a declara&#xe7;&#xe3;o anual de rendimentos.</b></i>" +
            "</p>" +
            "<br/>" +
            "<p>" +
                "Tal como &#xe9; vis&#xed;vel na f&#xf3;rmula representada em baixo ser&#xe3;o descontados 14 sal&#xe1;rios m&#xed;nimos ao rendimento" +
                " colect&#xe1;vel anual e, do resultado, pagar&#xe1; 3.5% de sobretaxa." +
            "</p>" +
            "<br/>" +
            "<p>" +
                "Com um rendimento anual de <b>" + d.rendimento_anual + "\u20AC</b> o seu rendimento colect&#xe1;vel de IRS ser&#xe1; de <b>" + d.rendimento_colectavel + "\u20AC</b> (<b>70%</b> do total)." +
            "</p>" +
            "<br/>" +
            "<p><b>F&#xf3;rmula usada:</b></p>" +
            "<p>(RendimentoColect&#xe1;velAnual - (14 x Sal&#xe1;rioM&#xed;nimo)) x 3.5%</p>" +
            "<br/>" +
            "<p><b>F&#xf3;rmula final:</b></p>" +
            "<p>(" + d.rendimento_colectavel + "\u20AC - (14 * " + d.salario_minimo +"\u20AC)) x 3.5% = <u><b>" + d.sobretaxa + "</b></u>\u20AC</p>"
        );
    }
}

function pageLoad()
{
    calcularSobretaxa();
    $("#detalhes-dialog").dialog({
        modal: true,
        autoOpen: false,
        position: 'center',
        width: "600px",
        draggable: true
    });
    
    $('#detalhes-link').click(function(){
        $('#detalhes-dialog').dialog('open');
        return false;
    });
}

