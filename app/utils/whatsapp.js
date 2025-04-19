const axios = require("axios");

const ULTRA_MSG_INSTANCE_ID = "your_instance_id";
const ULTRA_MSG_TOKEN = "your_token";

const sendWhatsAppOTP = async (phone, message) => {
  try {
    const url = `https://api.ultramsg.com/${ULTRA_MSG_INSTANCE_ID}/messages/chat`;

    const data = {
      token: ULTRA_MSG_TOKEN,
      to: phone,
      body: message,
    };

    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    console.error("WhatsApp error:", error.response?.data || error.message);
    throw new Error("WhatsApp send failed.");
  }
};

module.exports = { sendWhatsAppOTP };
