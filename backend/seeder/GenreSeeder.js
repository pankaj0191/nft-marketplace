const genries = require('../database/genries.json')

const GenreSeeder = async (database) => {
    try {
        const collection = database.collection('genries');
        const genriesData = genries.map((genre) => {
            return {
                ...genre,
                createdAt: new Date(),
                updateAt: new Date()
            }
        })
        await truncateCollection(collection, genriesData);  
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

module.exports = GenreSeeder;