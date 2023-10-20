const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 8002;

app.use(express.json());

// Get - get all todos
app.get("/todos", (req, res)=>{
     try{
        const fileData = JSON.parse(fs.readFileSync("./database.json").toString());
        const allTodos = fileData.todos

        res.status(200).send({
            status: 200,
            message: "All todos fetched successfully!",
            data: allTodos
        })

     }catch(err){
        res.status(400).send({
            status:400,
            message:"Failed to fetch all todos!"
        })
     }
})


// Get - get todo based on Id 
app.post("/todo/:id", (req, res)=>{
try{
    const todoId = req.params.id;
    
    const fileData = JSON.parse(fs.readFileSync("./database.json").toString());

    const todoList = fileData.todos;

    let todoWithId = todoList.filter((todo) => todo.id == todoId);

    res.status(200).send({
        status: 200,
        message: "Todo with Id is fetched successfully!",
        data: todoWithId[0]
    })
    }
    catch(err){
        res.status(400).send({
            status: 400,
            message: "Failed to fetch the todo!"
        })
    }
})

// Post - Create a todo...
app.post("/todo", (req, res)=>{
    try{
        const newTodo = {
            id: req.body.id,
            title: req.body.title,
            data: new Date(),
            isCompleted: req.body.isCompleted,
        }
        // converting the filedata from string Buffer --> string --> json
        let fileData = JSON.parse(fs.readFileSync("./database.json").toString());

        fileData.todos.push(newTodo);

        fs.writeFileSync("./database.json", JSON.stringify(fileData));

        res.status(201).send({
            status: 201,
            message: "The new todo is successfully created!!"
        })

    }catch(error){
        res.status(400).send({
            status: 400,
            message: "Failed to create todo!!",
        })
    }
})

// Put - update todo based on Id
app.put("/todo", (req, res)=>{
    try{
        const todoId = req.body.id;
        const updatedBody = req.body;

        let fileData = JSON.parse(fs.readFileSync("./database.json").toString());
        // console.log(fileData.todos);

        fileData.todos.forEach((todo, idx)=>{
            if(todo.id == todoId){
                fileData.todos[idx].id = updatedBody.id;
                fileData.todos[idx].title = updatedBody.title;
                fileData.todos[idx].isCompleted = updatedBody.isCompleted;
                
            }
        })
        console.log(fileData)
        fs.writeFileSync("./database.json", JSON.stringify(fileData));
        res.status(200).send({
            status: 200,
            message: "Todo updated successfully!"
        })
    }
    catch(err){
        res.status(400).send({
            status: 400,
            message: "Failed to update todo by Id!!",
        })
    }
})

// Patch - update todo based on Id
app.patch("/todo", (req, res)=>{
    try{
        const todoId = req.body.id;
        const updatedBody = req.body;

        let fileData = JSON.parse(fs.readFileSync("./database.json").toString());

        fileData.todos.forEach((todo, idx)=>{
            if(todo.id == todoId){
                if(req.body.title){
                    fileData.todos[idx].title = updatedBody.title;
                }

                if(req.body.isCompleted === true || req.body.isCompleted === false){
                    fileData.todos[idx].isCompleted = updatedBody.isCompleted;
                }
            }
        })
        // console.log(fileData)
        fs.writeFileSync("./database.json", JSON.stringify(fileData));
        res.status(200).send({
            status: 200,
            message: "Todo updated successfully!"
        })
    }
    catch(err){
        res.status(400).send({
            status: 400,
            message: "Failed to update todo by Id!!",
        })
    }
})
// Delete - delete todo based on Id
app.delete("/todo", (req, res)=>{
    try{
        const todoId = req.body.id;

        let fileData = JSON.parse(fs.readFileSync("./database.json").toString());

        let deletedTodos = fileData.todos.filter((todo) => todo.id != todoId);
        fileData.todos = deletedTodos;

        fs.writeFileSync("./database.json", JSON.stringify(fileData));
        res.status(200).send({
            status: 200,
            message: "Todo deleted successfully!"
        })
    }
    catch(err){
        res.status(400).send({
            status: 400,
            message: "Failed to delete todo by Id!!",
            data: err
        })
    }
})

app.listen(PORT, ()=>{
    console.log("Server is running at port: ", PORT);
})