// import express from "express";
// import ViteExpress from "vite-express";
// import axios from "axios";
// import { configDotenv } from "dotenv";
// configDotenv();
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Ensure this key is correct

// const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN;
// const TELEGRAM_CHAT_ID = process.env.CHAT_ID;

// const app = express();
// app.use(express.json());

// let items = [];
// let nextItemId = 1; // Initialize the nextItemId

// // Helper function to get file URL from Telegram
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

// // Handle POST requests from the Telegram bot
// app.post(`/${TELEGRAM_BOT_TOKEN}`, async (req, res) => {
//     console.log(req.body);

//     const message =
//         req.body.message ||
//         req.body.edited_message ||
//         req.body.channel_post ||
//         req.body.edited_channel_post;

//     if (message) {
//         const { caption, photo, message_id, media_group_id } = message;

//         // Check if this is part of a media group
//         let item = items.find((item) => item.media_group_id === media_group_id);

//         if (caption) {
//             const lines = caption.split("\n").map(line => line.trim());

//             // Extract the first three lines as name, description, and price
//             const name = lines[0] || "";
//             const description = lines[1] || "";
//             const price = lines[2] || "";

//             // Everything after the third line is treated as specs
//             const specs = lines.slice(3).join("\n");

//             if (caption.includes("DELETE")) {
//                 // Remove item if caption contains "DELETE"
//                 items = items.filter((item) => item.media_group_id !== media_group_id);
//                 return res.send("Item deleted");
//             }

//             if (!item) {
//                 item = {
//                     id: nextItemId++, // Assign and increment item ID
//                     message_id,
//                     media_group_id,
//                     name,
//                     description,
//                     price,
//                     specs,
//                     imageUrls: [],
//                 };
//                 items.push(item);
//             } else {
//                 item.name = name || item.name;
//                 item.description = description || item.description;
//                 item.price = price || item.price;
//                 item.specs = specs || item.specs;
//             }
//         }

//         if (photo) {
//             const largestPhoto = photo[photo.length - 1];
//             const imageUrl = await getFileUrl(largestPhoto.file_id);
//             if (imageUrl) {
//                 if (!item) {
//                     item = {
//                         id: nextItemId++, // Assign and increment item ID
//                         message_id,
//                         media_group_id,
//                         imageUrls: [imageUrl],
//                     };
//                     items.push(item);
//                 } else if (!item.imageUrls.includes(imageUrl)) {
//                     item.imageUrls.push(imageUrl);
//                 }
//             }
//         }
//     }

//     res.send("Data received");
// });

// // Serve the latest items via an API endpoint
// app.get("/api/items", async (req, res) => {
//     res.json(items);
// });

// // Provide item IDs endpoint
// app.get("/api/item-ids", (req, res) => {
//     res.json({ itemIds: items.map(item => item.id) });
// });




// app.post('/create-checkout-session', async (req, res) => {
//     console.log('Received request to create checkout session:', req.body); // Log the incoming request body
//     try {
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ['card'],
//             mode: 'payment',
//             line_items: req.body.items.map(item => {
//                 const storeItem = items.find(i => i.id === item.id);
//                 if (!storeItem) {
//                     console.error(`Item not found: ${item.id}`); // Log if item is not found
//                     throw new Error(`Item not found: ${item.id}`);
//                 }
//                 return {
//                     price_data: {
//                         currency: 'usd',
//                         product_data: {
//                             name: storeItem.name,
//                         },
//                         unit_amount: Math.round(storeItem.price * 100),
//                     },
//                     quantity: item.quantity,
//                 };
//             }),
//             success_url: `${process.env.SERVER_URL}`,
//             cancel_url: `${process.env.SERVER_URL}`,
//         });
//         res.json({ url: session.url });
//     } catch (err) {
//         console.error('Error creating checkout session:', err); // Log the error details
//         res.status(500).json({ message: 'Internal Server Error', error: err.message });
//     }
// });




// app.post("/api/sendOrderToTelegram", async (req, res) => {
//     const { totalAmount, items, userId, userName } = req.body;
//     const dateTime = new Date().toLocaleString();

//     try {
//         const itemsList = items.map(item => `
//             Name: ${item.name}
//             Description: ${item.description}
//             Quantity: ${item.quantity}
//             Price: ${item.price}
//         `).join("\n\n");

//         const message = `
//         **New Order Received**

//         - User ID: ${userId}
//         - User Email: ${userName}
        
//         **Total Amount: ${totalAmount}**
        
//         **Items:**
//         ${itemsList}

//         **Order Date: ${dateTime}**
//         `;

//         console.log('Sending message to Telegram:', message);

//         const response = await axios.post(
//             `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
//             {
//                 chat_id: TELEGRAM_CHAT_ID,
//                 text: message,
//                 parse_mode: 'Markdown'
//             }
//         );

//         console.log('Telegram response:', response.data);

//         res.send("Order sent to Telegram");
//     } catch (error) {
//         console.error("Error sending order to Telegram:", error.response ? error.response.data : error.message);
//         res.status(500).send("Error sending order to Telegram");
//     }
// });

// // Start the server
// ViteExpress.listen(app, 3000, () =>
//     console.log("Server is listening on port 3000...")
// );

