const { addTaskValidator, addSubTaskValidor, moveSubTaskValidator, updateTaskBoardValidator } = require("../validator/task.validator");
const { addTask, getTask, addSubTask, deleteTaskBoard, checkValidResource, updateSubTaskList,
  updateTaskBoardService,
 } = require("../service/task.service");

const addtaskBoard = async function (req, res) {
  try {
    const { error, value } = addTaskValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { id } = req.user;
    const { name } = value;

    const newBoard = await addTask({ name, id });

    return res.status(201).json({
      success: true,
      message: "Task board created successfully",
      data: newBoard
    });

  } catch (error) {
    console.error("Error in addtaskBoard controller:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the task board",
      error: error.message
    });
  }
};

const getTaskBoard = async function (req, res) {
  try {
    const { id } = req.user;

    const list = await getTask({ id });

    return res.status(200).json({
      success: true,
      message: 'Task boards fetched successfully',
      data: list
    });
  } catch (error) {
    console.error("Error in getTaskBoard controller:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the task boards",
      error: error.message
    });
  }
};

const addSubTaskList = async function (req, res) {
  try {
    const { boardId } = req.params;
    const { error, value } = addSubTaskValidor.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: error.details[0].message
      });
    }

    const createdSubtask = await addSubTask(boardId, value);

    return res.status(201).json({
      success: true,
      message: "Subtask added successfully",
      data: createdSubtask
    });

  } catch (error) {
    console.error("Error in addSubTaskList controller:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while adding the subtask",
      error: error.message
    });
  }
};


const deleteBoard = async function (req, res) {
  try {
    const { boardId } = req.params;
    const { id } = req.user;

    if (!boardId) {
      return res.status(400).json({
        success: false,
        message: "Board ID is required",
      });
    }
    
    await checkValidResource({boardId, id})

    const deletedBoard = await deleteTaskBoard(boardId);

    if (!deletedBoard) {
      return res.status(404).json({
        success: false,
        message: "Task board not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task board and its subtasks deleted successfully",
    });

  } catch (error) {
    console.error("Error in deleteBoard controller:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the task board",
      error: error.message,
    });
  }
};

const moveSubTask = async function (req, res) {
  try {
    const { error, value } = moveSubTaskValidator.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: error.details[0].message,
      });
    }

    const { id } = req.user;
    const { subtaskId, previousBoardId, newBoardId, index } = value;
    console.log(index)
    const result = await updateSubTaskList({
      subtaskId,
      previousBoardId,
      newBoardId,
      id,
      fixIndex: index,
    });

    return res.status(200).json({
      success: true,
      message: "Subtask moved successfully",
      data: result.data,
    });
  } catch (error) {
    console.error("Error in moveSubTask controller:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while moving the subtask",
      error: error.message,
    });
  }
};

const updateTaskBoard = async function (req, res) {
  try {
    const { boardId } = req.params;
    const { error, value } = updateTaskBoardValidator.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: error.details[0].message,
      });
    }

    const updated = await updateTaskBoardService({
      boardId,
      name: value.name,
      id: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Task board updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error in updateTaskBoard controller:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the board",
      error: error.message,
    });
  }
};


module.exports = {
  addtaskBoard,
  getTaskBoard,
  addSubTaskList,
  deleteBoard,
  moveSubTask,
  updateTaskBoard,
};
