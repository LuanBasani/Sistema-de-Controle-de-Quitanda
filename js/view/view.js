class QuitandaView {
    // RF-003 — Exibe estoque
    renderStock(products) {
        const tbody = document.getElementById('stock-table-body');
        tbody.innerHTML = '';

        if (products.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5">Nenhum produto cadastrado.</td></tr>`;
            return;
        }

        products.forEach(product => {
            const row = document.createElement('tr');
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

    // RF-005 — Exibe histórico de movimentações
    renderSales(history) {
        const tbody = document.getElementById('history-table-body');
        tbody.innerHTML = '';

        if (history.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4">Nenhuma movimentação registrada.</td></tr>`;
            return;
        }

        history.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(entry.data).toLocaleString('pt-BR')}</td>
                <td>${entry.tipo === 'entrada' ? 'Entrada' : 'Venda'}</td>
                <td>${entry.nome}</td>
                <td>${entry.quantidade}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // RF-001, 002, 004 — Feedback ao usuário
    renderNotification(message, type = 'success') {
        const notification = document.getElementById('notification');

        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
}