const express = require("express");
const { addtaskBoard, getTaskBoard, addSubTaskList, deleteBoard, moveSubTask,
    updateTaskBoard,
 } = require("../controller/task");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/boards", authMiddleware, addtaskBoard);
router.post("/boards/:boardId/subtasks", authMiddleware, addSubTaskList);
router.get("/boards", authMiddleware, getTaskBoard);
router.delete("/:boardId", authMiddleware, deleteBoard);
router.put("/move/subtask", authMiddleware, moveSubTask);
router.put("/:boardId", authMiddleware, updateTaskBoard);

module.exports = router;