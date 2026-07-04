# Backend - Mini ERP

Esta pasta concentra a camada de API do sistema. A aplicação principal está localizada em back-end/api e foi construída com CodeIgniter 4.

## Tecnologias

- PHP 8.2+
- Composer
- CodeIgniter 4
- PHPUnit

## Execução local

```bash
cd api
composer install
cp env .env
php spark serve --host 0.0.0.0 --port 8080
```

## Estrutura principal

- app/ — controllers, models, configurações e helpers
- public/ — ponto de entrada da aplicação
- tests/ — testes automatizados
- writable/ — arquivos gerados em tempo de execução

## Observações

- Configure o ambiente e as credenciais de banco no arquivo .env.
- Logs, sessões e uploads são armazenados em writable/.
