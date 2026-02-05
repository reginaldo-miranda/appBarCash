---
description: usar o cashback para parte de pagto
---

.

📌 Regra de uso de Cashback no Sistema

O sistema possui funcionalidade de cashback e é necessário ajustar o cálculo e a forma de pagamento conforme as regras abaixo:

1️⃣ Cenário de exemplo

Valor total da venda: R$ 100,00

Saldo disponível de cashback do cliente: R$ 10,00

Valor de cashback que o cliente deseja utilizar: R$ 5,00

2️⃣ Regras de negócio

O sistema deve permitir que o usuário informe manualmente o valor de cashback a ser utilizado na venda.

O valor informado:

Não pode ser maior que o saldo de cashback do cliente.

Não pode ser maior que o valor total da venda.

O valor utilizado de cashback deve ser descontado do total da venda.

3️⃣ Cálculo da venda

Valor total da venda: R$ 100,00

Cashback utilizado: R$ 5,00

Valor restante a pagar: R$ 95,00

4️⃣ Forma de pagamento

O sistema deve permitir pagamento misto, onde:

Parte do valor é paga com cashback

O valor restante pode ser pago com:

Dinheiro

PIX

Cartão (crédito ou débito)

Exemplo de pagamento no caixa:

Cashback: R$ 5,00

Dinheiro (ou outra forma): R$ 95,00

5️⃣ Registro no caixa / financeiro

O fechamento da venda deve registrar separadamente:

Valor pago com cashback

Valor pago por cada forma de pagamento (dinheiro, PIX, cartão, etc.)

Exemplo de registro:

Cashback: R$ 5,00

Dinheiro: R$ 95,00

6️⃣ Atualização do saldo de cashback

Após a finalização da venda:

O sistema deve debitar do saldo do cliente o valor de cashback utilizado.

O saldo restante do cashback deve ser atualizado corretamente.

Utilizar o que ja esta desenvolvido no sistema e acertar o que esta sendo pedido.

Essa implemtacao deve ser aplicada em todas as tela de fechamento de venda dos sitema.

Nao alterar as funcionalidades existentes que estão funcioando corretamente, fazer somente o que esta sendo pedido. Responda sempre em portugues
