// esta IP por la de tu computadora en la red local
const LOCAL_IP = '192.168.7.190'; 

export const API_URL =
  __DEV__
    ? `http://${LOCAL_IP}:5000`          // desarrollo (backend local)
    : 'https://mi-api-en-produccion.com'; 
