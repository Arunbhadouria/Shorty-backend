import Collection from "../models/Collection.js";
export const createCollection = async (req, res) => {
  const { name } = req.body;

  const collection = await Collection.create({
    name,
    user: req.user._id,
  });

  res.status(201).json({
    status: "success",
    data: collection,
  });
};

export const getCollections = async (req, res) => {
  const collections = await Collection.find({
    user: req.user._id,
  }).sort({ createdAt: -1 });

  res.json({
    status: "success",
    results: collections.length,
    data: collections,
  });
};
