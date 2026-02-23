---
description: checar dados fiscais do produto
---

Preciso implementar uma nova validação no sistema no momento de finalizar uma venda fiscal.

Objetivo

Antes de emitir o cupom fiscal, o sistema deve verificar se todos os produtos da venda possuem os seguintes dados fiscais preenchidos:

NCM

CFOP

CSOSN

Regra de Negócio

Ao clicar em Finalizar Venda Fiscal, o sistema deve validar todos os itens da venda.

Caso algum produto esteja com NCM, CFOP ou CSOSN vazio ou inválido, não deve permitir a finalização da venda.

Nesse caso, deve abrir uma modal automática exibindo:

Lista dos produtos com dados fiscais faltando

Campos editáveis para preencher NCM, CFOP e CSOSN

Comportamento Esperado

O usuário preenche os dados faltantes diretamente na modal.

Ao confirmar:

Os dados devem ser salvos corretamente no cadastro do produto.

O sistema deve refazer a validação.

Se todos os produtos estiverem válidos, o sistema deve:

Emitir o cupom fiscal

Finalizar a venda normalmente

Problema Atual

Já existe uma tentativa de validação no sistema, porém:

A implementação está mal estruturada.

Mesmo após preencher os dados fiscais, o sistema continua apresentando erro na emissão do cupom.

A validação não impede corretamente a finalização antes da emissão.

Resultado Esperado

Bloqueio total da emissão do cupom enquanto houver inconsistência fiscal.

Correção definitiva da lógica de validação.

Emissão do cupom funcionando normalmente após preenchimento correto dos dados.