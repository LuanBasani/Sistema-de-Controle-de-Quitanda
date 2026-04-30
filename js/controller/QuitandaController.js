class QuitandaController {
  constructor(model, view) {
    this.model = model;
    this.view  = view;
  }

  // Cadastro de produto
  handleAddProduct(dadosProduto) {

    // Validação: nome obrigatório
    if (!dadosProduto.name || dadosProduto.name.trim() === "") {
      this.view.renderNotification("Erro: Nome do produto é obrigatório.", "error");
      return;
    }

    // Validação: preço
    if (dadosProduto.price < 0) {
      this.view.renderNotification("Erro: Preço não pode ser negativo.", "error");
      return;
    }

    // Validação: quantidade
    if (dadosProduto.quantity < 0) {
      this.view.renderNotification("Erro: Quantidade não pode ser negativa.", "error");
      return;
    }

    // Adiciona produto
    const resultado = this.model.addProduct(dadosProduto);

    if (!resultado.success) {
      this.view.renderNotification(`Erro: ${resultado.message}`, "error");
      return;
    }

    // Registra movimentação
    this._registrarMovimentacao("entrada", dadosProduto.name, dadosProduto.quantity, dadosProduto.price);

    // Notifica sucesso
    this.view.renderNotification(`Produto "${dadosProduto.name}" cadastrado com sucesso!`, "success");

    this.handleUpdateStock();
  }

  // Atualizar estoque
  handleUpdateStock(dadosProduto) {

    // Apenas mostrar estoque
    if (!dadosProduto) {
      const produtos = this.model.getProducts();
      this.view.renderStock(produtos);
      return;
    }

    // Verifica se existe
    const existe = this.model.productExists(dadosProduto.name);
    if (!existe) {
      this.view.renderNotification(
        `Erro: Produto "${dadosProduto.name}" não encontrado.`,
        "error"
      );
      return;
    }

    // Validações
    if (!dadosProduto.name || dadosProduto.name.trim() === "") {
      this.view.renderNotification("Erro: Nome obrigatório.", "error");
      return;
    }

    if (dadosProduto.price < 0) {
      this.view.renderNotification("Erro: Preço inválido.", "error");
      return;
    }

    if (dadosProduto.quantity < 0) {
      this.view.renderNotification("Erro: Quantidade inválida.", "error");
      return;
    }

    const resultado = this.model.updateProduct(dadosProduto);

    if (!resultado.success) {
      this.view.renderNotification(`Erro: ${resultado.message}`, "error");
      return;
    }

    // Registra movimentação
    this._registrarMovimentacao("entrada", dadosProduto.name, dadosProduto.quantity, dadosProduto.price);

    // Atualiza tela
    this.view.renderNotification(`Estoque atualizado com sucesso!`, "success");

    const produtos = this.model.getProducts();
    this.view.renderStock(produtos);
  }

  // Venda de produto
  handleSellProduct(dadosVenda) {

    // Validação
    if (!dadosVenda.name || dadosVenda.name.trim() === "") {
      this.view.renderNotification("Erro: Nome obrigatório.", "error");
      return;
    }

    if (dadosVenda.quantity <= 0) {
      this.view.renderNotification("Erro: Quantidade inválida.", "error");
      return;
    }

    // Realiza venda
    const resultado = this.model.sellProduct(dadosVenda.name, dadosVenda.quantity);

    if (!resultado.success) {
      this.view.renderNotification(`Erro: ${resultado.message}`, "error");
      return;
    }

    // Registra movimentação
    this._registrarMovimentacao("saida", dadosVenda.name, dadosVenda.quantity, resultado.totalValue);

    // Notifica
    this.view.renderNotification(
      `Venda realizada! Total: R$ ${resultado.totalValue.toFixed(2)}`,
      "success"
    );

    // Atualiza telas
    const produtos = this.model.getProducts();
    this.view.renderStock(produtos);
    this.handleUpdateSales();
  }

  // Atualizar histórico
  handleUpdateSales() {
    const historico = this.model.getHistory();
    this.view.renderSales(historico);
  }

  // Registrar movimentação
  _registrarMovimentacao(tipo, nome, quantidade, valor) {
    this.model.addMovement({
      tipo,
      nome,
      quantidade,
      valor,
      data: new Date().toISOString()
    });
  }
} 