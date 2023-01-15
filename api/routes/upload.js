const upload                        = require("../middleware/upload");
const express                       = require("express");
const router                        = express.Router();
const port                          = process.env.PORT || 3000
const website                       = process.env.WEBSITE || 'http://localhost'
const mongoose                      = require('mongoose');
const Grid                          = require("gridfs-stream");



let gfs, gridfsBucket;

const connection = mongoose.connection;
connection.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(connection.db, {
      bucketName: 'photos'
    })
    gfs = Grid(connection.db, mongoose.mongo);
    gfs.collection('photos');
});



router.post('/upload', upload.single('file'), async (req, res) => {
    if (req.file === undefined) return res.send('you must select a file.');

    const imgUrl = `${website}:${port}/api/file/${req.file.filename}`;

    return res.json(imgUrl);
});

router.get("/:filename", async (req, res) => {
    try {
        const cursor = gridfsBucket.find({filename: req.params.filename});
        cursor.forEach(image => {
            const readStream = gridfsBucket.openDownloadStream(image._id);
            readStream.pipe(res);
        });
    } catch (error) {
        res.send("not found");
    }
});

router.delete("/:filename", async (req, res) => {
    try {
        
        const cursor = gridfsBucket.find({filename: req.params.filename});
        cursor.forEach(image => {
            gridfsBucket.delete(image._id);
        });
        res.send("success");
    } catch (error) {
        console.log(error);
        res.send("An error occured.");
    }
});


module.exports = router;