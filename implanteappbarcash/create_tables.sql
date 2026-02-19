-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `tipo` ENUM('admin', 'funcionario') NOT NULL DEFAULT 'funcionario',
    `employeeId` INTEGER NULL,
    `permissoes` JSON NULL,
    `roleId` INTEGER NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `dataInclusao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ultimoLogin` DATETIME(3) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `permissoes` JSON NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `dataInclusao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Role_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `precoCusto` DECIMAL(10, 2) NOT NULL,
    `precoVenda` DECIMAL(10, 2) NOT NULL,
    `categoria` VARCHAR(191) NULL,
    `tipo` VARCHAR(191) NULL,
    `grupo` VARCHAR(191) NULL,
    `unidade` VARCHAR(191) NOT NULL DEFAULT 'un',
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `dadosFiscais` VARCHAR(191) NULL,
    `quantidade` INTEGER NOT NULL DEFAULT 0,
    `imagem` VARCHAR(191) NULL,
    `tempoPreparoMinutos` INTEGER NOT NULL DEFAULT 0,
    `disponivel` BOOLEAN NOT NULL DEFAULT true,
    `dataInclusao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ncm` VARCHAR(191) NULL,
    `cest` VARCHAR(191) NULL,
    `cfop` VARCHAR(191) NULL,
    `csosn` VARCHAR(191) NULL,
    `icmsSituacao` VARCHAR(191) NULL,
    `icmsAliquota` DECIMAL(5, 2) NULL,
    `origem` INTEGER NOT NULL DEFAULT 0,
    `categoriaId` INTEGER NULL,
    `groupId` INTEGER NULL,
    `tipoId` INTEGER NULL,
    `unidadeMedidaId` INTEGER NULL,
    `temVariacao` BOOLEAN NOT NULL DEFAULT false,
    `temTamanhos` BOOLEAN NOT NULL DEFAULT false,

    INDEX `Product_categoriaId_fkey`(`categoriaId`),
    INDEX `Product_groupId_fkey`(`groupId`),
    INDEX `Product_tipoId_fkey`(`tipoId`),
    INDEX `Product_unidadeMedidaId_fkey`(`unidadeMedidaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductSize` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `preco` DECIMAL(10, 2) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    INDEX `ProductSize_productId_fkey`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `icone` VARCHAR(191) NOT NULL DEFAULT '?',
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `dataInclusao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ProductGroup_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Employee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `endereco` VARCHAR(191) NULL,
    `bairro` VARCHAR(191) NULL,
    `telefone` VARCHAR(191) NULL,
    `cargo` VARCHAR(191) NULL,
    `salario` DECIMAL(10, 2) NULL,
    `dataAdmissao` DATETIME(3) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `roleId` INTEGER NULL,
    `dataInclusao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NULL,
    `endereco` TEXT NULL,
    `cidade` VARCHAR(191) NULL,
    `estado` VARCHAR(191) NULL,
    `fone` VARCHAR(191) NULL,
    `cep` VARCHAR(191) NULL,
    `cpf` VARCHAR(191) NULL,
    `rg` VARCHAR(191) NULL,
    `dataNascimento` DATETIME(3) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `dataInclusao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `saldoCashback` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `pontos` INTEGER NOT NULL DEFAULT 0,
    `participaFidelidade` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Customer_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mesa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero` INTEGER NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `capacidade` INTEGER NOT NULL,
    `status` ENUM('livre', 'ocupada', 'reservada', 'manutencao') NOT NULL DEFAULT 'livre',
    `vendaAtualId` INTEGER NULL,
    `funcionarioResponsavelId` INTEGER NULL,
    `nomeResponsavel` VARCHAR(191) NULL,
    `clientesAtuais` INTEGER NOT NULL DEFAULT 0,
    `horaAbertura` DATETIME(3) NULL,
    `observacoes` VARCHAR(191) NULL,
    `tipo` ENUM('interna', 'externa', 'vip', 'reservada', 'balcao') NOT NULL DEFAULT 'interna',
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Mesa_numero_key`(`numero`),
    UNIQUE INDEX `Mesa_vendaAtualId_key`(`vendaAtualId`),
    INDEX `Mesa_funcionarioResponsavelId_fkey`(`funcionarioResponsavelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tipo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `dataInclusao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `descricao` VARCHAR(191) NULL,

    UNIQUE INDEX `Tipo_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UnidadeMedida` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `sigla` VARCHAR(191) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `dataInclusao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `descricao` VARCHAR(191) NULL,

    UNIQUE INDEX `UnidadeMedida_nome_key`(`nome`),
    UNIQUE INDEX `UnidadeMedida_sigla_key`(`sigla`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SetorImpressao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `modoEnvio` ENUM('impressora', 'whatsapp') NOT NULL DEFAULT 'impressora',
    `whatsappDestino` VARCHAR(191) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `dataInclusao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `printerId` INTEGER NULL,

    UNIQUE INDEX `SetorImpressao_nome_key`(`nome`),
    INDEX `SetorImpressao_printerId_fkey`(`printerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Printer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `modelo` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `driver` VARCHAR(191) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `dataInclusao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Printer_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PrintJob` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `saleId` INTEGER NULL,
    `productId` INTEGER NOT NULL,
    `setorId` INTEGER NOT NULL,
    `printerId` INTEGER NULL,
    `content` TEXT NOT NULL,
    `status` ENUM('queued', 'processing', 'done', 'failed') NOT NULL DEFAULT 'queued',
    `error` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `processedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WhatsAppMessageLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `saleId` INTEGER NULL,
    `destino` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `status` ENUM('queued', 'sent', 'failed') NOT NULL DEFAULT 'queued',
    `error` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sentAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductSetorImpressao` (
    `productId` INTEGER NOT NULL,
    `setorId` INTEGER NOT NULL,

    INDEX `ProductSetorImpressao_setorId_fkey`(`setorId`),
    PRIMARY KEY (`productId`, `setorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `dataInclusao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Categoria_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sale` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `funcionarioId` INTEGER NULL,
    `clienteId` INTEGER NULL,
    `mesaId` INTEGER NULL,
    `responsavelNome` VARCHAR(191) NULL,
    `responsavelFuncionarioId` INTEGER NULL,
    `funcionarioNome` VARCHAR(191) NULL,
    `funcionarioAberturaNome` VARCHAR(191) NULL,
    `funcionarioAberturaId` INTEGER NULL,
    `entregadorId` INTEGER NULL,
    `numeroComanda` VARCHAR(191) NULL,
    `nomeComanda` VARCHAR(191) NULL,
    `tipoVenda` ENUM('balcao', 'mesa', 'delivery', 'comanda') NOT NULL DEFAULT 'balcao',
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `desconto` DECIMAL(10, 2) NOT NULL,
    `total` DECIMAL(10, 2) NOT NULL,
    `cashbackGerado` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `cashbackUsado` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `pontosUsados` INTEGER NOT NULL DEFAULT 0,
    `formaPagamento` ENUM('dinheiro', 'cartao', 'pix', 'cashback') NOT NULL DEFAULT 'dinheiro',
    `status` ENUM('aberta', 'finalizada', 'cancelada') NOT NULL DEFAULT 'aberta',
    `dataVenda` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dataFinalizacao` DATETIME(3) NULL,
    `observacoes` VARCHAR(191) NULL,
    `tempoPreparoEstimado` INTEGER NOT NULL DEFAULT 0,
    `impressaoCozinha` BOOLEAN NOT NULL DEFAULT false,
    `impressaoBar` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDelivery` BOOLEAN NOT NULL DEFAULT false,
    `deliveryAddress` TEXT NULL,
    `deliveryDistance` DOUBLE NULL,
    `deliveryFee` DECIMAL(10, 2) NULL,
    `deliveryStatus` ENUM('pending', 'out_for_delivery', 'delivered', 'cancelled') NULL DEFAULT 'pending',

    UNIQUE INDEX `Sale_numeroComanda_key`(`numeroComanda`),
    INDEX `Sale_clienteId_fkey`(`clienteId`),
    INDEX `Sale_funcionarioAberturaId_fkey`(`funcionarioAberturaId`),
    INDEX `Sale_funcionarioId_fkey`(`funcionarioId`),
    INDEX `Sale_mesaId_fkey`(`mesaId`),
    INDEX `Sale_responsavelFuncionarioId_fkey`(`responsavelFuncionarioId`),
    INDEX `Sale_entregadorId_fkey`(`entregadorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Nfce` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `saleId` INTEGER NOT NULL,
    `chave` VARCHAR(191) NOT NULL,
    `numero` INTEGER NOT NULL,
    `serie` INTEGER NOT NULL,
    `status` ENUM('PENDENTE', 'PROCESSANDO', 'AUTORIZADA', 'REJEITADA', 'CANCELADA', 'DENEGADA', 'CONTINGENCIA') NOT NULL DEFAULT 'PENDENTE',
    `ambiente` ENUM('homologacao', 'producao') NOT NULL DEFAULT 'homologacao',
    `xml` LONGTEXT NOT NULL,
    `protocolo` VARCHAR(191) NULL,
    `motivo` VARCHAR(191) NULL,
    `qrCode` TEXT NULL,
    `urlConsulta` TEXT NULL,
    `pdfPath` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Nfce_saleId_key`(`saleId`),
    UNIQUE INDEX `Nfce_chave_key`(`chave`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NfceEvent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nfceId` INTEGER NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `sequencia` INTEGER NOT NULL DEFAULT 1,
    `xmlEnvio` TEXT NULL,
    `xmlRetorno` TEXT NULL,
    `status` VARCHAR(191) NULL,
    `motivo` VARCHAR(191) NULL,
    `protocolo` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SaleItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `saleId` INTEGER NOT NULL,
    `productId` INTEGER NULL,
    `nomeProduto` VARCHAR(191) NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `precoUnitario` DECIMAL(10, 2) NOT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'pendente',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `preparedAt` DATETIME(3) NULL,
    `preparedById` INTEGER NULL,
    `origem` VARCHAR(20) NULL DEFAULT 'default',
    `variacaoOpcoes` JSON NULL,
    `variacaoRegraPreco` ENUM('mais_caro', 'media', 'fixo') NULL,
    `variacaoTipo` VARCHAR(50) NULL,

    INDEX `SaleItem_preparedById_fkey`(`preparedById`),
    INDEX `SaleItem_productId_fkey`(`productId`),
    INDEX `SaleItem_saleId_fkey`(`saleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Caixa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dataAbertura` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dataFechamento` DATETIME(3) NULL,
    `valorAbertura` DECIMAL(10, 2) NOT NULL,
    `valorFechamento` DECIMAL(10, 2) NULL,
    `totalVendas` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `totalDinheiro` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `totalCartao` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `totalPix` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `funcionarioAberturaId` INTEGER NOT NULL,
    `funcionarioFechamentoId` INTEGER NULL,
    `status` ENUM('aberto', 'fechado') NOT NULL DEFAULT 'aberto',
    `observacoes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Caixa_funcionarioAberturaId_fkey`(`funcionarioAberturaId`),
    INDEX `Caixa_funcionarioFechamentoId_fkey`(`funcionarioFechamentoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CaixaVenda` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `caixaId` INTEGER NOT NULL,
    `vendaId` INTEGER NOT NULL,
    `valor` DECIMAL(10, 2) NOT NULL,
    `formaPagamento` ENUM('dinheiro', 'cartao', 'pix', 'cashback') NOT NULL,
    `dataVenda` DATETIME(3) NOT NULL,
    `itensPagos` JSON NULL,
    `observacoes` VARCHAR(191) NULL,

    INDEX `CaixaVenda_caixaId_fkey`(`caixaId`),
    INDEX `CaixaVenda_vendaId_fkey`(`vendaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VariationType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `maxOpcoes` INTEGER NOT NULL DEFAULT 1,
    `categoriasIds` JSON NULL,
    `regraPreco` ENUM('mais_caro', 'media', 'fixo') NOT NULL DEFAULT 'mais_caro',
    `precoFixo` DECIMAL(10, 2) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `dataInclusao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `VariationType_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Company` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `razaoSocial` VARCHAR(191) NOT NULL,
    `nomeFantasia` VARCHAR(191) NOT NULL,
    `cnpj` VARCHAR(191) NOT NULL,
    `inscricaoEstadual` VARCHAR(191) NULL,
    `inscricaoMunicipal` VARCHAR(191) NULL,
    `logradouro` VARCHAR(191) NULL,
    `numero` VARCHAR(191) NULL,
    `complemento` VARCHAR(191) NULL,
    `bairro` VARCHAR(191) NULL,
    `cidade` VARCHAR(191) NULL,
    `uf` VARCHAR(191) NULL,
    `cep` VARCHAR(191) NULL,
    `ibge` VARCHAR(191) NULL,
    `telefone` VARCHAR(191) NULL,
    `telefoneSecundario` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `whatsapp` VARCHAR(191) NULL,
    `regimeTributario` ENUM('simples_nacional', 'lucro_presumido', 'lucro_real') NOT NULL DEFAULT 'simples_nacional',
    `cnae` VARCHAR(191) NULL,
    `contribuinteIcms` BOOLEAN NOT NULL DEFAULT true,
    `ambienteFiscal` ENUM('homologacao', 'producao') NOT NULL DEFAULT 'homologacao',
    `logo` VARCHAR(191) NULL,
    `nomeImpressao` VARCHAR(191) NULL,
    `mensagemRodape` VARCHAR(191) NULL,
    `serieNfce` INTEGER NOT NULL DEFAULT 1,
    `numeroInicialNfce` INTEGER NOT NULL DEFAULT 1,
    `respNome` VARCHAR(191) NULL,
    `respCpf` VARCHAR(191) NULL,
    `respCargo` VARCHAR(191) NULL,
    `respTelefone` VARCHAR(191) NULL,
    `respEmail` VARCHAR(191) NULL,
    `plano` VARCHAR(191) NULL,
    `valorMensalidade` DECIMAL(10, 2) NULL,
    `diaVencimento` INTEGER NULL,
    `dataInicioCobranca` DATETIME(3) NULL,
    `status` ENUM('ativa', 'bloqueada', 'cancelada') NOT NULL DEFAULT 'ativa',
    `formaCobranca` ENUM('pix', 'boleto', 'cartao') NOT NULL DEFAULT 'boleto',
    `emailCobranca` VARCHAR(191) NULL,
    `banco` VARCHAR(191) NULL,
    `agencia` VARCHAR(191) NULL,
    `conta` VARCHAR(191) NULL,
    `tipoConta` VARCHAR(191) NULL,
    `chavePix` VARCHAR(191) NULL,
    `dataCadastro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ultimoPagamento` DATETIME(3) NULL,
    `proximoVencimento` DATETIME(3) NULL,
    `diasAtraso` INTEGER NOT NULL DEFAULT 0,
    `observacoes` TEXT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `deliveryRadius` DOUBLE NULL,
    `cashbackPercent` DECIMAL(5, 2) NOT NULL DEFAULT 5.00,
    `pointsPerCurrency` DECIMAL(5, 2) NOT NULL DEFAULT 1.00,
    `pontosParaResgate` INTEGER NOT NULL DEFAULT 0,
    `valorResgate` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `csc` VARCHAR(191) NULL,
    `cscId` VARCHAR(191) NULL,
    `certificadoNome` VARCHAR(191) NULL,
    `certificadoSenha` VARCHAR(191) NULL,
    `certificadoPath` VARCHAR(191) NULL,
    `xmlFolder` VARCHAR(191) NULL,

    UNIQUE INDEX `Company_cnpj_key`(`cnpj`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeliveryRange` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `minDist` DOUBLE NOT NULL,
    `maxDist` DOUBLE NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `companyId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `idletimeconfig` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ativo` BOOLEAN NOT NULL DEFAULT false,
    `usarHoraInclusao` BOOLEAN NOT NULL DEFAULT true,
    `estagios` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AppSetting` (
    `key` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `Categoria`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `ProductGroup`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_tipoId_fkey` FOREIGN KEY (`tipoId`) REFERENCES `Tipo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_unidadeMedidaId_fkey` FOREIGN KEY (`unidadeMedidaId`) REFERENCES `UnidadeMedida`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductSize` ADD CONSTRAINT `ProductSize_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mesa` ADD CONSTRAINT `Mesa_funcionarioResponsavelId_fkey` FOREIGN KEY (`funcionarioResponsavelId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mesa` ADD CONSTRAINT `Mesa_vendaAtualId_fkey` FOREIGN KEY (`vendaAtualId`) REFERENCES `Sale`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SetorImpressao` ADD CONSTRAINT `SetorImpressao_printerId_fkey` FOREIGN KEY (`printerId`) REFERENCES `Printer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductSetorImpressao` ADD CONSTRAINT `ProductSetorImpressao_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductSetorImpressao` ADD CONSTRAINT `ProductSetorImpressao_setorId_fkey` FOREIGN KEY (`setorId`) REFERENCES `SetorImpressao`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_funcionarioAberturaId_fkey` FOREIGN KEY (`funcionarioAberturaId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_entregadorId_fkey` FOREIGN KEY (`entregadorId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_mesaId_fkey` FOREIGN KEY (`mesaId`) REFERENCES `Mesa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_responsavelFuncionarioId_fkey` FOREIGN KEY (`responsavelFuncionarioId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nfce` ADD CONSTRAINT `Nfce_saleId_fkey` FOREIGN KEY (`saleId`) REFERENCES `Sale`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NfceEvent` ADD CONSTRAINT `NfceEvent_nfceId_fkey` FOREIGN KEY (`nfceId`) REFERENCES `Nfce`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleItem` ADD CONSTRAINT `SaleItem_preparedById_fkey` FOREIGN KEY (`preparedById`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleItem` ADD CONSTRAINT `SaleItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleItem` ADD CONSTRAINT `SaleItem_saleId_fkey` FOREIGN KEY (`saleId`) REFERENCES `Sale`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Caixa` ADD CONSTRAINT `Caixa_funcionarioAberturaId_fkey` FOREIGN KEY (`funcionarioAberturaId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Caixa` ADD CONSTRAINT `Caixa_funcionarioFechamentoId_fkey` FOREIGN KEY (`funcionarioFechamentoId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CaixaVenda` ADD CONSTRAINT `CaixaVenda_caixaId_fkey` FOREIGN KEY (`caixaId`) REFERENCES `Caixa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CaixaVenda` ADD CONSTRAINT `CaixaVenda_vendaId_fkey` FOREIGN KEY (`vendaId`) REFERENCES `Sale`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeliveryRange` ADD CONSTRAINT `DeliveryRange_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

