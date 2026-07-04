<?php

namespace App\Controllers;

use App\Models\ProdutoModel;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class Produtos extends ResourceController
{
    private ProdutoModel $produtoModel;

    public function __construct()
    {
        $this->produtoModel = new ProdutoModel();
    }
    // Lista produtos do banco de dados
    public function lista(): ResponseInterface
    {

        $dados = $this->produtoModel
            ->where('D_E_L_E_T_', '')
            ->findAll();

        return $this->respond([
            'status' => true,
            'data' => $dados
        ]);
    }

    // Adicionar produtos no banco de dados
    public function inserir(): ResponseInterface
    {
        $dados = $this->request->getJSON(true);

        if (!$this->produtoModel->insert($dados)) {
            return $this->respond([
                'status' => false,
                'errors' => $this->produtoModel->errors()
            ], 400);
        }

        return  $this->respondCreated([
            'status' => true,
            'message' => 'Produto cadastrado com sucesso. '
        ]);
    }

    public function atualizar(int $id): ResponseInterface
    {
        $produto = $this->produtoModel->find($id);

        if (!$produto) {
            return $this->respond([
                'status' => false,
                'message' => 'Produto não encontrado.'
            ], 404);
        }

        $dados = $this->request->getJSON(true);

        if (empty($dados)) {
            return $this->respond([
                'status' => false,
                'message' => 'Nenhum dado foi enviado. '
            ], 400);
        }

        $this->produtoModel->setValidationRules(
            $this->produtoModel->regrasUpdate($id)
        );

        if (!$this->produtoModel->update($id, $dados)) {
            return $this->respond([
                'status' => false,
                'errors' => $this->produtoModel->errors()
            ], 400);
        }

        return $this->respond([
            'status' => true,
            'message' => 'Produto atualizado com sucesso'
        ]);
    }

    public function destroy(int $id): ResponseInterface
    {
        $produto = $this->produtoModel->find($id);

        if (!$produto) {
            return $this->respond([
                'status' => false,
                'message' => 'Produto não encontrado.'
            ], 404);
        }

        if ($produto['D_E_L_E_T_'] === '*') {
            return $this->respond([
                'status' => false,
                'message' => 'Produto já está deletado.'
            ], 400);
        }

        $dados = [
            'D_E_L_E_T_' => '*',
            'data_alteracao' => date('Y-m-d H:i:s')
        ];

        if (!$this->produtoModel->update($id, $dados)) {
            return $this->respond([
                'status' => false,
                'errors' => $this->produtoModel->errors()
            ], 400);
        }

        return $this->respond([
            'status' => true,
            'message' => 'Produto deletado logicamente com sucesso.'
        ]);
    }
}
