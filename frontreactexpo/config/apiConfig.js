// esta IP por la de tu computadora en la red local
const LOCAL_IP = '192.168.38.182'; 

export const API_URL =
  __DEV__
    ? `http://${LOCAL_IP}:5000`          // desarrollo (backend local)
    : 'https://mi-api-en-produccion.com'; 
