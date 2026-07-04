<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class TokenApiFilter implements FilterInterface
{
   
    public function before(RequestInterface $request, $arguments = null)
    {
        $autorizacao = $request->getHeaderLine('Authorization');

        if(!$autorizacao) {
            return service('response')
                ->setStatusCode(401)
                ->setJSON([
                    'status' => false,
                    'message' => 'Token não informado. '
                ]);
        }

        if(!str_starts_with($autorizacao, 'Bearer ')) {
            return service('response')
                ->setStatusCode(401)
                ->setJSON([
                    'status' => false,
                    'message' => 'Formato do token inválido.'                    
                ]);
        }

        $tokenRecebido = trim(str_replace('Bearer ', '', $autorizacao));

        $tokenSistema = env('API_TOKEN');

        if (empty($tokenSistema)) {
            return service('response')
                ->setStatusCode(500)
                ->setJSON([
                    'status' => false,
                    'message' => 'Token da API não configurado no servidor. '
                ]);
        }

        if (!hash_equals($tokenSistema, $tokenRecebido)) {
            return service('response')
                ->setStatusCode(403)
                ->setJSON([
                    'status' => false,
                    'message' => 'Token inválido.'
                 ]);
        }
    }

    
    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        //
    }
}
