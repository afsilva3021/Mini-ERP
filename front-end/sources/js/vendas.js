document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("myModal");
  const itemList = document.getElementById("orderItems");
  const productName = document.getElementById("productName");
  const productQuantity = document.getElementById("productQuantity");
  const productPrice = document.getElementById("productPrice");
  const discount = document.getElementById("orderDiscount");
  const items = [];
  const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  const render = () => {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const discountValue = Math.max(0, Number(discount?.value) || 0);
    document.getElementById("itemsCounter").textContent = `${items.length} ${items.length === 1 ? "item" : "itens"}`;
    document.getElementById("orderSubtotal").textContent = money.format(subtotal);
    document.getElementById("orderTotal").textContent = money.format(Math.max(0, subtotal - discountValue));

    if (!items.length) {
      itemList.innerHTML = '<tr class="empty-items"><td colspan="5"><div><i class="ti ti-package-off"></i><strong>Nenhum produto adicionado</strong><span>Use os campos acima para incluir itens.</span></div></td></tr>';
      return;
    }

    itemList.innerHTML = items.map((item, index) => `<tr><td><strong>${item.name}</strong></td><td class="text-center">${item.quantity.toLocaleString("pt-BR")}</td><td class="text-end">${money.format(item.price)}</td><td class="text-end fw-semibold">${money.format(item.quantity * item.price)}</td><td class="text-end"><button type="button" class="btn btn-sm btn-light text-danger remove-product" data-index="${index}" aria-label="Remover item"><i class="ti ti-trash"></i></button></td></tr>`).join("");
  };

  document.getElementById("addProduct")?.addEventListener("click", () => {
    const name = productName.value.trim();
    const quantity = Number(productQuantity.value);
    const price = Number(productPrice.value);
    if (!name || quantity <= 0 || price < 0 || productPrice.value === "") {
      [productName, productQuantity, productPrice].forEach((field) => field.classList.toggle("is-invalid", !field.value || Number(field.value) < 0));
      return;
    }
    items.push({ name, quantity, price });
    [productName, productPrice].forEach((field) => { field.value = ""; field.classList.remove("is-invalid"); });
    productQuantity.value = "1";
    productName.focus();
    render();
  });

  itemList?.addEventListener("click", (event) => {
    const button = event.target.closest(".remove-product");
    if (!button) return;
    items.splice(Number(button.dataset.index), 1);
    render();
  });
  discount?.addEventListener("input", render);
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
  });

  const issueDate = document.getElementById("issueDate");
  if (issueDate && !issueDate.value) issueDate.value = new Date().toISOString().slice(0, 10);

  const searchForm = document.getElementById("salesSearchForm");
  const searchInput = document.getElementById("pesquisa_pedido");
  const searchButton = document.getElementById("salesSearchButton");
  const searchStatus = document.getElementById("salesSearchStatus");
  const salesTableBody = document.querySelector("#table_vendas tbody");

  // Escapa metacaracteres para que qualquer texto digitado gere uma regex válida e segura.
  const createSearchRegex = (value) => new RegExp(
    value.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    "i"
  );

  const filterSalesRows = () => {
    const regex = createSearchRegex(searchInput?.value || "");
    let visibleRows = 0;

    salesTableBody?.querySelectorAll("tr").forEach((row) => {
      const cells = row.cells;
      if (cells.length < 3) return;
      const searchableText = `${cells[1].textContent} ${cells[2].textContent}`;
      const visible = regex.test(searchableText);
      row.hidden = !visible;
      if (visible) visibleRows += 1;
    });

    if (searchStatus) searchStatus.textContent = `${visibleRows} pedido(s) encontrado(s).`;
    return visibleRows;
  };

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[character]);

  const renderApiSales = (sales) => {
    if (!salesTableBody || !Array.isArray(sales)) return;
    if (!sales.length) {
      salesTableBody.innerHTML = '<tr><td colspan="6" class="py-5 text-center text-muted">Nenhum pedido encontrado na API.</td></tr>';
      return;
    }

    salesTableBody.innerHTML = sales.map((sale) => {
      const status = Number(sale.status_pedido) === 1 ? "status-amarelo" : "status-verde";
      const customer = sale.cliente_nome || sale.cliente || sale.razao_social || sale.cliente_uuid || "Cliente não informado";
      const order = sale.numero || sale.pedido_id || sale.uuid || "—";
      return `<tr><td><span class="status-container"><span class="bolinha-status ${status}"></span></span></td><td class="ps-4 fw-medium">#${escapeHtml(order)}</td><td>${escapeHtml(customer)}</td><td>${escapeHtml(sale.produto || "—")}</td><td>${money.format(Number(sale.valor_total) || 0)}</td><td class="pe-4 text-end"><button type="button" class="btn btn-sm btn-outline-secondary">Ver</button></td></tr>`;
    }).join("");
  };

  searchInput?.addEventListener("input", filterSalesRows);
  searchForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    searchButton.disabled = true;
    searchButton.innerHTML = '<span class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span> Buscando';

    try {
      if (!window.api?.listarVendas) throw new Error("O back-end ainda nao possui uma rota de vendas.");
      const sales = await window.api.listarVendas();
      renderApiSales(sales);
      const count = filterSalesRows();
      searchStatus.textContent = `${count} pedido(s) encontrado(s) na API.`;
    } catch (error) {
      console.error("Erro ao consultar pedidos:", error);
      searchStatus.textContent = error.message || "Não foi possível consultar os pedidos.";
    } finally {
      searchButton.disabled = false;
      searchButton.innerHTML = '<span class="search-button-label">Buscar</span>';
    }
  });

  const normalizeApiList = (response) => Array.isArray(response)
    ? response
    : response?.dados || response?.data || response?.resultados || response?.items || [];

  const setupLookup = ({ type, openerId, modalId, formId, inputId, resultsId, feedbackId, request, select }) => {
    const lookupModal = document.getElementById(modalId);
    const lookupForm = document.getElementById(formId);
    const lookupInput = document.getElementById(inputId);
    const results = document.getElementById(resultsId);
    const feedback = document.getElementById(feedbackId);
    let records = [];

    document.getElementById(openerId)?.addEventListener("click", () => {
      lookupModal.showModal();
      setTimeout(() => lookupInput.focus(), 0);
    });
    lookupModal?.querySelector(".close-lookup")?.addEventListener("click", () => lookupModal.close());
    lookupModal?.addEventListener("click", (event) => { if (event.target === lookupModal) lookupModal.close(); });
    lookupForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const term = lookupInput.value.trim();
      const button = lookupForm.querySelector("button[type='submit']");
      if (!term) { feedback.textContent = "Digite um termo para pesquisar."; return; }
      button.disabled = true;
      button.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>';
      feedback.textContent = `Consultando ${type}...`;
      results.innerHTML = "";
      try {
        records = normalizeApiList(await request(term));
        feedback.textContent = `${records.length} resultado(s) encontrado(s).`;
        results.innerHTML = records.map((record, index) => {
          const title = type === "clientes" ? (record.nome || record.razao_social || record.nome_fantasia) : (record.descricao || record.nome);
          const code = record.codigo || record.id || record.uuid || "Sem código";
          const detail = type === "clientes" ? (record.cnpj || record.cpf || record.documento || code) : (record.codigo_barras || record.sku || code);
          return `<button type="button" class="list-group-item list-group-item-action lookup-result" data-index="${index}"><span><strong>${escapeHtml(title || "Sem descrição")}</strong><small>${escapeHtml(detail)}</small></span><i class="ti ti-chevron-right text-primary"></i></button>`;
        }).join("");
      } catch (error) {
        console.error(`Erro ao pesquisar ${type}:`, error);
        feedback.textContent = error.message || `Não foi possível consultar ${type}.`;
      } finally {
        button.disabled = false;
        button.textContent = "Pesquisar";
      }
    });
    results?.addEventListener("click", (event) => {
      const option = event.target.closest(".lookup-result");
      if (!option) return;
      select(records[Number(option.dataset.index)]);
      lookupModal.close();
    });
  };

  setupLookup({
    type: "clientes", openerId: "openCustomerSearch", modalId: "customerSearchModal",
    formId: "customerLookupForm", inputId: "customerLookupInput", resultsId: "customerLookupResults", feedbackId: "customerLookupFeedback",
    request: (term) => window.api?.buscarClientes
      ? window.api.buscarClientes(term)
      : Promise.reject(new Error("O back-end ainda nao possui uma rota de clientes.")),
    select: (customer) => {
      const field = document.getElementById("inputClientNew");
      field.value = customer.nome || customer.razao_social || customer.nome_fantasia || "";
      field.dataset.customerId = customer.uuid || customer.id || "";
      document.getElementById("customerDocument").value = customer.cnpj || customer.cpf || customer.documento || "";
      document.getElementById("customerCity").value = customer.cidade || "";
      document.getElementById("customerState").value = customer.uf || customer.estado || "";
    }
  });

  setupLookup({
    type: "produtos", openerId: "openProductSearch", modalId: "productSearchModal",
    formId: "productLookupForm", inputId: "productLookupInput", resultsId: "productLookupResults", feedbackId: "productLookupFeedback",
    request: async (term) => {
      if (!window.api?.listarProdutos) throw new Error("API de produtos indisponivel.");
      const products = await window.api.listarProdutos();
      const query = term.toLocaleLowerCase("pt-BR");
      return products.filter((product) =>
        [product.descricao, product.nome, product.codigo, product.codigo_barras, product.sku]
          .some((value) => String(value || "").toLocaleLowerCase("pt-BR").includes(query))
      );
    },
    select: (product) => {
      productName.value = product.descricao || product.nome || "";
      productName.dataset.productId = product.uuid || product.id || "";
      productPrice.value = Number(product.preco_venda ?? product.preco ?? product.valor_unitario ?? 0).toFixed(2);
      productQuantity.focus();
    }
  });
});
