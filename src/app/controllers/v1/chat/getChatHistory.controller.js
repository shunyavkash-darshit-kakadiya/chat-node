import Message from "../../../../models/message.model.js";

const getChatHistory = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId },
        { senderId: receiverId, receiverId: currentUserId },
      ],
    }).sort({ createdAt: 1 }); // oldest → newest

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load chat history",
    });
  }
};

export default getChatHistory;
