const express = require('express');
const restaurantModel = require('../models/Restaurant');
const app = express();

// http://localhost:3000/restaurant
app.post('/restaurant', async (req, res) => {

    console.log(req.body)
    const restaurant = new restaurantModel(req.body);

    try {
        await restaurant.save((err) => {
            if (err) {

                res.send(err)
            } else {
                res.send(restaurant);
            }
        });
    } catch (err) {
        res.status(500).send(err);
    }
});


app.get('/restaurants', async (req, res) => {
    const restaurant = await restaurantModel.find({});

    try {
        console.log(restaurant[0].name)
        res.status(200).send(restaurant);
    } catch (err) {
        res.status(500).send(err);
    }
});


app.get('/restaurants/cuisine/:name', async (req, res) => {
    const name = req.params.name

    const restaurants = await restaurantModel.find({ cuisine: name });

    try {
        if (restaurants.length != 0) {
            res.send(restaurants);
        } else {
            res.send(JSON.stringify({ status: false, message: "No data found" }))
        }
    } catch (err) {
        res.status(500).send(err);
    }
});


app.get('/restaurants', async (req, res) => {


    console.log(req.query.sortBy);

    const restaurants = await restaurantModel.find({}).select("_id cuisine name city restaurant_id").sort({ 'restaurant_id': req.query.sortBy });


    try {

        res.status(200).send(restaurants);
    } catch (err) {
        res.status(500).send(err);
    }
});



app.get('/restaurants/:cuisine', async (req, res) => {
    const cusine = req.params.cuisine;

    try {
        const restaurants = restaurantModel.
            find({})
            .where('cuisine').equals(cusine)
            .where('city').ne('Brooklyn')
            .select('cuisine name city')
            .sort({ 'name': 'asc' })
            .exec((err, data) => {
                if (err) {
                    res.send(JSON.stringify({ status: false, message: "No data found" }));
                } else {
                    res.send(data);
                }
            });
    } catch (err) {
        res.status(500).send(err);
    }
});




module.exports = app