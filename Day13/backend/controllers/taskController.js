import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, permission } = req.body;

    const task = new Task({
      title,
      description,
      project,
      assignedTo,
      permission,
    });

    await task.save();

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN - All tasks
export const getTasks = async (req, res) => {
  const tasks = await Task.find().populate("assignedTo").populate("project");

  res.json(tasks);
};

// MEMBER - Only his tasks
export const getMyTasks = async (req, res) => {
  const tasks = await Task.find({
    assignedTo: req.user.id,
  });

  res.json(tasks);
};

// Update status
export const updateTaskStatus = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (task.permission === "view") {
    return res.status(403).json({
      message: "You can only view this task",
    });
  }

  task.status = req.body.status;

  await task.save();

  res.json(task);
};
