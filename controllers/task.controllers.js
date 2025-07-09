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

// fetch all tasks user admin
export const fetchAllTask = async(req, res) => {
    const userId = req.user.id;
    const role = req.user.role;

    try {
        let task;
        if(role === "admin") {
            task = await Task.find();
        }else {
            task = await Task.find({ createdBy: userId})
        };

        if(!task || task.length === 0) {
            return res.status(404).json({message: "No Task Found"})
        };

        return res.status(200).json({message: "Tasks are fetched", task})
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
};

// delete task user and Admin
export const deleteTask = async (req, res) => {
    const id = req.params.id;
    const userId = req.user.id;
    const role = req.user.role;

    try {

        let task;
        if(role === "admin") {
            task = await Task.findByIdAndDelete(id)
        }else {
            task = await Task.findOneAndDelete({_id: id, createdBy: userId})
        };

        if(!task) {
            return res.status(404).json({message: "Task not exist or unauthorized"})
        };

        return res.status(200).json({message: "Task deleted", task});

    } catch (error) {
        console.log("delete task error: ", error)
        return res.status(500).json({message: "Internal server error"});
    }
};

// upadte task user and admin
export const updateTask = async (req, res) => {
    const { title, description, deadline, status, assignedTo} = req.body;
    const id = req.params.id;
    const userId = req.user.id;
    const role = req.user.role;

    try {

        const updateData = {
            title, description, deadline, status, assignedTo
        };

        let task;

        if(role === "admin") {
            task = await Task.findByIdAndUpdate(id, updateData, {new: true});
        }else {
            task = await Task.findOneAndUpdate({_id: id, createdBy: userId}, updateData, {new: true})
        }

        if(!task) {
            return res.status(404).json({message: "Task not found or Unauthorized"})
        }

        return res.status(200).json({message: "Task Updated", task})

    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }

};

// assigned Task
export const assignTask = async (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;

    try {
        let task;
        if(role === "admin") {
            task = await Task.find({createdBy: userId}).populate({
                path: "assignedTo",
                match: {role: "user"}
            })
            task = task.filter(t => t.assignedTo !== null);
        }else {
            task = await Task.find({assignedTo: userId}).populate({
                path: "createdBy",
                match: {role: "admin"} 
            })
        };

        if(!task || task.length === 0) {
            return res.status(404).json({message: "Task not found or Unauthorized"})
        }

        return res.status(200).json({message: "Task found", task})
    } catch (error) {
        return res.status(500).json({message: "Internal server error"})
    }

};