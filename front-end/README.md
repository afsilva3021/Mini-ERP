# Mini ERP - front-end

Front-end estatico integrado a API CodeIgniter existente em `../back-end/api`.

## Configuracao para duas maquinas na mesma rede

1. Na maquina da API, descubra o IPv4 com `ipconfig` (exemplo: `192.168.0.20`).
2. Inicie o CodeIgniter aceitando conexoes da rede:
   `php spark serve --host 0.0.0.0 --port 8080`
3. Libere a porta 8080 no firewall dessa maquina.
4. Em `sources/js/config.js`, defina:
   `API_BASE_URL: "http://192.168.0.20:8080"`
5. Sirva este diretorio por HTTP na outra maquina (nao abra os HTML com `file://`).
   Por exemplo: `php -S 0.0.0.0:5500`
6. Acesse `http://IP_DA_MAQUINA_DO_FRONT:5500`.

Para um teste rapido, a URL da API tambem pode ser informada uma vez pela URL:
`http://IP_DO_FRONT:5500/?api=http://192.168.0.20:8080`
O navegador guarda esse endereco no armazenamento local.

## CORS no back-end

No CodeIgniter, configure `app/Config/Cors.php` com a origem exata do front:

```php
'allowedOrigins' => ['http://192.168.0.30:5500'],
'allowedHeaders' => ['Content-Type', 'Authorization'],
'allowedMethods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
```

E ative o filtro CORS em `app/Config/Filters.php`, dentro de `$globals['before']`:

```php
'cors',
```

O endpoint de produtos exige o `API_TOKEN` atual do back-end. Para testes, ele pode
ser colocado em `sources/js/config.js`. Isso expoe o token a qualquer usuario do
navegador; em producao, substitua o token fixo por autenticacao individual emitida
no login (sessao ou JWT).

## API atualmente disponivel

- `POST /login`
- `POST /usuarios`
- `GET /produtos`
- `POST /produto`
- `PUT /produto/{id}`
- `DELETE /produto/{id}`

Ainda nao existem rotas de vendas e clientes no back-end. As telas correspondentes
permanecem visuais ate esses endpoints serem implementados.
