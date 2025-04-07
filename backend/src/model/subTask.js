const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const subtaskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    notes: { type: String },
    taskBoardId: { type: Types.ObjectId, ref: 'TaskBoard', required: true }
  },
  {
    timestamps: true
  }
);
subtaskSchema.index({ taskBoardId: 1 });

const Subtask = model('Subtask', subtaskSchema);
module.exports = Subtask;
