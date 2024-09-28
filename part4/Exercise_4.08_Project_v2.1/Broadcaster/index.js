const { connect } = require('nats');
const axios = require('axios');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const ENV_NAME = process.env.ENV_NAME;

async function run() {
    const nats = await connect({
        servers: process.env.NATS_URL || 'nats://localhost:4222'
    });

    const subjects = ['todo.created', 'todo.updated', 'todo.deleted'];
    const subscriptions = subjects.map(subject => nats.subscribe(subject, { queue: 'todo-broadcaster' }));

    console.log("Broadcaster is running...");

    // Handle all subscriptions concurrently
    await Promise.all(subscriptions.map(async (subscription, index) => {
        for await (const message of subscription) {
            const data = JSON.parse(message.data);
            console.log(subjects[index], data);
            // Send to Telegram only if the environment is production
            if (ENV_NAME === 'prod') {
                await sendToTelegram(`${subjects[index]}: \n ${JSON.stringify(data, null, 2)}`);
            }
        }
    }));
}

async function sendToTelegram(text) {
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        await axios.post(url, {
            chat_id: TELEGRAM_CHAT_ID,
            text: text
        });
        console.log('Message sent to Telegram');
    } catch (error) {
        console.error('Error sending message to Telegram:', error.message);
    }
}

run().catch(console.error);