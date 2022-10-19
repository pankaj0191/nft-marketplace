const { ObjectId } = require('mongodb');
const collections = require('../database/collections.json')
const eth_transactions = require('../database/eth_transactions.json')

const CollectionSeeder = async (database) => {
    try {
        const collection = database.collection('collections');
        var category = await database.collection('categories').find({
            slug: "others"
        }).limit(1).toArray();
        var genre = await database.collection('genries').find({
            slug: "others"
        }).limit(1).toArray();
        category = category.shift()._id || "";
        genre = genre.shift()._id || "";

        if(category && genre) {
            const collectionsData = collections.map((collection) => {
                return {
                    ...collection,
                    category,
                    genre,
                    createdBy: new ObjectId(collection.createdBy),
                    updatedBy: new ObjectId(collection.updatedBy),
                    createdAt: new Date(),
                    updateAt: new Date()
                }
            })
            const result = await truncateCollection(collection, collectionsData);  
            if(Object.keys(result.insertedIds).length) {
                const ethTransaction = database.collection('eth_transactions');
                const ethTransactionsData = eth_transactions.map((eth_transaction, key) => {
                    const moduleId = Object.values(result.insertedIds)[key];
                    return {
                        ...eth_transaction,
                        moduleId,
                        createdAt: new Date(),
                        updateAt: new Date()
                    }
                })
                await truncateCollection(ethTransaction, ethTransactionsData);             
            }
        }
    } catch (e) {
        console.log(e);
    }
}

const truncateCollection = async (collection, insertedData) => {
    if(insertedData.length) {
        await collection.deleteMany({});
        return await collection.insertMany(insertedData); 
    }
    return false;
}

module.exports = CollectionSeeder;