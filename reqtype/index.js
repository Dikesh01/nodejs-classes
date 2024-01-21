const express = require("express");

const app = express();
app.use(express.json());

// sending data through body
app.post("/add", (req, res)=>{
    const num1 = req.body.num1;
    const num2 = req.body.num2;

    const sum = num1 + num2;

    res.status(200).send(  {sum} );
})

// sending data through params
app.get("/subtract/:num1/:num2", (req, res)=>{
    const num1 = Number(req.params.num1);
    const num2 = Number(req.params.num2);

    const diff = num1 - num2;

    res.status(200).send({ diff });
})

// sending data through query
app.post("/multiply", (req, res)=>{
    const num1 = Number(req.query.num1);
    const num2 = Number(req.query.num2);

    const product = num1 * num2;

    res.status(200).send({ product });
})

// divide function using two methods;

app.post("/devide/:num2", (req, res)=>{
    const num1 = req.body.num1;
    const num2 = Number(req.params.num2);

    if(num2 == 0){
        return res.status(400).send({ message: "Denominator can not be 0"});
    }
    const result = num1 / num2;

    res.status(200).send({ result });
})

app.listen(8001, ()=>{
    console.log("Server is running at port:", 8001);
})