// import axios from "axios";
// import { configDotenv } from "dotenv";

// configDotenv();

// const TELEGRAM_BOT_TOKEN = '7278024058:AAF4TbYuLfyJMjXMMBdirLx0aYFgffiDHcg'




// export default async function handler(req, res) {
//     if (req.method === 'POST') {
//         try {
//             const webhookUrl = `https://7c1c-102-213-69-44.ngrok-free.app/${TELEGRAM_BOT_TOKEN}`;
//             const response = await axios.post(
//                 `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`,
//                 { url: webhookUrl }
//             );

//             console.log("Webhook set:", response.data);
//             res.status(200).send("Webhook set successfully");
//         } catch (error) {
//             console.error("Error setting webhook:", error);
//             res.status(500).send("Error setting webhook");
//         }
//     } else {
//         res.status(405).send('Method Not Allowed');
//     }
// }
