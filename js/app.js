class QuitandaModel {
    constructor() {
        this.products = [];
        this.history = [];
        this.nextId = 1;
    }

    getProducts() {
        return this.products;
    }

    productExists(name) {
        return this.products.some(
        (p) => p.name.toLowerCase() === name.trim().toLowerCase(),
        );
    }

    addProduct(dados) {
        if (this.productExists(dados.name)) {
        return {
            success: false,
            message: `Produto "${dados.name}" já cadastrado.`,
        };
        }

        const produto = {
        id: this.nextId++,
        name: dados.name.trim(),
        category: dados.category?.trim() || "Sem categoria",
        price: Number(dados.price),
        quantity: Number(dados.quantity),
        };

        this.products.push(produto);
        return { success: true, message: "Produto cadastrado." };
    }

    updateProduct(dados) {
        const produto = this.products.find(
        (p) => p.name.toLowerCase() === dados.name.trim().toLowerCase(),
        );

        if (!produto) {
        return {
            success: false,
            message: `Produto "${dados.name}" não encontrado.`,
        };
        }

        produto.quantity += Number(dados.quantity);
        produto.price = Number(dados.price);

        if (dados.category) {
        produto.category = dados.category.trim();
        }

        return { success: true, message: "Estoque atualizado." };
    }

    sellProduct(name, quantity) {
        const produto = this.products.find(
        (p) => p.name.toLowerCase() === name.trim().toLowerCase(),
        );

        if (!produto) {
        return {
            success: false,
            message: `Produto "${name}" não encontrado.`,
            totalValue: 0,
        };
        }

        if (produto.quantity < quantity) {
        return {
            success: false,
            message: `Estoque insuficiente. Disponível: ${produto.quantity}`,
            totalValue: 0,
        };
        }

        produto.quantity -= quantity;
        const totalValue = produto.price * quantity;

        return { success: true, message: "Venda realizada.", totalValue };
    }

    getHistory() {
        return this.history;
    }

    addMovement(movimento) {
        this.history.push(movimento);
    }
}

