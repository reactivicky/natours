const Tour = require('../models/tourModel');

const getAllTours = async (req, res) => {
  try {
    let queryStr = JSON.stringify(req.query);

    // Filtering
    queryStr = JSON.parse(
      queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (e) => `$${e}`),
    );

    // Sorting
    if (queryStr.sort) {
      queryStr.sort = queryStr.sort.split(',').join(' ');
    } else {
      queryStr.sort = '-createdAt';
    }

    // Projecting of Field Limiting
    if (queryStr.fields) {
      queryStr.fields = queryStr.fields.split(',').join(' ');
    }

    const tours = await Tour.find(queryStr)
      .select(queryStr.fields)
      .sort(queryStr.sort);
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (e) {
    res.status(404).json({
      status: 'failed',
      message: 'Something went wrong',
    });
  }
};

const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (e) {
    res.status(404).json({
      status: 'failed',
      message: 'Something went wrong',
    });
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid Data sent',
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: 'Something went wrong',
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: 'Something went wrong',
    });
  }
};

module.exports = {
  deleteTour,
  updateTour,
  createTour,
  getTour,
  getAllTours,
};
