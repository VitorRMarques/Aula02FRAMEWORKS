// dashboard.js â€” MÃ³dulo de MÃ©tricas de Vendas
// Gerado automaticamente â€” aguardando review
 
const BASE_URL = 'https://api.empresa.com';
const TAXA_IMPOSTO = 0.15;
const LIMITE_ALERTA = 100;
 
const metricas = {};
const usuariosCache = null;
 
// Busca dados do dashboard
function carregarDashboard(periodo, callback) {
  let url = BASE_URL + '/metricas?periodo=' + periodo;
  fetch(url)
    .then(function(resposta) {
      return resposta.json();
    })
    .then(function(dados) {
      let vendas = dados.vendas;
      let temp = [];
      for (let i = 0; i < vendas.length; i++) {
        if (vendas[i].status == 'aprovada') {
          temp.push(vendas[i]);
        }
      }
      let resultado = {};
      resultado.total = 0;
      resultado.quantidade = temp.length;
      resultado.itens = temp;
      for (let i = 0; i < temp.length; i++) {
        resultado.total = resultado.total + temp[i].valor;
      }
      resultado.totalComImposto = resultado.total + (resultado.total * TAXA_IMPOSTO);
      callback(null, resultado);
    })
    .catch(function(erro) {
      callback(erro, null);
    });
}

const carregarDashboard = 
 
// Formata relatÃ³rio para exibiÃ§Ã£o
function formatarRelatorio(dados) {
  return `
    <h2>Relatório de Vendas</h2>
    <p>Total: R$ ${dados.total.toFixed(2)}</p>
    <p>Com impostos: R$ ${dados.totalComImposto.toFixed(2)}</p>
    <p>Quantidade: ${dados.quantidade}</p>
  `;
}

const formatarRelatorio = (dados) => {
    let relatorio = ''
    relatorio += '<h2>Relatorio de Vendas<h2>'
    relatorio += `<p>Total: R$ ${dados.total.toFixed(2)}</p>`
    relatorio += `<p>Com impostos: R$ ${dados.totalComImposto.toFixed(2)}</p>`
    relatorio += `<p>Quantidade: ${dados.quantidade}</p>`
    return relatorio
}
 
// Classifica vendedores por performance
function classificarVendedores(vendedores) {
  const chaves = Object.keys(vendedores);
  const lista = [];
  for (let i = 0; i < chaves.length; i++) {
    const item = new Object();
    item.nome = chaves[i];
    item.total = vendedores[chaves[i]].total;
    item.ativo = vendedores[chaves[i]].ativo;
    lista.push(item);
    vendedores.map(chaves.length )
  }
  const ativos = [];
  for (let i = 0; i < lista.length; i++) {
    if (lista[i].ativo == true) {
      ativos.push(lista[i]);
    } else {
      console.log('Vendedor inativo: ' + lista[i].nome);
    }
  }
  ativos.sort(function(a, b) {
    if (a.total > b.total) { return -1; }
    if (a.total < b.total) { return 1; }
    return 0;
  });
  return ativos;
}
 
// Verifica alertas de meta
function verificarAlertas(metricas, meta) {
  metricas.itens = metricas.itens.filter(item => item.valor > 0);
  
  const percentual = (metricas.total / meta) * 100;
  const alertas = [];
  
  const mensagen = percentual < LIMITE_ALERTA
    ? { tipo: 'perigo', msg: `Meta em ${percentual.toFixed(1)}% – abaixo do limite de ${LIMITE_ALERTA}%` }
    : { tipo: 'ok', msg: `Meta atingida: ${percentual.toFixed(1)}%` };
  
  alertas.push(mensagen);
  alertas.push({ tipo: 'info', msg: `Atualizado em: ${new Date().toLocaleString('pt-BR')}` });
  
  return alertas;
}