const model = new QuitandaModel();
const view = new QuitandaView();
const controller = new QuitandaController(model, view);

// Botão cadastrar / dar entrada no produto
document
  .getElementById("btn-add-product")
  .addEventListener("click", function () {
    const produto = {
      name: document.getElementById("input-name").value,
      category: document.getElementById("input-category").value,
      price: Number(document.getElementById("input-price").value),
      quantity: Number(document.getElementById("input-quantity").value),
    };

    controller.handleAddProduct(produto);

    document.getElementById("input-name").value = "";
    document.getElementById("input-category").value = "";
    document.getElementById("input-price").value = "";
    document.getElementById("input-quantity").value = "";
  });

// Botão registrar venda
document
  .getElementById("btn-sell-product")
  .addEventListener("click", function () {
    const venda = {
      name: document.getElementById("sell-name").value,
      quantity: Number(document.getElementById("sell-quantity").value),
    };

    controller.handleSellProduct(venda);

    document.getElementById("sell-name").value = "";
    document.getElementById("sell-quantity").value = "";
  });

// Atualiza as tabelas quando abrir a página
controller.handleUpdateStock();
controller.handleUpdateSales();
