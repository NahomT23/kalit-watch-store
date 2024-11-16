import axios from "axios";
import { configDotenv } from "dotenv";

configDotenv();

const TELEGRAM_BOT_TOKEN = '7278024058:AAF4TbYuLfyJMjXMMBdirLx0aYFgffiDHcg'
const TELEGRAM_CHAT_ID = '696144741'

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { totalAmount, items, userId, userName } = req.body;
        const dateTime = new Date().toLocaleString();

        try {
            const itemsList = items.map(item => `
                Name: ${item.name}
                Description: ${item.description}
                Quantity: ${item.quantity}
                Price: ${item.price}
            `).join("\n\n");

            const message = `
                **New Order Received**

                - User ID: ${userId}
                - User Email: ${userName}

                **Total Amount: ${totalAmount}**

                **Items:**
                ${itemsList}

                **Order Date: ${dateTime}**
            `;

            await axios.post(
                `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
                {
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown',
                }
            );

            res.status(200).send("Order sent to Telegram");
        } catch (error) {
            console.error("Error sending order to Telegram:", error);
            res.status(500).send("Error sending order to Telegram");
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
}
