const dbService = require('../../services/db.service');
const ObjectId = require('mongodb').ObjectId;

const PAGE_SIZE = 3;
let pageIdx = 0;

async function query(filterBy) {
    const criteria = _buildCriteria(filterBy);
    try {
        const collection = await dbService.getCollection('toy');
        var allToys = await collection.find().toArray();
        var toys = await collection.find(criteria).toArray();
        // console.log('toys:', toys);
        toys.sort((toy1, toy2) => {
            if (filterBy.sortBy === 'price') return toy1.price - toy2.price;
            return toy1.name.localeCompare(toy2.name);
        });

        const startIdx = _getStartIdx(filterBy.pageDiff, toys.length);
        toys = toys.slice(startIdx, startIdx + PAGE_SIZE);
        return { toys, allToys };
    } catch (err) {
        throw err;
    }
}

async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toy');
        const toy = await collection.findOne({ _id: ObjectId(toyId) });
        return toy;
    } catch (err) {
        throw err;
    }
}

async function save(toy) {
    try {
        let savedToy = null;
        const collection = await dbService.getCollection('toy');
        if (toy._id) {
            const toyToUpdate = { ...toy };
            delete toyToUpdate._id;
            await collection.updateOne({ _id: ObjectId(toy._id) }, { $set: { ...toyToUpdate } });
            return toy;
        } else {
            savedToy = await collection.insert(toy);
            return savedToy.ops[0];
        }
    } catch (err) {
        throw err;
    }
}

async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toy');
        await collection.remove({ _id: ObjectId(toyId) });
    } catch (err) {
        throw err;
    }
}

function _getStartIdx(diff, amount) {
    pageIdx += +diff;
    const maxPageIdx = amount % PAGE_SIZE === 0 ? amount / PAGE_SIZE - 1 : amount / PAGE_SIZE;
    const pageCount = parseInt(maxPageIdx) + 1;
    pageIdx = (pageIdx + pageCount) % pageCount;
    return pageIdx * PAGE_SIZE;
}

function _buildCriteria(filterBy) {
    let typesCriteria;
    if (filterBy.types && filterBy.types.length) {
        filterBy.types = filterBy.types.split(',');
        typesCriteria = filterBy.types.map((type) => {
            return { type: type };
        });
    }
    const criteria = {};
    if (filterBy.name) {
        const txtCriteria = { $regex: filterBy.name, $options: 'i' };
        criteria.name = txtCriteria;
    }
    if (filterBy.inStock !== 'all') criteria.inStock = JSON.parse(filterBy.inStock);
    if (filterBy.types && filterBy.types.length) criteria.$or = typesCriteria;
    return criteria;
}
module.exports = {
    query,
    getById,
    remove,
    save,
};
