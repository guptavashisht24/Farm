var express = require('express');
var router = express.Router();
var monk = require('monk');
const { checkout } = require('.');
var db = monk('localhost:27017/farm');
var collection = db.get('cart');
var inventory = db.get('inventory')
var orders = db.get('orders')


router.post('/order', async function(req, res, next){
    const cart = req.body
    const username = req.cookies.username
    cost = 0.0
    for(let items of cart){
        await  inventory.update({ _id: items.id },
            {
                $set: {
                    quantity : items.maxquantity - items.quantity
                }
            })
        cost+=items.price*items.quantity
    }
    await collection.remove({ userid: username })
    const order = {
        price : cost,
        details : [...cart]
    }
    orders.findOne({userid : username}, function(err, item){
        if(err) throw err;
        if(item){
            orders.update({ userid: username },
                {
                    $addToSet: {
                        orders: order
                    }
                },
                function (err) {
                    if(err) {res.send({success : false})}
                    else
                     {res.send({success : true})}
                })
        }
        else {
            orders.update({ userid: username },
                {
                    $push: {
                        orders: order
                    }
                },
                {
                    upsert: true
                },
                function (err, item) {
                    if(err)
                        {res.send({success : false})} 
                    else
                      res.send({success : true})
                }
            )
        }
    })
})


module.exports = router;