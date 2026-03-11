// dashboard.js – Módulo de Métricas de Vendas
// Refatorado com boas práticas de JavaScript moderno

const BASE_URL = 'https://api.empresa.com';
const TAXA_IMPOSTO = 0.15;
const LIMITE_ALERTA = 100;

/**
 * Busca dados do dashboard
 * @param {string} periodo - Período para filtrar métricas
 * @returns {Promise<Object>} Resultado com métricas de vendas
 */
async function carregarDashboard(periodo) {
  try {
    const url = `${BASE_URL}/metricas?periodo=${periodo}`;
    const resposta = await fetch(url);
    
    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }
    
    const dados = await resposta.json();
    
    const vendasAprovadas = dados.vendas.filter(v => v.status === 'aprovada');
    const total = vendasAprovadas.reduce((sum, v) => sum + v.valor, 0);
    
    return {
      total,
      quantidade: vendasAprovadas.length,
      itens: vendasAprovadas,
      totalComImposto: total + (total * TAXA_IMPOSTO)
    };
  } catch (erro) {
    console.error('Erro ao carregar dashboard:', erro);
    throw erro;
  }
}

/**
 * Formata relatório para exibição em HTML
 * @param {Object} dados - Dados de vendas
 * @returns {string} HTML formatado
 */
function formatarRelatorio(dados) {
  return `
    <h2>Relatório de Vendas</h2>
    <p>Total: R$ ${dados.total.toFixed(2)}</p>
    <p>Com impostos: R$ ${dados.totalComImposto.toFixed(2)}</p>
    <p>Quantidade: ${dados.quantidade}</p>
  `;
}

/**
 * Classifica vendedores por performance
 * @param {Object} vendedores - Objeto com dados de vendedores
 * @returns {Array} Lista de vendedores ativos ordenados por total
 */
function classificarVendedores(vendedores) {
  const lista = Object.entries(vendedores).map(([nome, dados]) => ({
    nome,
    total: dados.total,
    ativo: dados.ativo
  }));
  
  const ativos = lista.filter(vendedor => {
    if (!vendedor.ativo) {
      console.log(`Vendedor inativo: ${vendedor.nome}`);
      return false;
    }
    return true;
  });
  
  // Ordena por total em ordem decrescente
  return ativos.sort((a, b) => b.total - a.total);
}

/**
 * Verifica alertas de meta de vendas
 * @param {Object} metricas - Métricas de vendas
 * @param {number} meta - Meta de vendas
 * @returns {Array} Lista de alertas
 */
function verificarAlertas(metricas, meta) {
  // Remove itens com valor zero
  metricas.itens = metricas.itens.filter(item => item.valor > 0);
  
  const percentual = (metricas.total / meta) * 100;
  const alertas = [];
  
  // Alerta baseado no percentual atingido
  const alerta = percentual < LIMITE_ALERTA
    ? {
        tipo: 'perigo',
        msg: `Meta em ${percentual.toFixed(1)}% – abaixo do limite de ${LIMITE_ALERTA}%`
      }
    : {
        tipo: 'ok',
        msg: `Meta atingida: ${percentual.toFixed(1)}%`
      };
  
  alertas.push(alerta);
  
  // Adiciona timestamp formatado
  const dataFormatada = new Date().toLocaleString('pt-BR');
  alertas.push({
    tipo: 'info',
    msg: `Atualizado em: ${dataFormatada}`
  });
  
  return alertas;
}
