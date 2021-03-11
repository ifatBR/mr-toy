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

        toys.sort((toy1, toy2) => {
            if (filterBy.sortBy === 'price') return toy1.price - toy2.price;
            return toy1.name.localeCompare(toy2.name);
        });

        const startIdx = _getStartIdx(filterBy.pageDiff, toys.length);
        toys = toys.slice(startIdx, startIdx + PAGE_SIZE);
        console.log('toys:', toys);
        return { toys, allToys };
    } catch (err) {
        throw err;
    }
}

async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toy');
        const toy = await collection.findOne({ "_id": ObjectId(toyId) });
        return toy;
    } catch (err) {
        throw err;
    }
}

async function save(toy) {
    const toyId = toy._id;
    try {
        const collection = await dbService.getCollection('toy');
        if (toyId) {
            delete toy._id
            console.log({...toy});
            await collection.updateOne({ "_id": ObjectId(toy._id)}, {$set:{...toy}})
        } else {
            await collection.insert(toy)
        }
        return toy;

    } catch (err) {
        throw err;
    }
}

async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toy');
        await collection.remove({ "_id": ObjectId(toyId) });
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
    const criteria = {};
    if (filterBy.name) {
        const txtCriteria = { $regex: filterBy.name, $options: 'i' };
        criteria.name = txtCriteria;
    }
    if (filterBy.inStock !== 'all') criteria.inStock = filterBy.inStock;
    if (filterBy.types && filterBy.types.length) criteria.$or = filterBy.types;
    return criteria;
    // return regex.test(toy.name)
    // && (filterBy.inStock === 'all' || toy.inStock === JSON.parse(filterBy.inStock))
    // && (!filterBy.types || !filterBy.types.length || filterBy.types.includes(toy.type.toLowerCase()))
}
module.exports = {
    query,
    getById,
    remove,
    save
};
