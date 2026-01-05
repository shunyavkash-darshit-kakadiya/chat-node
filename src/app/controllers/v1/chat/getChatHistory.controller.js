import Message from "../../../../models/message.model.js";

const getChatHistory = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { receiverId } = req.params;

    const query = {
      $or: [
        { senderId: currentUserId, receiverId },
        { senderId: receiverId, receiverId: currentUserId },
      ],
    };

    const messages = await Message.find(query)
      .populate("senderId", "fullName email")
      .populate("receiverId", "fullName email")
      .sort({ createdAt: 1 }); // oldest to newest

    const count = await Message.countDocuments(query);

    res.status(200).json({
      success: true,
      data: messages,
      count: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load chat history",
    });
  }
};

export default getChatHistory;
