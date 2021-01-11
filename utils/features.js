module.exports = class {
  constructor(query, queryStr) {
    this.queryStr = queryStr
    this.query = query
  }

  filtering() {
    const queryObj = { ...this.queryStr }

    const filteredObj = ['sort', 'page', 'limit', 'fields']

    filteredObj.forEach(f => delete queryObj[f])

    let queryString = JSON.stringify(queryObj)

    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    )

    this.query = this.query.find(JSON.parse(queryString))

    return this
  }

  sorting() {
    if (this.queryStr.sort) {
      const sortStr = this.queryStr.sort.split(',').join(' ')
      this.query = this.query.sort(sortStr)
    } else {
      this.query = this.query.sort('-createdAt')
    }

    return this
  }

  fieldsLimiting() {
    if (this.queryStr.fields) {
      const fieldsStr = this.queryStr.fields.split(',').join(' ')
      this.query = this.query.select(fieldsStr)
    } else {
      this.query = this.query.select('-__v')
    }

    return this
  }

  pagination() {
    const limit = +this.queryStr.limit || 10

    const page = +this.queryStr.page || 1

    const skip = (page - 1) * limit

    this.query = this.query.skip(skip).limit(limit)

    return this
  }
}
