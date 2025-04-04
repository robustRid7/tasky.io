const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const taskBoardSchema = new Schema(
  {
    name: { type: String, required: true },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    subtasks: [{ type: Types.ObjectId, ref: 'Subtask' }]
  },
  { timestamps: true }
);

const TaskBoard = model('TaskBoard', taskBoardSchema);
module.exports = TaskBoard;
