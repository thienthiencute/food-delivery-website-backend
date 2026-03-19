const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGE_SERVICE_SID;

const client = twilio(accountSid, authToken);
const createVerification = async (phoneNumber, otp) => {
    client.messages
        .create({
            body: `Mã xác thực Eatsy của bạn là: ${otp}. Mã này sẽ hết hạn trong vòng 10 phút. Vui lòng không cung cấp mã này cho người khác.`,
            messagingServiceSid: messagingServiceSid,
            to: phoneNumber,
        })
        .then((message) => console.log(message.sid));
};

module.exports = { createVerification };
