const Joi = require("joi");
const base = require("./base.validator");

const addTaskValidator = Joi.object({
    name: Joi.string().min(2).max(30).required(),
    id: Joi.string().min(2).max(30).optional(),
});

const addSubTaskValidor = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional().allow(''),
    notes: Joi.string().optional().allow('')
  });

const moveSubTaskValidator = Joi.object({
    subtaskId: Joi.string().required(),
    previousBoardId: Joi.string().required(),
    newBoardId: Joi.string().required(),
    index: Joi.number().required(),
  });

  const updateTaskBoardValidator = Joi.object({
    name: Joi.string().trim().min(1).required(),
  });
  

module.exports = { addTaskValidator, addSubTaskValidor, moveSubTaskValidator, updateTaskBoardValidator }