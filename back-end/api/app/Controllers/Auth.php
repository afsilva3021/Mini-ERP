<?php

namespace App\Controllers;

use App\Models\UsuarioModel;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class Auth extends ResourceController
{
    private UsuarioModel $usuarioModel;

    public function __construct()
    {
        $this->usuarioModel = new UsuarioModel();
    }

    public function login(): ResponseInterface
    {
        $dados = $this->request->getJSON(true);

        if (empty($dados['email']) || empty($dados['senha'])) {
            return $this->respond([
                'status' => false,
                'message' => 'Email e senha são obrigatorios.'
            ], 400);
        }

        $usuario = $this->usuarioModel
            ->where('email', $dados['email'])
            ->first();

        if (!$usuario) {
            return $this->respond([
                'status' => false,
                'message' =>'Email ou senha inválidos. '
            ], 401);
        }

        if ((int) $usuario['ativo'] !== 1) {
            return $this->respond([
                'status' => false,
                'message' => 'Usuário bloqueado'
            ], 403);
        }

        return $this->respond([
            'status' => true,
            'message' => 'Login realizaao com sucesso. ',
            'usuario' => [
                'id' => $usuario['id'],
                'nome' => $usuario['nome'],
                'sobrenome' => $usuario['sobrenome'],
                'email' => $usuario['email'],
                'departamento' => $usuario['departamento'],
                'cargo' => $usuario['cargo'],
                'nivel_acesso' => $usuario['nivel_acesso']
            ]
        ]);
    }
}
