export interface ManualTopic {
  id: string;
  title: string;
  content: string;
}

export interface ManualCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  topics: ManualTopic[];
}

export const MANUAL_DATA: ManualCategory[] = [
  {
    id: 'fidelidade',
    title: 'Fidelidade e Pontos 🎁',
    icon: 'gift',
    description: 'Aprenda a configurar e usar o sistema de Cashback e Pontos.',
    topics: [
      {
        id: 'fid-config',
        title: 'Como configurar as Regras?',
        content: `Para ativar o sistema de fidelidade:
1. Acesse o menu **Admin Configurações** (engrenagem).
2. Vá até a seção **6. Configuração Fidelidade**.
3. Defina a porcentagem de **Cashback** (ex: 5.00%).
4. Defina quantos **Pontos** o cliente ganha a cada R$ 1,00 (ex: 1.00).
5. Defina a regra de troca: **Pontos Para Resgate** (ex: 100) e **Valor Resgate** (ex: R$ 5,00).
6. Salve as configurações.`
      },
      {
        id: 'fid-resgate',
        title: 'Como resgatar Pontos?',
        content: `Quando um cliente com pontos suficientes for fazer uma compra:
1. Na tela de pagamento, o sistema mostrará um quadro **"Resgate de Pontos"**.
2. Use os botões **(+)** e **(-)** para definir quantos pontos o cliente quer usar.
3. O valor correspondente será descontado do total da venda.
4. Finalize o pagamento normalmente pelo restante (se houver).`
      },
      {
        id: 'fid-cliente',
        title: 'Ativar/Desativar por Cliente',
        content: `Você pode escolher quais clientes participam:
1. Vá em **Adm Clientes**.
2. Ao cadastrar ou editar um cliente, marque ou desmarque a opção **"Participa Fidelidade"**.
3. Clientes desmarcados não ganham pontos nem cashback, mesmo que a empresa tenha ativado o sistema.`
      }
    ]
  },
  {
    id: 'vendas',
    title: 'Vendas e Caixa 💲',
    icon: 'cart',
    description: 'Processos de venda, abertura de caixa e delivery.',
    topics: [
      {
        id: 'venda-criar',
        title: 'Como fazer uma Venda?',
        content: `1. Na tela inicial, clique em **Nova Venda**.
2. Adicione produtos clicando neles ou usando a busca.
3. Para finalizar, clique no botão verde **Finalizar Venda** ou **Pagar & Finalizar**.
4. Escolha a forma de pagamento e confirme.`
      },
      {
        id: 'venda-delivery',
        title: 'Lançar Delivery',
        content: `1. Na tela de venda, clique no botão laranja (caminhão/moto) no canto esquerdo.
2. Selecione ou cadastre o endereço do cliente.
3. O sistema calculará a taxa de entrega (se configurada).
4. Avance para confirmar os dados e finalize como "Pendente" ou "Pago".`
      },
      {
        id: 'venda-caixa',
        title: 'Abertura e Fechamento',
        content: `Para operar, o caixa deve estar aberto:
1. Vá no menu **Caixa**.
2. Se estiver fechado, clique em **Abrir Caixa** e informe o fundo de troco.
3. Ao final do dia, clique em **Fechar Caixa** para conferir os totais.`
      }
    ]
  },
  {
    id: 'config',
    title: 'Configurações Gerais ⚙️',
    icon: 'settings',
    description: 'Ajustes da empresa, impressora e NFC-e.',
    topics: [
      {
        id: 'cfg-nfce',
        title: 'Configurar NFC-e',
        content: `Para emitir notas fiscais:
1. Em **Configurações**, preencha o **CSC** e **ID do CSC** (fornecidos pelo contador).
2. Carregue o certificado digital (arquivo .pfx) na pasta correta do servidor (configure via suporte técnico se necessário).
3. Selecione o ambiente: **Homologação** (Testes) ou **Produção** (Valendo).`
      },
      {
        id: 'cfg-impressao',
        title: 'Personalizar Impressão',
        content: `Você pode alterar o nome que sai no cupom:
1. Em **Configurações > Emissão e Impressão**.
2. Altere o "Nome Fantasia na Impressão".
3. Altere a "Mensagem de Rodapé" (ex: "Obrigado pela preferência!").`
      },
      {
        id: 'cfg-perfis',
        title: 'Perfis de Acesso (Cargos)',
        content: `Gerencie o que cada funcionário pode fazer:
1. Vá em **Configurações > Configurações Gerais**.
2. Clique em **Perfis de Acesso (Cargos)**.
3. Crie cargos como "Gerente" ou "Vendedor" e marque as permissões desejadas.
4. Para vincular: Vá em **Gerenciamento de Usuários** (na tela de Configurações), edite um funcionário e selecione o **Perfil** criado. O sistema aplicará as regras automaticamente.`
      }
    ]
  },
  {
    id: 'cadastros',
    title: 'Cadastros 📝',
    icon: 'list',
    description: 'Gestão de produtos, clientes e funcionários.',
    topics: [
      {
        id: 'cad-prod',
        title: 'Cadastrar Produtos',
        content: `1. Vá em **Adm Produtos**.
2. Clique em **Novo Produto (+)**.
3. Preencha Nome, Preço e Categoria.
4. Se usar código de barras, use o leitor ou digite no campo EAN/Código.
5. Salve.`
      },
      {
        id: 'cad-cli',
        title: 'Cadastrar Clientes',
        content: `1. Vá em **Adm Clientes**.
2. Clique em **Novo Cliente**.
3. Preencha os dados (CPF é importante para NFC-e e Histórico).
4. O campo CEP busca o endereço automaticamente se houver internet.`
      }
    ]
  }
];
