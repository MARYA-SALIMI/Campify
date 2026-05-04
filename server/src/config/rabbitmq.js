const amqp = require('amqplib');

let connection = null;
let channel = null;

const connectRabbitMQ = async () => {
    try {
        const rabbitmqUrl = process.env.RABBITMQ_URL;
        
        if (!rabbitmqUrl) {
            console.error('❌ RABBITMQ_URL bulunamadı!');
            return;
        }

        connection = await amqp.connect(rabbitmqUrl);
        channel = await connection.createChannel();
        
        console.log('✅ RabbitMQ bağlantısı başarılı');
        
        // Bağlantı kopmalarına karşı listener'lar
        connection.on('error', (err) => {
            console.error('RabbitMQ Bağlantı Hatası:', err);
        });

        connection.on('close', () => {
            console.warn('RabbitMQ Bağlantısı kapandı.');
        });
        
    } catch (error) {
        console.error('❌ RabbitMQ Bağlantısı başarısız:', error.message);
        process.exit(1);
    }
};

const getChannel = () => {
    if (!channel) {
        throw new Error('RabbitMQ kanalı henüz oluşturulmadı. Lütfen önce bağlanın.');
    }
    return channel;
};

module.exports = {
    connectRabbitMQ,
    getChannel
};
