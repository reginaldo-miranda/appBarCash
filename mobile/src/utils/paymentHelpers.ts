export const calculateRemainingItemsPayload = (sale: any, totalToCover: number) => {
    const itemsPayload = [];
    let remainingToPay = totalToCover;
    
    if (sale && sale.itens) {
       for (const item of sale.itens) {
           if (remainingToPay <= 0.005) break;
           
           const totalItem = Number(item.subtotal);
           const itemId = String(item._id || (item as any).id);
           
           // Calcular pagamentos já feitos para este item
            let paidSoFar = 0;
            if (sale.caixaVendas) {
                 sale.caixaVendas.forEach((cv: any) => {
                     let pagos: any[] = [];
                     try { 
                         if(Array.isArray(cv.itensPagos)) pagos = cv.itensPagos;
                         else pagos = JSON.parse(cv.itensPagos || '[]');
                     } catch{}
                     const p = pagos.find((pp: any) => String(pp.id) === itemId);
                     if(p) paidSoFar += (Number(p.paidAmount)||0);
                 });
            }
            
            const itemRemaining = Math.max(0, totalItem - paidSoFar);
            if (itemRemaining > 0) {
                let toPay = Math.min(remainingToPay, itemRemaining);
                toPay = Number(toPay.toFixed(2));
                
                if (toPay > 0) {
                    itemsPayload.push({
                        id: itemId,
                        paidAmount: toPay,
                        fullyPaid: (itemRemaining - toPay) < 0.05
                    });
                    remainingToPay = Number((remainingToPay - toPay).toFixed(2));
                }
            }
       }
    }
    
    // Tratamento de Taxa de Entrega
    const fee = Number(sale.deliveryFee || 0);
    if (remainingToPay > 0.005 && fee > 0) {
         let feePaid = 0;
         if (sale.caixaVendas) {
             sale.caixaVendas.forEach((cv: any) => {
                let pagos: any[] = [];
                try { if(Array.isArray(cv.itensPagos)) pagos = cv.itensPagos; else pagos = JSON.parse(cv.itensPagos); } catch{}
                const p = pagos.find((pp: any) => pp.id === 'delivery-fee');
                if(p) feePaid += (Number(p.paidAmount)||0);
             });
         }
         const feeRemaining = Math.max(0, fee - feePaid);
         if (feeRemaining > 0) {
             let toPay = Math.min(remainingToPay, feeRemaining);
             toPay = Number(toPay.toFixed(2));
             
             if(toPay > 0) {
                 itemsPayload.push({
                     id: 'delivery-fee',
                     paidAmount: toPay,
                     fullyPaid: (feeRemaining - toPay) < 0.05
                 });
                 remainingToPay = Number((remainingToPay - toPay).toFixed(2));
             }
         }
    }

    return itemsPayload;
};
