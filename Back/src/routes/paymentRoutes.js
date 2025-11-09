import express from 'express';
// Usamos 'import * as openPayments' para evitar conflictos con 'isFinalizedGrant'
import * as openPayments from "@interledger/open-payments";
import path from "path";

// --- Configuración de Pagos ---
const WALLET_ADDRESS = "https://ilp.interledger-test.dev/belenjapon"; // BILLETERA QUE ENVÍA (servidor)
const PRIVATE_KEY_PATH = path.resolve("./private.key"); 
const KEY_ID = "0e508c01-1184-47dc-af5b-a0c00a789afd"; // KeyId de la billetera QUE ENVÍA

const router = express.Router();

// --- FUNCIÓN DE ESPERA (HELPER) ---
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

router.post('/create', async (req, res, next) => {
  const { receiverWalletUrl, amount } = req.body;

  if (!receiverWalletUrl || !amount) {
    const error = new Error("Faltan receiverWalletUrl o amount");
    res.status(400); 
    return next(error);
  }

  console.log(`Petición de pago recibida: Enviar ${amount} a ${receiverWalletUrl}`);

  try {
    const client = await openPayments.createAuthenticatedClient({
      walletAddressUrl: WALLET_ADDRESS,
      privateKey: PRIVATE_KEY_PATH,
      keyId: KEY_ID,
    });

    console.log("Paso 2: Obteniendo datos de billeteras...");
    const sendingWalletAddress = await client.walletAddress.get({ url: WALLET_ADDRESS });
    const receivingWalletAddress = await client.walletAddress.get({ url: receiverWalletUrl });
    console.log("Paso 2: ¡Éxito!");

    console.log("Paso 3: Creando Grant de Incoming Payment...");
    const incomingPaymentGrant = await client.grant.request(
      { url: receivingWalletAddress.authServer },
      { access_token: { access: [{ type: "incoming-payment", actions: ["create"] }] } }
    );
    console.log("Paso 3: ¡Éxito!");

    console.log("Paso 4: Creando Incoming Payment...");
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
    console.log("Paso 4: ¡Éxito!");

    console.log("Paso 5: Creando Grant de Cotización...");
    const quoteGrant = await client.grant.request(
      { url: sendingWalletAddress.authServer },
      { access_token: { access: [{ type: "quote", actions: ["create"] }] } }
    );
    console.log("Paso 5: ¡Éxito!");

    console.log("Paso 6: Creando Cotización...");
    const quote = await client.quote.create(
      {
        url: sendingWalletAddress.resourceServer,
        accessToken: quoteGrant.access_token.value,
      },
      {
        walletAddress: sendingWalletAddress.id,
        receiver: incomingPayment.id,
        method: "ilp",
      }
    );
    console.log("Paso 6: ¡Éxito!");

    console.log("Paso 7: Creando Grant de Outgoing Payment (Interactivo)...");
    let outgoingPaymentGrant = await client.grant.request(
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
          start: ["redirect"],
        }
      }
    );
    console.log("Paso 7: ¡Éxito!");

    // --- INICIO DEL NUEVO FLUJO (PASO 8: POLLING) ---
    
    // 1. Mostramos la URL de aprobación en la terminal
    if (outgoingPaymentGrant.interact && outgoingPaymentGrant.interact.redirect) {
      console.log("\n--- APROBACIÓN MANUAL REQUERIDA ---");
      console.log("Abre esta URL en tu navegador:");
      console.log(outgoingPaymentGrant.interact.redirect);
      console.log("----------------------------------\n");
      console.log("... Postman está esperando a que apruebes el pago ...\n");
    } else {
      throw new Error("El Grant no devolvió una URL de 'interact.redirect'.");
    }

    // 2. Iniciamos el bucle de "polling"
    // (Llamamos a 'continue' hasta que el grant esté finalizado)
    let finalizedOutgoingPaymentGrant = outgoingPaymentGrant;

    while (!openPayments.isFinalizedGrant(finalizedOutgoingPaymentGrant)) {
      if (finalizedOutgoingPaymentGrant.continue?.wait) {
        const waitTime = finalizedOutgoingPaymentGrant.continue.wait;
        console.log(`... Esperando ${waitTime} seg. (Aprobación pendiente)`);
        await wait(waitTime * 1000);
      }

      console.log(`... Verificando aprobación en: ${finalizedOutgoingPaymentGrant.continue.uri}`);
      finalizedOutgoingPaymentGrant = await client.grant.continue({
        url: finalizedOutgoingPaymentGrant.continue.uri,
        accessToken: finalizedOutgoingPaymentGrant.continue.access_token.value,
      });
    }

    console.log("Paso 8: ¡Grant Aprobado y Finalizado!");

    // 9. Crear el Outgoing Payment (¡El pago real!)
    console.log("Paso 9: Creando Outgoing Payment...");
    const outgoingPayment = await client.outgoingPayment.create(
      {
        url: sendingWalletAddress.resourceServer,
        accessToken: finalizedOutgoingPaymentGrant.access_token.value,
      },
      {
        walletAddress: sendingWalletAddress.id,
        quoteId: quote.id,
      }
    );
    console.log("Paso 9: ¡Éxito!");

    // 10. Enviar respuesta exitosa a la app móvil (Postman)
    console.log("¡Pago exitoso!:", outgoingPayment.id);
    res.json({ success: true, payment: outgoingPayment });
    // --- FIN DEL NUEVO FLUJO ---

  } catch (error) {
    console.error("Error al procesar el pago:", error);
    next(error);
  }
});

export default router;