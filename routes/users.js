var express = require('express');
var router = express.Router();
var userModel = require('../model/user-schema');
const mongoose = require('mongoose');
// var csv = require("fast-csv");
const fs = require('fs')
const csv = require('csv-parser')
const randomWords = require('random-words')

/* GET users listing. */
router.get('/', function (req, res, next) {
  mongoose.set('debug', true);
  console.log('in----',req.query);

  // convert km to radian
  let kmToRadian = function (miles) {
    var earthRadiusInMiles = 6378;
    return miles / earthRadiusInMiles;
  };

  var query = { 'location': { $geoWithin: { $centerSphere: [[req.query.long, req.query.lat], kmToRadian(req.query.rangeKm)] } } }

  userModel.find(query).then((users) => {
    console.log('len---', users.length);
    // if (err) return x(err);
    res.json(users);
    // res.render('users-list', { users });
  });
  // res.send('respond with a resource');

});

router.get('/import', function (req, res, next) {
  mongoose.set('debug', true);

  const users = [];
  fs.createReadStream('./customer.csv')
    .pipe(csv())
    .on('data', function (row) {

      const user = {
        name: row.name,
        cust_code: row.cust_code,
        location: {
          type: 'Point',
          coordinates: [row.longitude, row.latitude]
        }
      }
      // console.log('user---',user);
      users.push(user)
    })
    .on('end', function () {
      userModel.insertMany(users);
    })

  res.send('respond with a resource');
});

module.exports = router;
