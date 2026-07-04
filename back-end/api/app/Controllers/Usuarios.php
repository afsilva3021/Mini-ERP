<?php

namespace App\Controllers;

use App\Models\UsuarioModel;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class Usuarios extends ResourceController
{
    private UsuarioModel $usuarioModel;

    public function __construct()
    {
        $this->usuarioModel = new UsuarioModel();
    }


    public function cadastrar(): ResponseInterface 
    {
        $dados = $this->request->getJSON(true);

        if (empty($dados)) {
            return $this->respond([
                'status' => false,
                'message' => 'Nenhum dado foi enviado. '
            ], 400);
        }

        if (empty($dados['nome']) || empty($dados['email']) || empty($dados['senha'])){
            return $this->respond([
                'status' => false,
                'message' => 'Nome, email e senha são obrigatorios'
            ], 400);
        }

        $dados['senha'] = password_hash($dados['senha'], PASSWORD_DEFAULT);
        $dados['ativo'] = $dados['ativo'] ?? 1;
        $dados['nivel_acesso'] = $dados['nivel_acesso'] ?? 1;

        if (!$this->usuarioModel->insert($dados)) {
            return $this->respond([
                'status' => false,
                'message' => $this->usuarioModel->errors()
            ], 400);
        }

        return $this->respondCreated([
            'status' => true,
            'message' => 'Usuário cadastrado com sucesso'
        ]);
    }
}