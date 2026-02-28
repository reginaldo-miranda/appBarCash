import api from '../api';

export const configService = {
    getSmtpConfig: async () => {
        return api.get('/config/smtp');
    },

    saveSmtpConfig: async (configData: any) => {
        return api.post('/config/smtp', configData);
    },

    testSmtpConnection: async (configData: any) => {
        return api.post('/config/smtp/test', configData);
    }
};
