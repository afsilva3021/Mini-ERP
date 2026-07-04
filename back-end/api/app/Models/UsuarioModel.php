<?php

namespace App\Models;

use CodeIgniter\Model;

class UsuarioModel extends Model
{
    protected $table = 'usuarios';
    protected $primaryKey = 'usuario_id';
    protected $returnType = 'array';
    protected $userTimeStamps = true;
    protected $dataFormat = 'data_inclucao';
    protected $updatedField = 'data_alteracao';


    protected $allowedFields = [
        'nome',
        'sobrenome',
        'email',
        'senha',
        'departamento',
        'cargo',
        'nivel_acesso',
        'ativo',
        'data_inclusao',
        'data_alteracao'
    ];

    protected $validationRules = [
        'nome' => 'required|min_length[3]',
        'sobrenome' => 'permit_empty|min_length[3]',
        'email' => 'required|valid_email|is_unique[usuarios.email]',
        'senha' => 'required|min_length[2]',
        'departamento' => 'required|min_length[2]',
        'cargo' => 'permit_empty|min_length[2]',
        'nivel_acesso' => 'required|integer',
        'ativo' => 'required|in_list[0,1]',
    ];
}