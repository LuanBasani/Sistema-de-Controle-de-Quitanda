# Sistema de Controle de Quitanda (Quitanda MVC)

Projeto frontend em JavaScript com arquitetura MVC (Model-View-Controller), focado em gerenciamento de produtos, estoque, vendas e historico de movimentacoes.

## Objetivo

Organizar o desenvolvimento de um sistema web simples para:

- Cadastrar produtos
- Atualizar estoque
- Registrar vendas
- Listar estoque
- Consultar historico de movimentacoes

## Stack

- HTML
- CSS
- JavaScript
- Arquitetura MVC
- Programacao Orientada a Objetos (POO)

## Estrutura do Projeto

```text
SAProjetoGerenciamentoQuitanda/
|-- index.html
|-- README.md
|-- .gitignore
|-- assets/
|   |-- css/
|   |   `-- styles.css
|   |-- js/
|   |   `-- main.js
|   `-- img/
|-- docs/
|   `-- SRS.md
|-- src/
|   |-- app.js
|   |-- config/
|   |   `-- constants.js
|   |-- controllers/
|   |   |-- ProductController.js
|   |   |-- SaleController.js
|   |   `-- StockController.js
|   |-- data/
|   |   `-- mockData.js
|   |-- models/
|   |   |-- ProductModel.js
|   |   |-- SaleModel.js
|   |   `-- StockModel.js
|   |-- routes/
|   |   `-- routes.js
|   |-- services/
|   |   `-- StorageService.js
|   |-- utils/
|   |   |-- formatters.js
|   |   `-- validators.js
|   `-- views/
|       |-- ProductView.js
|       |-- SaleView.js
|       `-- StockView.js
`-- tests/
    `-- .gitkeep
```

## Responsabilidade por Camada

- Model: regras de negocio e estado dos dados.
- View: renderizacao e interacao com a interface.
- Controller: fluxo entre View e Model.
- Services/Utils: suporte tecnico (persistencia, validacoes e formatacoes).

## Status

Estrutura inicial criada. Arquivos mantidos sem implementacao para desenvolvimento posterior.
