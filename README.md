# Florist Admin Platform

Plataforma Full Stack para gerenciamento e venda online de uma floricultura.

Este projeto é uma evolução do [Florist Catalog](https://github.com/guiac-sz/florist-catalog). Além do catálogo, ele adiciona login de clientes e administradores, compra direto no site e um painel para que a própria floricultura gerencie seus produtos, a vitrine e os pedidos.

## Protótipo

Todas as telas foram desenhadas no Figma antes do início do desenvolvimento:

[Ateliê Flora — Site completo (Figma)](https://www.figma.com/design/s0ovw6mhBVNBh8HZp6gEqs)

O arquivo tem três páginas:

- **Leia-me:** mapa de telas, mudanças em relação ao Florist Catalog e notas para o desenvolvimento
- **Base visual:** paleta de cores, tipografia, ícones e componentes reutilizáveis
- **Telas:** 39 telas, divididas por fluxo (loja, compra, login, área do cliente, administrador, mobile e extras)

## Perfis de acesso

| Perfil | O que pode fazer |
| --- | --- |
| Visitante | Navegar pelo catálogo, ver detalhes e montar o carrinho |
| Cliente | Tudo do visitante, além de finalizar compras, acompanhar pedidos e gerenciar seus dados |
| Administrador | Vê a loja como o cliente, com controles extras de edição, e acessa o painel da loja |

## Funcionalidades planejadas

### Loja

- Catálogo de produtos
- Pesquisa
- Filtros por categoria
- Detalhes dos produtos (modal)
- Carrinho em gaveta lateral
- Produtos em destaque e produtos esgotados
- Compra direto no site
- Opção de finalizar o pedido pelo WhatsApp
- Instagram
- Google Maps
- Layout responsivo

### Compra

- Entrega no endereço (taxa por CEP) ou retirada na loja
- Endereços salvos
- Dados de quem vai receber
- Escolha de data e período de entrega
- Mensagem para o cartão que acompanha as flores
- Pagamento por Pix ou cartão de crédito (em modo de teste)
- Confirmação do pedido

### Login e cadastro

- Entrar
- Criar conta
- Recuperação de senha por e-mail (link com validade de 30 minutos)
- Criação de nova senha
- Mensagens de erro e de link expirado

### Área do cliente

- Meus pedidos, com filtro por status
- Detalhe do pedido, com o andamento da entrega
- Meus dados
- Endereços salvos
- Alteração de senha

### Painel administrativo

- Login administrativo
- Loja em modo administrador (editar, destacar e esconder produtos direto nos cards)
- Cadastro de produtos
- Edição de produtos
- Exclusão de produtos
- Alteração de preços
- Alteração de descrições
- Gerenciamento de categorias
- Controle de disponibilidade (disponível ou esgotado)
- Controle da vitrine (mostrar ou esconder, destacar e reordenar)
- Upload de imagens
- Lista de pedidos com atualização de status
- Resumo do dia (pedidos novos e entregas)

### Status dos pedidos

`NOVO` → `EM_PREPARO` → `SAIU_PARA_ENTREGA` → `ENTREGUE` (ou `CANCELADO`)

## Tecnologias planejadas

### Front-end

- React
- Vite
- TypeScript
- Bootstrap

### Back-end

- Node.js
- Nest.js
- TypeScript
- Autenticação com JWT e controle de acesso por perfil (cliente e administrador)

### Banco de dados

- PostgreSQL

### Pagamentos

- Provedor de pagamento em modo de teste (nenhum valor real é cobrado)

## Status

Em desenvolvimento.

- [x] Protótipo de todas as telas no Figma
- [ ] Back-end (Nest.js)
- [ ] Front-end
- [ ] Integração de pagamento em modo de teste
