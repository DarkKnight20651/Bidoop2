// app.config.js
export default ({ config }) => ({
  ...config,
  name: "mapbox-expo",
  slug: "mapbox-expo",
  newArchEnabled: false,

  android: {
    package: "com.vasv2.mapboxexpo", // 👈 el identificador que tú quieras, en formato dominio
  },
  plugins: [
    [
      "@rnmapbox/maps",
      {
        // Usamos el SDK nativo oficial de Mapbox
        RNMapboxMapsImpl: "mapbox",
        // Token de descarga leído desde env (EAS)
        RNMapboxMapsDownloadToken: process.env.RNMAPBOX_MAPS_DOWNLOAD_TOKEN,
      },
    ],
  ],
});
