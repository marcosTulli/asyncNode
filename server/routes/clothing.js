const express = require('express');
const fs = require('fs');
const fsPromises = require('fs').promises;
const datafile = 'server/data/clothing.json';
const router = express.Router();

module.exports = function (monitor) {
  let dataMonitor = monitor;

  dataMonitor.on('dataAdded', (item) => {
    console.log(`New data was aded: ${item}`);
  });

  /* GET all clothing */
  router
    .route('/')
    .get(async function (req, res) {
      try {
        let data = await getClothingData();
        res.send(data);
      } catch (error) {
        res.status(500).send(error);
      }
    })

    .post(async function (req, res) {
      try {
        let data = await getClothingData();

        let nextID = getNextAvailableID(data);

        let newClothingItem = {
          clothingID: nextID,
          itemName: req.body.itemName,
          price: req.body.price,
        };

        data.push(newClothingItem);

        await saveClothingData(data);
        dataMonitor.emit('dataAdded', newClothingItem.itemName);

        console.log('Returning new item to the browser');

        res.status(201).send(newClothingItem);
      } catch (error) {
        res.status(500).send(error);
      }
    });

  async function getClothingData() {
    let rawData = await fsPromises.readFile(datafile, 'utf8');
    let clothingData = JSON.parse(rawData);

    return clothingData;
  }

  function getNextAvailableID(allClothingData) {
    let maxID = 0;

    allClothingData.forEach(function (element, index, array) {
      if (element.clothingID > maxID) {
        maxID = element.clothingID;
      }
    });
    return ++maxID;
  }

  function saveClothingData(data) {
    return fsPromises.writeFile(datafile, JSON.stringify(data, null, 4));
  }
  return router;
};

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// const express = require('express');
// const fs = require('fs');
// const fsPromises = require('fs').promises;
// const datafile = 'server/data/clothing.json';
// const router = express.Router();

// /* GET all clothing */
// router.route('/').get(async function (req, res) {
//   try {
//     let data = await getClothingData();
//     console.log('Returning asynct data');
//     res.send(data);
//   } catch (err) {
//     res.status(500).send(err);
//   }

//   //
//   //
//   //
//   //
//   //
//   //
//   // Promises
//   //
//   // getClothingData()
//   //   .then((data) => {
//   //     console.log('Return Clothing data to browser');
//   //     res.send(data);
//   //   })
//   //   .catch((err) => {
//   //     res.status(500).send(err);
//   //   })
//   //   .finally(() => console.log('All Done processiong promise'));

//   // console.log('Doing more work Work');
//   //
//   // Callback
//   //
//   // getClothingData((err, data) => {
//   //   if (err) {
//   //     console.log(err);
//   //   } else {
//   //     console.log('Getting clothing data');
//   //     res.send(data);
//   //   }
//   // });
//   // console.log('Doing more work Work');
// });

// async function getClothingData() {
//   let rawData = await fsPromises.readFile(datafile, 'utf8');
//   let clothingData = JSON.parse(rawData);
//   console.log(clothingData);
//   return clothingData;

//   // Promises
//   // return new Promise((res, rej) => {
//   //   fs.readFile(datafile, 'utf8', (err, data) => {
//   //     if (err) {
//   //       rej(err);
//   //     } else {
//   //       let clothingData = JSON.parse(data);
//   //       res(clothingData);
//   //     }
//   //   });
//   // });
// }

// module.exports = router;
