import Task  from "../models/task.model.js";

// craete task
export const createTask = async (req, res) => {
    const { title, description, deadline, assignedTo} = req.body;
    const isAdmin = req.user.role === "admin";

    try {
        if(!isAdmin && assignedTo && assignedTo !== req.user.id) {
            return res.status(403).json({message: "User can only assign task to themselves"});
        };

        const task = await Task.create({ 
            title, 
            description, 
            deadline, 
            createdBy: req.user.id, 
            assignedTo: isAdmin ? assignedTo || req.user.id : req.user.id
        });
        res.status(200).json({message: "Task created", task});
    } catch (error) {
        res.status(500).json({message: "Internal server error"})
    }

};