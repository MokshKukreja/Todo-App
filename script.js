const express = require('express')
const path = require("path")
const app = express()
const port = 3000
const mongoose = require("mongoose")
const bodyParser = require('body-parser');


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost/todoApp');

const taskSchema = new mongoose.Schema({
    task: {
      type: String,
      required: true,
    }
  });


const Task = new mongoose.model("Task",taskSchema);

app.get('/', (req, res) => {
  res.sendFile(__dirname+"/index.html")
})

app.post("/addtask",(req,res)=>{

   const taskText = req.body.task;
   console.log("Received task text:", taskText);
    if(taskText){
        const task = new Task({
            task: taskText
        })
        task.save()
        .then(savedTask => {
            console.log('Task saved:', savedTask);
            res.status(201).json({ message: 'Task added successfully' });
        })
        .catch(error => {
            console.error('Error saving task:', error);
            res.status(500).json({ message: 'Error adding task' });
        });
    }else{
        res.status(400).json({ message: 'Task text is required' });
    }

})

app.get("/displaytask",(req,res)=>{
    Task.find()
    .then(tasks => {
        res.status(200).json(tasks);
    })
    .catch(error => {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Error fetching tasks' });
    });
})

app.delete("/delete/:id",(req,res)=>{
    const taskId = req.params.id;
    Task.findByIdAndRemove(taskId)
        .then(deletedTask => {
            if (!deletedTask) {
                return res.status(404).json({ message: 'Task not found' });
            }
            res.status(200).json({ message: 'Task deleted successfully' });
        })
        .catch(error => {
            console.error('Error deleting task:', error);
            res.status(500).json({ message: 'Error deleting task' });
        });
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})