import mqtt from "mqtt";
import dotenv from "dotenv";

dotenv.config();

interface MqttOptions {
    host: string;
    port: number;
    protocol: 'mqtt' | 'mqtts' | 'ws' | 'wss';
    username?: string;
    password?: string;
}

const options: MqttOptions = {
    host: process.env.MQTT_CLUSTER_URL || 'broker.hivemq.com',
    port: process.env.MQTT_PORT ? parseInt(process.env.MQTT_PORT) : 8883,
    protocol: 'mqtts',
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD
}

console.log(options)

// initialize the MQTT client
const client = mqtt.connect(options);

export default client;