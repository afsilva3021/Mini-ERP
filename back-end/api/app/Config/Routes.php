<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
// Rest APi para Produtos

// Rota para usuarios
$routes->post('/usuarios', 'Usuarios::cadastrar');
$routes->post('/login', 'Auth::login');




// Rota para produtos
$routes->get('/produtos', 'Produtos::lista', ['filter' => 'tokenApi']);
$routes->post('/produto', 'Produtos::inserir', ['filter' => 'tokenApi']);
$routes->put('/produto/(:num)', 'Produtos::atualizar/$1', ['filter' => 'tokenApi']);
$routes->delete('/produto/(:num)', 'Produtos::destroy/$1', ['filter' => 'tokenApi']);