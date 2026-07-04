# Mini ERP

Este repositório reúne o projeto Mini ERP, composto por uma API em PHP com CodeIgniter 4 e uma interface web estática em HTML, CSS e JavaScript.

## Estrutura do projeto

- back-end/ — aplicação e API do sistema
- back-end/api/ — projeto principal em CodeIgniter 4
- front-end/ — páginas, estilos e scripts do painel web

## Requisitos

- PHP 8.2 ou superior
- Composer
- Servidor web local ou PHP built-in server para testes

## Como iniciar

### Backend

```bash
cd back-end/api
composer install
cp env .env
php spark serve --host 0.0.0.0 --port 8080
```

### Frontend

```bash
cd front-end
php -S 0.0.0.0:5500
```

Acesse o frontend em http://localhost:5500 e ajuste a URL da API no arquivo de configuração do frontend conforme necessário.

## Observações

- O frontend depende da URL da API definida em front-end/sources/js/config.js.
- Para desenvolvimento local, pode ser necessário ajustar regras de CORS no backend.