class QuitandaView {
    renderStock(products) {
        const tbody = document.getElementById("stock-table-body");
        tbody.innerHTML = "";

        if (products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">Nenhum produto cadastrado.</td></tr>`;
        return;
        }

        products.forEach((product) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>R$ ${product.price.toFixed(2)}</td>
                    <td>${product.quantity}</td>
                `;
        tbody.appendChild(row);
        });
    }

    renderSales(history) {
        const tbody = document.getElementById("history-table-body");
        tbody.innerHTML = "";

        if (history.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4">Nenhuma movimentação registrada.</td></tr>`;
        return;
        }

        history.forEach((entry) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${new Date(entry.data).toLocaleString("pt-BR")}</td>
                    <td>${entry.tipo === "entrada" ? "Entrada" : "Venda"}</td>
                    <td>${entry.nome}</td>
                    <td>${entry.quantidade}</td>
                `;
        tbody.appendChild(row);
        });
    }

    renderNotification(message, type = "success") {
        const notification = document.getElementById("notification");

        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = "block";

        setTimeout(() => {
        notification.style.display = "none";
        }, 3000);
    }
    }

    class QuitandaController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    handleAddProduct(dadosProduto) {
        if (!dadosProduto.name || dadosProduto.name.trim() === "") {
        this.view.renderNotification(
            "Erro: Nome do produto é obrigatório.",
            "error",
        );
        return;
        }

        if (dadosProduto.price < 0 || isNaN(dadosProduto.price)) {
        this.view.renderNotification("Erro: Preço inválido.", "error");
        return;
        }

        if (dadosProduto.quantity < 0 || isNaN(dadosProduto.quantity)) {
        this.view.renderNotification("Erro: Quantidade inválida.", "error");
        return;
        }

        const resultado = this.model.addProduct(dadosProduto);

        if (!resultado.success) {
        this.view.renderNotification(`Erro: ${resultado.message}`, "error");
        return;
        }

        this._registrarMovimentacao(
        "entrada",
        dadosProduto.name,
        dadosProduto.quantity,
        dadosProduto.price,
        );

        this.view.renderNotification(
        `Produto "${dadosProduto.name}" cadastrado com sucesso!`,
        "success",
        );

        this.handleUpdateStock();
        this.handleUpdateSales();
    }

    handleUpdateStock(dadosProduto) {
        if (!dadosProduto) {
        const produtos = this.model.getProducts();
        this.view.renderStock(produtos);
        return;
        }

        if (!dadosProduto.name || dadosProduto.name.trim() === "") {
        this.view.renderNotification("Erro: Nome obrigatório.", "error");
        return;
        }

        const existe = this.model.productExists(dadosProduto.name);

        if (!existe) {
        this.view.renderNotification(
            `Erro: Produto "${dadosProduto.name}" não encontrado.`,
            "error",
        );
        return;
        }

        if (dadosProduto.price < 0 || isNaN(dadosProduto.price)) {
        this.view.renderNotification("Erro: Preço inválido.", "error");
        return;
        }

        if (dadosProduto.quantity < 0 || isNaN(dadosProduto.quantity)) {
        this.view.renderNotification("Erro: Quantidade inválida.", "error");
        return;
        }

        const resultado = this.model.updateProduct(dadosProduto);

        if (!resultado.success) {
        this.view.renderNotification(`Erro: ${resultado.message}`, "error");
        return;
        }

        this._registrarMovimentacao(
        "entrada",
        dadosProduto.name,
        dadosProduto.quantity,
        dadosProduto.price,
        );

        this.view.renderNotification("Estoque atualizado com sucesso!", "success");

        this.handleUpdateStock();
        this.handleUpdateSales();
    }

    handleSellProduct(dadosVenda) {
        if (!dadosVenda.name || dadosVenda.name.trim() === "") {
        this.view.renderNotification("Erro: Nome obrigatório.", "error");
        return;
        }

        if (dadosVenda.quantity <= 0 || isNaN(dadosVenda.quantity)) {
        this.view.renderNotification("Erro: Quantidade inválida.", "error");
        return;
        }

        const resultado = this.model.sellProduct(
        dadosVenda.name,
        dadosVenda.quantity,
        );

        if (!resultado.success) {
        this.view.renderNotification(`Erro: ${resultado.message}`, "error");
        return;
        }

        this._registrarMovimentacao(
        "saida",
        dadosVenda.name,
        dadosVenda.quantity,
        resultado.totalValue,
        );

        this.view.renderNotification(
        `Venda realizada! Total: R$ ${resultado.totalValue.toFixed(2)}`,
        "success",
        );

        this.handleUpdateStock();
        this.handleUpdateSales();
    }

    handleUpdateSales() {
        const historico = this.model.getHistory();
        this.view.renderSales(historico);
    }

    _registrarMovimentacao(tipo, nome, quantidade, valor) {
        this.model.addMovement({
        tipo,
        nome,
        quantidade,
        valor,
        data: new Date().toISOString(),
        });
    }
}

// Aqui começa o funcionamento do sistema
const model = new QuitandaModel();
const view = new QuitandaView();
const controller = new QuitandaController(model, view);

// Botão de cadastrar produto
document.getElementById("btn-add-product").addEventListener("click", () => {
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

// Botão de vender produto
document.getElementById("btn-sell-product").addEventListener("click", () => {
    const venda = {
        name: document.getElementById("sell-name").value,
        quantity: Number(document.getElementById("sell-quantity").value),
    };

    controller.handleSellProduct(venda);

    document.getElementById("sell-name").value = "";
    document.getElementById("sell-quantity").value = "";
});

// Mostra estoque e histórico quando abrir a página
controller.handleUpdateStock();
controller.handleUpdateSales();
