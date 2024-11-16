// import axios from "axios";
// import { configDotenv } from "dotenv";

// configDotenv();
// const TELEGRAM_BOT_TOKEN = '7278024058:AAF4TbYuLfyJMjXMMBdirLx0aYFgffiDHcg'

// let items = [];

// const getFileUrl = async (fileId) => {
//     try {
//         const filePathResponse = await axios.get(
//             `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`
//         );
//         const filePath = filePathResponse.data.result.file_path;
//         return `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;
//     } catch (error) {
//         console.error("Error fetching image:", error);
//         return null;
//     }
// };

// export default async function handler(req, res) {
//     if (req.method === 'GET') {
//         res.json(items);
//     } else {
//         res.status(405).send('Method Not Allowed');
//     }
// }





