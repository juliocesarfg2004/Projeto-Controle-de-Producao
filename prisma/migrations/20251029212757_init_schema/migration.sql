-- CreateTable
CREATE TABLE "Usuario" (
    "usuario_id" SERIAL NOT NULL,
    "nome" VARCHAR(200) NOT NULL,
    "login" VARCHAR(50) NOT NULL,
    "senha" VARCHAR(255) NOT NULL,
    "atualizado_em" TIMESTAMP(6),
    "atualizado_por" INTEGER,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "ProdutoTipo" (
    "material_tipo_id" SERIAL NOT NULL,
    "descricao" VARCHAR(200) NOT NULL,

    CONSTRAINT "ProdutoTipo_pkey" PRIMARY KEY ("material_tipo_id")
);

-- CreateTable
CREATE TABLE "Produto" (
    "produto_id" SERIAL NOT NULL,
    "descricao" VARCHAR(200) NOT NULL,
    "produto_tipo_id" INTEGER NOT NULL,
    "atualizado_em" TIMESTAMP(6),
    "atualizado_por" INTEGER,
    "estoque" INTEGER,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("produto_id")
);

-- CreateTable
CREATE TABLE "OrdemProducao" (
    "ordem_producao_id" SERIAL NOT NULL,
    "produto_id" INTEGER NOT NULL,
    "data" DATE NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "atualizado_em" TIMESTAMP(6),
    "atualizado_por" INTEGER,

    CONSTRAINT "OrdemProducao_pkey" PRIMARY KEY ("ordem_producao_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_login_key" ON "Usuario"("login");

-- CreateIndex
CREATE UNIQUE INDEX "ProdutoTipo_descricao_key" ON "ProdutoTipo"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "Produto_descricao_key" ON "Produto"("descricao");

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_produto_tipo_id_fkey" FOREIGN KEY ("produto_tipo_id") REFERENCES "ProdutoTipo"("material_tipo_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "Usuario"("usuario_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemProducao" ADD CONSTRAINT "OrdemProducao_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "Produto"("produto_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemProducao" ADD CONSTRAINT "OrdemProducao_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "Usuario"("usuario_id") ON DELETE SET NULL ON UPDATE CASCADE;
