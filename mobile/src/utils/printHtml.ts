import { Platform, Alert } from 'react-native';

/**
 * Utilitário para imprimir conteúdo HTML.
 * No Web: Abre uma nova janela e chama window.print().
 * No Mobile: Exibe um alerta (pode ser expandido para usar expo-print).
 * @param html String contendo o HTML a ser impresso.
 */
export const printHtmlContent = (html: string) => {
    if (Platform.OS === 'web') {
        // Open a visible new window for the user to see/print/save as PDF
        const win = window.open('', '_blank', 'width=800,height=600');
        if (win) {
            win.document.write(html);
            win.document.close();
            // Wait for content to load, then print
            setTimeout(() => {
                win.focus();
                win.print();
            }, 500);
        } else {
             window.alert('Por favor, permita pop-ups para visualizar o comprovante.');
        }
    } else {
        // Para mobile nativo, ideal usar expo-print
        // import * as Print from 'expo-print';
        // Print.printAsync({ html });
        console.log('Impressão nativa pendente de implementação. HTML:', html.substring(0, 50) + '...');
        Alert.alert('Impressão', 'Conteúdo enviado para impressão.');
    }
};
