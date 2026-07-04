<?php

namespace App\Models;

use CodeIgniter\Model;

class ProdutoModel extends Model
{

    protected $table = 'produto';
    protected $primaryKey = 'produto_id';
    protected $returnType = 'array';

    protected $useTimestamps = true;
    protected $dateFormat = 'datetime';

    protected $createdField = 'data_inclusao';
    protected $updatedField = 'data_alteracao';
    

    protected $allowedFields = [
        'nome',
        'codigo_sku',
        'codigo_barras',
        'estoque_atual',
        'fornecedor',
        'marca',
        'modelo',
        'numero_serie',
        'estoque_minumo',
        'ativo',
        'preco_custo',
        'preco_venda',
        'data_inclusao',
        'data_alteracao',
        'D_E_L_E_T_'
    ];


    protected $validationRules = [
        'nome'           => 'required|min_length[3]|is_unique[produto.nome, produto_id]',
        'codigo_sku'     => 'required|min_length[3]',
        'codigo_barras'  => 'required|min_length[3]|is_unique[produto.codigo_barras, produto_id]',
        'estoque_atual'  => 'required|integer|greater_than_equal_to[0]',
        'fornecedor'     => 'required|min_length[3]',
        'marca'          => 'required|min_length[1]',
        'modelo'         => 'permit_empty|min_length[3]',
        'numero_serie'   => 'permit_empty|min_length[3]',
        'estoque_minumo' => 'permit_empty|integer|greater_than_equal_to[0]',
        'ativo'          => 'required|in_list[0,1]',
        'preco_custo'    => 'required|decimal',
        'preco_venda'    => 'required|decimal',
    ];


    public function regrasUpdate(int $id): array
    {
        return [
             'nome'           => 'required|min_length[3]|is_unique[produto.nome,produto_id,' . $id . ']',
            'codigo_sku'     => 'required|min_length[3]',
            'codigo_barras'  => 'required|min_length[3]|is_unique[produto.codigo_barras,produto_id,' . $id . ']',
            'estoque_atual'  => 'required|integer|greater_than_equal_to[0]',
            'fornecedor'     => 'required|min_length[3]',
            'marca'          => 'required|min_length[1]',
            'modelo'         => 'permit_empty|min_length[3]',
            'numero_serie'   => 'permit_empty|min_length[3]',
            'estoque_minumo' => 'permit_empty|integer|greater_than_equal_to[0]',
            'ativo'          => 'required|in_list[0,1]',
            'preco_custo'    => 'required|decimal',
            'preco_venda'    => 'required|decimal',
        ];
    }
}
