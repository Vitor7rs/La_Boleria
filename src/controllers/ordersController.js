import repository from "../repositories/repository.js";

export async function postOrder(req, res) {
    const{clientId, cakeId, quantity}= req.body

    try{
        const client = await repository.getClientById(clientId)
        if(client.rowCount <= 0){
            return res.status(404).send("Client id not found")
        }

        const cakePrice = await repository.getCakePriceById(cakeId)
        if(cakePrice.rowCount <= 0){
            return res.status(404).send("Cake id not found")
        }

        let totalPrice = (cakePrice.rows[0].price * quantity)
        await repository.createOrder(clientId, cakeId, quantity, totalPrice)

        return res.status(201).send('Created');

    }catch(error){
        console.log(error)
        return res.status(500).send("INTERNAL SERVER ERROR")
    }
}

export async function getOrders(req, res) {
    let date = req.query.date;
    try{
        const ordersData = await repository.getOrders(date)
        if(ordersData.rowCount <= 0){
            return res.status(404).send([]);
        }
        const orders = ordersData.rows.map(
            order => (
                {
                    clients: {
                        id: order.clientId,
                        name: order.clientName,
                        address: order.clientAddress,
                        phone: order.clientPhone
                    },
                    cake: {
                        id: order.cakeId,
                        name: order.cakeName,
                        price: order.cakePrice,
                        description: order.cakeDescription,
                        image: order.cakeImage
                    },
                    orderId: order.orderId,
                    createdAt: order.createdAt,
                    quantity: order.quantity,
                    totalPrice: order.totalPrice
                }
            )
        )
        return res.status(200).send(orders)
    }catch(error){
        console.log(error)
        return res.status(500).send("INTERNAL SERVER ERROR")
    }
}

export async function getOrder(req, res) {
    const orderId = req.params.id;
    try{
        const orderData = await repository.getOrderById(orderId)
        if(orderData.rowCount <= 0){
            return res.status(404).send("Order id not found")
        }

        const order = orderData.rows.map(
            order => (
                {
                    clients: {
                        id: order.clientId,
                        name: order.clientName,
                        address: order.clientAddress,
                        phone: order.clientPhone
                    },
                    cake: {
                        id: order.cakeId,
                        name: order.cakeName,
                        price: order.cakePrice,
                        description: order.cakeDescription,
                        image: order.cakeImage
                    },
                    orderId: order.orderId,
                    createdAt: order.createdAt,
                    quantity: order.quantity,
                    totalPrice: order.totalPrice
                }
            )
        )
        return res.status(200).send(order)

    }catch(error){
        console.log(error)
        return res.status(500).send("INTERNAL SERVER ERROR")
    }
}