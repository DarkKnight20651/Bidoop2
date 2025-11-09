import express from 'express';
import * as openPayments from "@interledger/open-payments";
import path from "path";

// --- Configuración del PAGADOR (El Cliente) ---
// En este flujo, el backend representa al *comprador* (pagador)
// y genera un enlace para que el usuario apruebe el pago.
const PAGADOR_WALLET_ADDRESS = "https://ilp.interledger-test.dev/belenjapon"; // BILLETERA QUE ENVÍA (Pagador)
const PAGADOR_PRIVATE_KEY_PATH = path.resolve("./private.key"); // Clave del Pagador
const PAGADOR_KEY_ID = "42c03867-601d-4d99-887e-2dd1f8448e36"; // KeyId del Pagador

// --- VENDEDOR FIJO ---
const VENDEDOR_WALLET_URL = "https://ilp.interledger-test.dev/yahirartesano";

const router = express.Router();

router.post('/create', async (req, res, next) => {
  // La app solo envía el monto. El pagador (este backend) y el receptor (Vendedor) son fijos.
  const { amount } = req.body;

  if (!amount) {
    const error = new Error("Falta el 'amount'");
    res.status(400); 
    return next(error);
  }

  console.log(`[Pagador] Petición recibida para pagar ${amount} a ${VENDEDOR_WALLET_URL}`);

  try {
    // 1. Autenticar al Pagador
    const client = await openPayments.createAuthenticatedClient({
      walletAddressUrl: PAGADOR_WALLET_ADDRESS,
      privateKey: PAGADOR_PRIVATE_KEY_PATH,
      keyId: PAGADOR_KEY_ID,
    });
    console.log("[Pagador] Paso 1: Cliente (Pagador) autenticado.");

    // 2. Obtener datos de ambas billeteras
    const sendingWalletAddress = await client.walletAddress.get({ url: PAGADOR_WALLET_ADDRESS });
    const receivingWalletAddress = await client.walletAddress.get({ url: VENDEDOR_WALLET_URL });
    console.log("[Pagador] Paso 2: Datos de billeteras obtenidos.");

    // 3. Crear Grant para Factura (en la billetera del Vendedor)
    const incomingPaymentGrant = await client.grant.request(
      { url: receivingWalletAddress.authServer },
      { access_token: { access: [{ type: "incoming-payment", actions: ["create"] }] } }
    );
    console.log("[Pagador] Paso 3: Grant para factura (Vendedor) obtenido.");

    // 4. Crear la Factura (Incoming Payment) en el Vendedor
    const incomingPayment = await client.incomingPayment.create(
      {
        url: receivingWalletAddress.resourceServer,
        accessToken: incomingPaymentGrant.access_token.value,
      },
      {
        walletAddress: receivingWalletAddress.id,
        incomingAmount: {
          value: amount,
          assetCode: receivingWalletAddress.assetCode,
          assetScale: receivingWalletAddress.assetScale,
        },
      }
    );
    console.log("[Pagador] Paso 4: Factura (Incoming Payment) creada en el Vendedor.");

    // 5. Crear Grant para Cotización (en la billetera del Pagador)
    const quoteGrant = await client.grant.request(
      { url: sendingWalletAddress.authServer },
      { access_token: { access: [{ type: "quote", actions: ["create"] }] } }
    );
    console.log("[Pagador] Paso 5: Grant para cotización (Pagador) obtenido.");

    // 6. Crear la Cotización
    const quote = await client.quote.create(
      {
        url: sendingWalletAddress.resourceServer,
        accessToken: quoteGrant.access_token.value,
      },
      {
        walletAddress: sendingWalletAddress.id,
        receiver: incomingPayment.id, // Pagando la factura del Vemailedor
        method: "ilp",
      }
    );
    console.log("[Pagador] Paso 6: Cotización creada.");

    // 7. Crear Grant de Pago Saliente (Interactivo)
    console.log("[Pagador] Paso 7: Creando Grant de Pago Saliente (Interactivo)...");
    const outgoingPaymentGrant = await client.grant.request(
      { url: sendingWalletAddress.authServer }, 
      {
        access_token: {
          access: [
            {
              type: "outgoing-payment",
              actions: ["create"],
              limits: { debitAmount: quote.debitAmount },
              identifier: sendingWalletAddress.id,
            },
          ],
        },
        interact: {
          start: ["redirect"], // Pedimos la URL para la aprobación manual
        }
      }
    );
    console.log("[Pagador] Paso 7: ¡Grant Interactivo Obtenido!");

    // 8. ¡ÉXITO! Enviar la URL de aprobación a la App
    if (outgoingPaymentGrant.interact && outgoingPaymentGrant.interact.redirect) {
      const approvalUrl = outgoingPaymentGrant.interact.redirect;
      console.log(`[Pagador] Paso 8: Enviando URL de aprobación a la app: ${approvalUrl}`);
      
      // Enviamos la URL que SÍ es una página web
      res.json({ 
        success: true, 
        paymentUrl: approvalUrl // Esta es la URL que empieza con "https://wallet..."
      });

    } else {
      throw new Error("El Grant no devolvió una URL de 'interact.redirect'.");
    }

  } catch (error) {
    console.error("Error al procesar el pago interactivo:", error);
    next(error);
  }
});

export default router;