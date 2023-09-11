const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    messageId: String,
    content: String,
    senderId: String,
    receiverId: String,
    sendTime: String,
    //receiveTime: String
},
{collection: 'usersinfo'})

const Message = mongoose.model('Message', schema)

async function sendMessage(messageId, content, senderId, receiverId, sendTime, /*receiveTime*/) {
    try {
        const message = new Message({messageId, content, senderId, receiverId, sendTime, /*receiveTime*/});
        const result = await message.save();
        console.log(result);
        return message.messageId;
    }
    catch (err) {
        console.log(err);
        return err;
    };
}

async function getMessageById(messageId) {
    try {
        return await Message.findOne({ messageId: messageId});
    }
    catch (err) {
        console.log(err);
        return err;
    };
}

async function updateMessageContent(messageId, newContent) {
    try {
        const message = await Message.findOne({ messageId: messageId});
        if (!message) return;

        message.content = newContent;

        await message.save();
        return true;
    }
    catch (err) {
        console.log(err);
        return err;
    };
}

async function deleteMessage(messageId) {
    try {
        await Message.findByIdAndDelete({ messageId: messageId});
        if (!message) return false;

        message.content = newContent;
        return true;
    }
    catch (err) {
        console.log(err);
        return err;
    };
}


async function getAllMessagesForReceiver(receiverId) {
    try {
        const messages = await Message.find({ receiverId: receiverId});
        if (!messages) return;

        return messages;
    }
    catch (err) {
        console.log(err);
        return err;
    };
}

module.exports = {
    Message,
    sendMessage,
    getMessageById,
    updateMessageContent,
    deleteMessage,
    getAllMessagesForReceiver
}