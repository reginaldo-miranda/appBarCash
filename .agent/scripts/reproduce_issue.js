
const API_URL = 'http://localhost:4002/api'; // Trying port 4002
let token = '';

async function request(url, method = 'GET', body = null, headers = {}) {
    const opts = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    };
    if (body) opts.body = JSON.stringify(body);
    
    // console.log(`Request: ${method} ${url}`);
    const res = await fetch(url, opts);
    let data;
    const text = await res.text();
    try {
        data = JSON.parse(text);
    } catch {
        data = text;
    }
    
    if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${JSON.stringify(data)}`);
    }
    return { data, status: res.status };
}

async function run() {
  try {
    console.log('1. Logging in...');
    // Initial attempt with default creds
    let authHeader = {};
    try {
        const loginRes = await request(`${API_URL}/auth/login`, 'POST', {
            email: 'admin@admin.com',
            senha: '123456'
        });
        token = loginRes.data.token;
    } catch (e) {
        console.log('Login failed (' + e.message + '), trying alternative...');
        try {
            const loginRes = await request(`${API_URL}/auth/login`, 'POST', {
                email: 'admin@barapp.com',
                senha: '123456'
            });
            token = loginRes.data.token;
        } catch (e2) {
             console.error('Fatal Login Error:', e2.message);
             return;
        }
    }
    
    console.log('Logged in.');
    authHeader = { Authorization: `Bearer ${token}` };

    // 2. Create Sale
    console.log('2. Creating Sale...');
    const prodsRes = await request(`${API_URL}/product`, 'GET', null, authHeader);
    const product = prodsRes.data[0];
    if (!product) throw new Error('No products found');
    console.log('Using product:', product.nome, product.id);

    const createRes = await request(`${API_URL}/sale/create`, 'POST', {
        funcionario: 'admin-fixo',
        tipoVenda: 'balcao'
    }, authHeader);
    const saleId = createRes.data.id || createRes.data._id;
    console.log('Sale Created:', saleId);

    // 3. Add Item
    console.log('3. Adding Item...');
    await request(`${API_URL}/sale/${saleId}/item`, 'POST', {
        produtoId: product.id,
        quantidade: 1
    }, authHeader);
    console.log('Item Added.');
    
    // 3b. Verify Sale Total (Optional, good to check)
    const saleCheck = await request(`${API_URL}/sale/${saleId}`, 'GET', null, authHeader);
    console.log('Sale Total before finalize:', saleCheck.data.total); // Might be 0 if only calculated on finalize?

    // 4. Finalize
    console.log('4. Finalizing...');
    await request(`${API_URL}/sale/${saleId}/finalize`, 'PUT', {
        formaPagamento: 'dinheiro',
        total: 10 // Mock total just in case frontend sends it (sale.tsx sends remaining)
    }, authHeader);
    console.log('Sale Finalized.');

    // 5. Check Caixa
    console.log('5. Checking Caixa (Open Status)...');
    try {
        const caixaRes = await request(`${API_URL}/caixa/status/aberto`, 'GET', null, authHeader);
        const caixa = caixaRes.data;
        
        console.log('Caixa ID:', caixa.id);
        
        // Check caixa vendas
        const found = caixa.vendas.find(v => String(v.vendaId || v.venda?.id) === String(saleId));
        
        if (found) {
            console.log('SUCCESS: Sale found in Caixa!');
            console.log('CaixaVenda:', JSON.stringify(found, null, 2));
        } else {
            console.error('FAILURE: Sale NOT found in Caixa.');
            console.log('Caixa Vendas Count:', caixa.vendas.length);
            console.log('Last 3 Vendas:', JSON.stringify(caixa.vendas.slice(-3), null, 2));
        }
    } catch(e) {
        if(e.message.includes('404')) {
            console.log('No Open Caixa found. Finalization should have opened one?');
            // Check list of caixas
            const listRes = await request(`${API_URL}/caixa`, 'GET', null, authHeader);
            console.log('Caixas list:', listRes.data.length);
        } else {
            throw e;
        }
    }

  } catch (e) {
      console.error('Error:', e.message);
  }
}

run();
