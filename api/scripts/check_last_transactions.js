
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  try {
    console.log('--- Checking Recent Transactions ---');
    
    // 1. Find Customer 'reginado' (based on screenshot)
    const customers = await prisma.customer.findMany({
        where: { nome: { contains: 'reginado' } }
    });

    if (customers.length === 0) {
        console.log('Customer not found');
        return;
    }

    const customer = customers[0];
    console.log(`Customer: ${customer.nome} (ID: ${customer.id})`);
    console.log(`Current Balance: ${customer.saldoCashback}`);
    console.log(`Points: ${customer.pontos}`);

    // 2. Get Last 5 Sales
    const sales = await prisma.sale.findMany({
        where: { clienteId: customer.id },
        orderBy: { id: 'desc' },
        take: 5,
        include: {
            caixaVendas: true
        }
    });

    console.log('\n--- Last 5 Sales ---');
    for (const sale of sales) {
        console.log(`\n=== SALE ID: ${sale.id} ===`);
        console.log(`Total: ${sale.total}`);
        console.log(`Status: ${sale.status}`);
        console.log(`Date: ${sale.createdAt}`);
        console.log(`Cashback Generated (Ganho): ${sale.cashbackGerado}`);
        console.log(`Cashback Used (Campo na Venda): ${sale.cashbackUsado}`);
        
        console.log('   Payments (CaixaVenda):');
        if (sale.caixaVendas.length === 0) {
            console.log('      (No payments recorded)');
        }
        for (const cv of sale.caixaVendas) {
            console.log(`      - ID: ${cv.id} | Valor: ${cv.valor} | Forma: ${cv.formaPagamento} | Data: ${cv.dataCriacao}`);
        }
        console.log('============================');
    }

  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

run();
