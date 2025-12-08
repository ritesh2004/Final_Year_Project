import mqtt from 'mqtt';
import dotenv from 'dotenv';

dotenv.config();

let interval: NodeJS.Timeout;

const testMqttOptions = {
    host: process.env.MQTT_CLUSTER_URL || 'test.mosquitto.org',
    port: process.env.MQTT_PORT ? parseInt(process.env.MQTT_PORT) : 8883,
    protocol: 'mqtts' as 'mqtts',
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD
};

const testMqttClient = mqtt.connect(testMqttOptions);

testMqttClient.on('connect', () => {
    console.log('Test MQTT client connected');

    interval = setInterval(() => {
        const data = generateRandomData();
        const topic = 'sensor/data';
        const message = JSON.stringify(data);

        testMqttClient.publish(topic, message, { qos: 0 }, (err) => {
            if (err) {
                console.error('Publish error:', err);
            } else {
                console.log('Published:', message);
            }
        });
    }, 5000);
});

testMqttClient.on('error', (error) => {
    console.error('Test MQTT client error:', error);
});

const generateRandomData = () => {
    return {
        temperature: (20 + Math.random() * 10).toFixed(2),
        humidity: (30 + Math.random() * 20).toFixed(2),
        atmosphericPressure: (1000 + Math.random() * 50).toFixed(2),
        radiation: (200 + Math.random() * 100).toFixed(2),
        windspeed: (5 + Math.random() * 15).toFixed(2)
    };
};

process.on('SIGINT', () => {
    clearInterval(interval);
    testMqttClient.end(() => {
        console.log('Test MQTT client disconnected');
        process.exit(0);
    });
});