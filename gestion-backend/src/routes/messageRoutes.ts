import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { uploadAttachment } from "../middleware/upload";
import { MessageController } from "../controllers/messageController";

const router = Router();

router.get("/conversations", requireAuth, MessageController.getConversations);
router.post("/conversations", requireAuth, MessageController.createConversation);
router.get("/conversations/:id/messages", requireAuth, MessageController.getMessages);
router.post(
  "/conversations/:id/attachment",
  requireAuth,
  uploadAttachment,
  MessageController.sendAttachment,
);
router.patch("/conversations/:id/read", requireAuth, MessageController.markAsRead);
router.get("/unread-count", requireAuth, MessageController.getUnreadCount);
router.get("/users", requireAuth, MessageController.getUsers);

export default router;
