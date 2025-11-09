// esta IP por la de tu computadora en la red local
<<<<<<< HEAD
const LOCAL_IP = '192.168.38.182'; 
=======
const LOCAL_IP = '192.168.36.201'; 
>>>>>>> bf978acccd7155e767c5a927d26fd53491f865ba

export const API_URL =
  __DEV__
    ? `http://${LOCAL_IP}:5000`          // desarrollo (backend local)
    : 'https://mi-api-en-produccion.com'; 
