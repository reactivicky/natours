class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    this.queryStr = JSON.stringify(this.queryStr);
    this.queryStr = JSON.parse(
      this.queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (e) => `$${e}`),
    );
    this.query = this.query.find(this.queryStr);
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt _id');
    }
    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }
    return this;
  }

  paginate() {
    const page = +this.queryStr.page || 1;
    const limit = +this.queryStr.limit || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = { APIFeatures };
