export class ApiFeature {
  constructor(mongooseQuery, queryData) {
    this.mongooseQuery = mongooseQuery;
    this.queryData = queryData;
  }
  pagenation = (model) => {
    let page = this.queryData.page;
    let size = this.queryData.size;
    if (page <= 0 || !page) page = 1;
    if (size <= 0 || !size) size = 5;
    const skip = size * (page - 1);

    model.countDocuments().then((length) => {//length is the number of documents
      this.queryData.totalPages = Math.ceil(length / size);

      if (this.queryData.totalPages > page) {
        this.queryData.next = Number(page) + 1;
      }
      if (page > 1) {
        this.queryData.previous =Number(page) + 1;
      }

      this.queryData.count = length;
    });
    this.mongooseQuery.skip(skip).limit(size);
    return this;
  };

  filter = () => {
    const execluded = ["sort", "page", "size", "fields", "searchKey"];
    let queryFildes = { ...this.queryData };

    execluded.forEach((ele) => {
      delete queryFildes[ele];
    });
    queryFildes = JSON.stringify(queryFildes).replace(
      /lte|lt|gte|gt/g,
      (match) => {
        return `$${match}`;
      }
    );
    queryFildes = JSON.parse(queryFildes);
    this.mongooseQuery.find(queryFildes);
    return this;
  };

  sort = () => {
    if (this.queryData.sort) {
      this.mongooseQuery.sort(this.queryData.sort.replace(/,/g, " "));
    }
    return this;
  };

  search = () => {
    if (this.queryData.searchKey) {
      this.mongooseQuery.find({
        $or: [
          { name: { $regex: this.queryData.searchKey } },
          { description: { $regex: this.queryData.searchKey } },
        ],
      });
    }
    return this;
  };

  select = () => {
    this.mongooseQuery.select(this.queryData.fields?.replace(/,/g, " "));
    return this;
  };
}