// // Set the webhook for Telegram
// const setWebhook = async () => {
//     try {
//         const webhookUrl = `https://4981-102-218-50-140.ngrok-free.app/${TELEGRAM_BOT_TOKEN}`;
//         const response = await axios.post(
//             `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`,
//             {
//                 url: webhookUrl,
//             }
//         );
//         console.log("Webhook set:", response.data);
//     } catch (error) {
//         console.error(
//             "Error setting webhook:",
//             error.response ? error.response.data : error.message
//         );
//     }
// };

// setWebhook();






// import express from "express";
// import ViteExpress from "vite-express";
// import axios from "axios";
// import { configDotenv } from "dotenv";
// configDotenv();

// const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN;
// const TELEGRAM_CHAT_ID = process.env.CHAT_ID;

// const app = express();
// app.use(express.json());

// let items = [];
// let nextItemId = 1; // Initialize the nextItemId

// // Helper function to get file URL from Telegram
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

// // Handle POST requests from the Telegram bot
// app.post(`/${TELEGRAM_BOT_TOKEN}`, async (req, res) => {
//     console.log(req.body);

//     const message =
//         req.body.message ||
//         req.body.edited_message ||
//         req.body.channel_post ||
//         req.body.edited_channel_post;

//     if (message) {
//         const { caption, photo, message_id, media_group_id } = message;

//         let item = items.find((item) => item.media_group_id === media_group_id);

//         if (caption) {
//             const lines = caption.split("\n").map(line => line.trim());

//             // Extract the first three lines as name, description, and price
//             const name = lines[0] || "";
//             const description = lines[1] || "";
//             const price = lines[2] || "";

//             // Everything after the third line is treated as specs
//             const specs = lines.slice(3).join("\n");

//             if (caption.includes("DELETE")) {
//                 // Remove item if caption contains "DELETE"
//                 items = items.filter((item) => item.media_group_id !== media_group_id);
//                 return res.send("Item deleted");
//             }

//             if (!item) {
//                 item = {
//                     id: nextItemId++, // Assign and increment item ID
//                     message_id,
//                     media_group_id,
//                     name,
//                     description,
//                     price,
//                     specs,
//                     imageUrls: [],
//                 };
//                 items.push(item);
//             } else {
//                 item.name = name || item.name;
//                 item.description = description || item.description;
//                 item.price = price || item.price;
//                 item.specs = specs || item.specs;
//             }
//         }

//         if (photo) {
//             const largestPhoto = photo[photo.length - 1];
//             const imageUrl = await getFileUrl(largestPhoto.file_id);
//             if (imageUrl) {
//                 if (!item) {
//                     item = {
//                         id: nextItemId++,
//                         message_id,
//                         media_group_id,
//                         imageUrls: [imageUrl],
//                     };
//                     items.push(item);
//                 } else if (!item.imageUrls.includes(imageUrl)) {
//                     item.imageUrls.push(imageUrl);
//                 }
//             }
//         }
//     }

//     res.send("Data received");
// });

// // Serve the latest items via an API endpoint
// app.get("/api/items", async (req, res) => {
//     res.json(items);
// });

// // Provide item IDs endpoint
// app.get("/api/item-ids", (req, res) => {
//     res.json({ itemIds: items.map(item => item.id) });
// });



// app.post("/api/sendOrderToTelegram", async (req, res) => {
//     const { totalAmount, items, userId, userName } = req.body;
//     const dateTime = new Date().toLocaleString();

//     try {
//         const itemsList = items.map(item => `
//             Name: ${item.name}
//             Description: ${item.description}
//             Quantity: ${item.quantity}
//             Price: ${item.price}
//         `).join("\n\n");

//         const message = `
//         **New Order Received**

//         - User ID: ${userId}
//         - User Email: ${userName}
        
//         **Total Amount: ${totalAmount}**
        
//         **Items:**
//         ${itemsList}

//         **Order Date: ${dateTime}**
//         `;

//         console.log('Sending message to Telegram:', message);

//         const response = await axios.post(
//             `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
//             {
//                 chat_id: TELEGRAM_CHAT_ID,
//                 text: message,
//                 parse_mode: 'Markdown'
//             }
//         );

//         console.log('Telegram response:', response.data);

//         res.send("Order sent to Telegram");
//     } catch (error) {
//         console.error("Error sending order to Telegram:", error.response ? error.response.data : error.message);
//         res.status(500).send("Error sending order to Telegram");
//     }
// });

// ViteExpress.listen(app, () =>
//     console.log("Server is listening on port 3000...")
// );


// // https://7c1c-102-213-69-44.ngrok-free.app
// const setWebhook = async () => {
//     try {
//         const webhookUrl = `https://kalit-watch-store-ar67.vercel.app/${TELEGRAM_BOT_TOKEN}`;
//         const response = await axios.post(
//             `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`,
//             {
//                 url: webhookUrl,
//             }
//         );
//         console.log("Webhook set:", response.data);
//     } catch (error) {
//         console.error(
//             "Error setting webhook:",
//             error.response ? error.response.data : error.message
//         );
//     }
// };

// setWebhook();

