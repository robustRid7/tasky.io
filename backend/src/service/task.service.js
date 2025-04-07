const CustomError = require('../common/error');
const Subtask = require('../model/subTask');
const TaskBoard = require('../model/taskBoard');
const { Types } = require('mongoose');

const addTask = async function ({ name, id }) {
  try {
    const taskBoard = new TaskBoard({
      name,
      createdBy: id,
      subtasks: [] 
    });

    const savedBoard = await taskBoard.save();
    return savedBoard;
  } catch (error) {
    console.error('Error adding task board:', error);
    throw error;
  }
};

const getTask = async function ({ id }) {
  try {
    const boards = await TaskBoard.find({ createdBy: id })
      .populate('subtasks')
      .populate('createdBy', 'fullName email')
      .lean();

    return boards;
  } catch (error) {
    console.error('Error getting task board:', error);
    throw error;
  }
};

const addSubTask = async function (boardId, subtaskData) {
  try {
    const board = await TaskBoard.findById(boardId);
    if (!board) {
      throw new CustomError(400, "Task board not found");
    }

    const subtask = new Subtask({
      ...subtaskData,
      taskBoardId: boardId
    });

    await subtask.save();

    board.subtasks.push(subtask._id);
    await board.save();

    return subtask;
  } catch (error) {
    console.error("Error in addSubTask service:", error);
    throw error;
  }
};

const deleteTaskBoard = async (boardId) => {
  try {
    const board = await TaskBoard.findById(boardId);
    if (!board) {
      return null; 
    }

    await Subtask.deleteMany({ boardId });

    const deletedBoard = await TaskBoard.findByIdAndDelete(boardId);

    return deletedBoard;
  } catch (error) {
    throw error;
  }
};

const checkValidResource = async ({ boardId, id }) => {
  try {
    const data = await TaskBoard.findOne({
      _id: boardId,
      createdBy: id,
    });

    if (!data) {
      throw new CustomError(401, "This resource is not yours!");
    }

    return true;
  } catch (error) {
    throw error;
  }
};

const updateSubTaskList = async ({
  subtaskId,
  previousBoardId,
  newBoardId,
  id,
  fixIndex,
}) => {
  try {

    const previousBoard = await TaskBoard.findOne({
      _id: previousBoardId,
      createdBy: id,
    });
    if (!previousBoard) {
      throw new CustomError(403, "You don't have permission for the previous board");
    }

    const subtask = await Subtask.findOne({
      _id: subtaskId,
    });

    if (!subtask) {
      throw new CustomError(404, "Subtask not found in previous board");
    }

    
    if(newBoardId == previousBoardId){
      let index = previousBoard.subtasks.findIndex(
        (id) => id.toString() === subtask._id.toString()
      );
      if (index !== -1) previousBoard.subtasks.splice(index, 1); 
      previousBoard.subtasks.splice(fixIndex, 0, subtask._id);
      await previousBoard.save();
      return {
      success: true,
      message: "Subtask moved successfully",
      data: subtask,
    };
    }

    const newBoard = await TaskBoard.findOne({
      _id: newBoardId,
      createdBy: id,
    });
    if (!newBoard) {
      throw new CustomError(403, "You don't have permission for the new board");
    }

    
    let index = previousBoard.subtasks.findIndex(
      (id) => id.toString() === subtask._id.toString()
    );
    if (index !== -1) previousBoard.subtasks.splice(index, 1); 
    newBoard.subtasks.splice(fixIndex, 0, subtask._id);
    subtask.boardId = newBoardId;

    await Promise.all([
      subtask.save(),
      newBoard.save(),
      previousBoard.save()
    ])

    return {
      success: true,
      message: "Subtask moved successfully",
      data: subtask,
    };
  } catch (error) {
    throw error;
  }
};

const updateTaskBoardService = async ({ boardId, name, id }) => {
  try {
    const board = await TaskBoard.findOne({
      _id: boardId,
      createdBy: id,
    });

    if (!board) throw new CustomError(404, "Task board not found");

    board.name = name;
    await board.save();

    return board;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  updateTaskBoardService,
};


module.exports = {
  addTask, getTask, addSubTask, deleteTaskBoard, checkValidResource,
  updateSubTaskList, updateTaskBoardService
};
