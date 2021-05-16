const express = require('express');
const { v4: uuidv4 } = require("uuid")


const app = express();

/**midleware */
app.use(express.json());


/**MiddleWare */
function verifyIfExistsAccountCPF(request, response, next) {
    const {cpf} = request.headers;

    const customer = customers.find((customer) => customer.cpf === cpf);
    if(!customer) {
        return response.status(400).json({error: "Customer Not Found!"});
    };

    /**repassando req */
    request.customer = customer;
    return next();
};

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

app.get("/statement", verifyIfExistsAccountCPF, (request, response) => { 

    /**recebendo req da middleware */
    const { customer } = request;
    return response.json(customer.statement);
});

app.post("/deposit", verifyIfExistsAccountCPF, (request, response) => {
    const { description, amount } = request.body;

    const { customer } = request;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    }

    customer.statement.push(statementOperation);
    return response.status(201).send();
;})
app.listen(3333);