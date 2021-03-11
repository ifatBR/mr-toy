const toyService = require('./toy.service');

async function getToys(req, res) {
    try {
        let filterBy = req.query;
        if (!Object.keys(filterBy).length) filterBy = { name: '', inStock: 'all', types: [], sortBy: 'name', pageDiff: 0 };
        const toys = await toyService.query(filterBy);
        res.send(toys);
    } catch (err) {
        res.status(500).send({ err: 'Failed to get toys' });
    }
}

async function getToyById(req, res) {
    try {
        const {toyId} = req.params;
        const toy = await toyService.getById(toyId);
        res.send(toy);
    } catch (err) {
        res.status(401).send({ err: "Toy doesn't exist" });
    }
}

async function addToy(req, res) {
    try {
        const { name, price, type, createdAt, inStock} = req.body; //TODO: make sure frontend doesnt add _id
        const toy = { name, price, type, createdAt, inStock};
        const savedToy = await toyService.save(toy);
        res.send(savedToy);
    } catch (err) {
        res.status(401).send({ err: "Can't save toy" });
    }
}

async function updateToy(req, res) {
    try {
        const { name, price, type, createdAt, inStock, _id } = req.body;
        const toy = { name, price, type, createdAt, inStock, _id };
        const savedToy = await toyService.save(toy);
        res.send(savedToy);

    } catch (err) {
        res.status(401).send({err:'Toy doesn\'t exist'})
    }
}

async function removeToy(req,res){
    try{
    const toyId = req.params.toyId
    await toyService.remove(toyId)
    res.send('Deleted...')

    }catch(err){
            res.status(401).send({err:'Cannot remove toy'})
        }
}
module.exports = {
    getToys,
    getToyById,
    addToy,
    updateToy,
    removeToy
};
