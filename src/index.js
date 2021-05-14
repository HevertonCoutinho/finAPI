const express = require('express');
const { v4: uuidv4 } = require("uuid")


const app = express();

/**midleware */
app.use(express.json());

/**
 * cpf - string
 * name - string
 * id - uuid
 * statement []
 */
const customers = [];

app.post("/account", (request, response) =>{
    const { cpf, name } = request.body;

    const customerAlreadyExists = customers.some(
        (customer) => customer.cpf === cpf);

    if(customerAlreadyExists) {
        return response.status(400).json({error: "Customer Already Exists!"})
    }


    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    });

    return response.status(201).send();
});

app.get("/statement", (request, response) => {
    const {cpf} = request.headers;

    const customer = customers.find((customer) => customer.cpf === cpf);
    if(!customer) {
        return response.status(400).json({error: "Customer Not Found!"});
    };
    return response.json(customer.statement);
});
app.listen(3333);