(function () {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';

  function elementoSvg(nome, atributos = {}) {
    const elemento = document.createElementNS(SVG_NS, nome);
    Object.entries(atributos).forEach(([chave, valor]) => elemento.setAttribute(chave, valor));
    return elemento;
  }

  function texto(svg, conteudo, x, y, atributos = {}) {
    const item = elementoSvg('text', { x, y, ...atributos });
    item.textContent = conteudo;
    svg.appendChild(item);
  }

  function renderizarVendasCompras() {
    const container = document.getElementById('salesPurchaseChart');
    if (!container) return;

    const vendas = [44, 55, 57, 56, 61, 58, 63, 60, 66];
    const compras = [76, 85, 101, 98, 87, 105, 91, 114, 94];
    const labels = ['28 Jan', '29 Jan', '30 Jan', '31 Jan', '1 Fev', '2 Fev', '3 Fev', '4 Fev', '5 Fev'];
    const largura = 720;
    const altura = 330;
    const margem = { topo: 18, direita: 16, baixo: 48, esquerda: 48 };
    const areaLargura = largura - margem.esquerda - margem.direita;
    const areaAltura = altura - margem.topo - margem.baixo;
    const maximo = 120;
    const grupo = areaLargura / labels.length;
    const barra = Math.min(20, grupo * .28);
    const svg = elementoSvg('svg', {
      viewBox: `0 0 ${largura} ${altura}`,
      role: 'img',
      'aria-label': 'Vendas comparadas às compras',
      class: 'dashboard-chart dashboard-chart--bars'
    });

    for (let valor = 0; valor <= maximo; valor += 20) {
      const y = margem.topo + areaAltura - (valor / maximo) * areaAltura;
      svg.appendChild(elementoSvg('line', {
        x1: margem.esquerda, y1: y, x2: largura - margem.direita, y2: y,
        stroke: '#e2e8f0', 'stroke-width': 1
      }));
      texto(svg, `${valor}k`, margem.esquerda - 8, y + 4, {
        'text-anchor': 'end', fill: '#667085', 'font-size': 10
      });
    }

    labels.forEach((label, indice) => {
      const centro = margem.esquerda + grupo * indice + grupo / 2;
      const alturaVenda = (vendas[indice] / maximo) * areaAltura;
      const alturaCompra = (compras[indice] / maximo) * areaAltura;

      svg.appendChild(elementoSvg('rect', {
        x: centro - barra - 2, y: margem.topo + areaAltura - alturaVenda,
        width: barra, height: alturaVenda, rx: 3, fill: '#f7a085'
      }));
      svg.appendChild(elementoSvg('rect', {
        x: centro + 2, y: margem.topo + areaAltura - alturaCompra,
        width: barra, height: alturaCompra, rx: 3, fill: '#E66239'
      }));
      texto(svg, label, centro, altura - 22, {
        'text-anchor': 'middle', fill: '#475467', 'font-size': 10
      });
    });

    container.replaceChildren(svg);
  }

  function renderizarClientes() {
    const container = document.getElementById('customerChart');
    if (!container) return;

    const svg = elementoSvg('svg', {
      viewBox: '0 0 220 220',
      role: 'img',
      'aria-label': 'Clientes de primeira vez e recorrentes',
      class: 'dashboard-chart dashboard-chart--radial'
    });
    const centro = 110;
    const raioExterno = 72;
    const raioInterno = 52;

    function circulo(raio, progresso, cor, rotacao) {
      const perimetro = 2 * Math.PI * raio;
      svg.appendChild(elementoSvg('circle', {
        cx: centro, cy: centro, r: raio, fill: 'none', stroke: '#f0f0f0',
        'stroke-width': 12
      }));
      svg.appendChild(elementoSvg('circle', {
        cx: centro, cy: centro, r: raio, fill: 'none', stroke: cor,
        'stroke-width': 12, 'stroke-linecap': 'round',
        'stroke-dasharray': `${perimetro * progresso} ${perimetro}`,
        transform: `rotate(${rotacao} ${centro} ${centro})`
      }));
    }

    circulo(raioExterno, .55, '#039855', -90);
    circulo(raioInterno, .44, '#f79009', -90);
    texto(svg, 'Clientes', centro, centro + 5, {
      'text-anchor': 'middle', fill: '#344054', 'font-size': 13, 'font-weight': 600
    });
    container.replaceChildren(svg);
  }

  function renderizar() {
    renderizarVendasCompras();
    renderizarClientes();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderizar, { once: true });
  } else {
    renderizar();
  }
})();
