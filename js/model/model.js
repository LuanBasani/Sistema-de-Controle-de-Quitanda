class QuitandaModel {
    constructor() {
        this.products = [];
        this.history  = [];
        this.nextId   = 1;
    }

    // Retorna todos os produtos
    getProducts() {
        return this.products;
    }

    // Verifica se produto já existe pelo nome (case-insensitive)
    productExists(name) {
        return this.products.some(
        p => p.name.toLowerCase() === name.trim().toLowerCase()
        );
    }

    // Cadastra um novo produto
    // Retorna { success, message }
    addProduct(dados) {
        if (this.productExists(dados.name)) {
        return { success: false, message: `Produto "${dados.name}" já cadastrado.` };
        }

        const produto = {
        id:       this.nextId++,
        name:     dados.name.trim(),
        category: dados.category?.trim() || "Sem categoria",
        price:    Number(dados.price),
        quantity: Number(dados.quantity)
        };

        this.products.push(produto);
        return { success: true, message: "Produto cadastrado." };
    }

    // Atualiza um produto existente (adiciona quantidade e atualiza preço)
    // Retorna { success, message }
    updateProduct(dados) {
        const produto = this.products.find(
        p => p.name.toLowerCase() === dados.name.trim().toLowerCase()
        );

        if (!produto) {
        return { success: false, message: `Produto "${dados.name}" não encontrado.` };
        }

        produto.quantity += Number(dados.quantity);
        produto.price     = Number(dados.price);

        if (dados.category) {
        produto.category = dados.category.trim();
        }

        return { success: true, message: "Estoque atualizado." };
    }

    // Realiza uma venda: subtrai quantity e retorna o valor total
    // Retorna { success, message, totalValue }
    sellProduct(name, quantity) {
        const produto = this.products.find(
        p => p.name.toLowerCase() === name.trim().toLowerCase()
        );

        if (!produto) {
        return { success: false, message: `Produto "${name}" não encontrado.`, totalValue: 0 };
        }

        if (produto.quantity < quantity) {
        return {
            success: false,
            message: `Estoque insuficiente. Disponível: ${produto.quantity}`,
            totalValue: 0
        };
        }

        produto.quantity -= quantity;
        const totalValue  = produto.price * quantity;

        return { success: true, message: "Venda realizada.", totalValue };
    }

    // Retorna o histórico de movimentações
    getHistory() {
        return this.history;
    }

    // Registra uma movimentação no histórico
    addMovement(movimento) {
        this.history.push(movimento);
    }
}