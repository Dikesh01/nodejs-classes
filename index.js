const express = require("express");
const app = express();

app.use(express.json());

// Using body method 
// Postman formate => in body => raw =>{
//     {
//         "num1":20,
//         "num2":75
//     }
// }
app.post("/add", (req, res)=>{
    const num1 = req.body.num1;
    const num2 = req.body.num2;

    const sum = num1 + num2;

    res.status(200).send({ sum });
})

// Using params method
// Postman formate => http://localhost:8001/subtract/25/30
app.get("/subtract/:num1/:num2", (req, res)=>{
    const num1 = req.params.num1;
    const num2 = req.params.num2;

    const diff = num1 - num2;

    res.status(200).send({ diff });
})

// Using query method
// postman formate => http://localhost:8001/multiply?num1=25&num2=5
app.get("/multiply", (req, res) =>{
    const num1 = Number(req.query.num1);
    const num2 = Number(req.query.num2);

    const prod = num1 * num2;

    res.status(200).send({ prod });
})

// Using params for num1 and body for num2
// postman formate => http://localhost:8001/devide/125
app.post("/devide/:num1", (req, res)=>{
    const num1 = req.params.num1;
    const num2 = req.body.num2;
    if(num2 === 0){
        res.status(404).send({ message: "Denominator can not be 0!"})
    }

    const quocient = num1 / num2;

    res.status(200).send({  quocient });
})

app.listen(8001, ()=>{
    console.log("Server is running at port ", 8001)
})