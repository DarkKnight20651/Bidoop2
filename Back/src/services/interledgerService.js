// src/services/interledgerService.js
import axios from 'axios';

export const makePayment = async ({ senderWallet, receiverWallet, amount, metadata = {} }) => {
  if (!process.env.OPENPAYMENTS_URL || !process.env.OPENPAYMENTS_TOKEN) {
    throw new Error('Configuración OpenPayments no encontrada en variables de entorno');
  }
  const url = `${process.env.OPENPAYMENTS_URL}/payments`;
  try {
    const r = await axios.post(url, {
      senderWallet,
      receiverWallet,
      amount,
      metadata
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENPAYMENTS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });
    return r.data;
  } catch (err) {
    const message = err.response?.data || err.message;
    throw new Error(`OpenPayments error: ${JSON.stringify(message)}`);
  }
};
