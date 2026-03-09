const tasks = require("../data/tasks");

exports.getTasks = (req, res) => {
  res.json({
    success: true,
    data: tasks,
    message: "All tasks fetched",
  });
};

exports.getTaskById = (req, res) => {
  const task = tasks.find((t) => t.id == req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  res.json({
    success: true,
    data: task,
    message: "Task fetched",
  });
};

exports.createTask = (req, res) => {
  const { title, completed } = req.body;

  const newTask = {
    id: tasks.length + 1,
    title,
    completed,
  };

  tasks.push(newTask);

  res.status(201).json({
    success: true,
    data: newTask,
    message: "Task created successfully",
  });
};

exports.updateTask = (req, res) => {
  const task = tasks.find((t) => t.id == req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  task.title = req.body.title ?? task.title;
  task.completed = req.body.completed ?? task.completed;

  res.json({
    success: true,
    data: task,
    message: "Task updated successfully",
  });
};

exports.deleteTask = (req, res) => {
  const index = tasks.findIndex((t) => t.id == req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  tasks.splice(index, 1);

  res.json({
    success: true,
    message: "Task deleted successfully",
  });
};