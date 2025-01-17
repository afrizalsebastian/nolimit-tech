import { BadRequestError } from '@middlewares/errorHandler.middleware';

export interface PostQuery {
  rows: number;
  page: number;
  where?: any;
  orderBy?: any;
}

const validSortKey = ['id', 'createdAt'];
const validSearchKey = ['content'];
const validRangedKey = ['createdAt'];

export function ExtractPostQuery(query: any) {
  const defaultQuery: PostQuery = {
    rows: 5,
    page: 1,
    where: { AND: [] },
    orderBy: {},
  };

  for (const key in query) {
    if (query[key]) {
      if (key === 'page') {
        const page = query.page ? parseInt(query.page) : 1;
        if (isNaN(page)) throw new BadRequestError('Query Page Parse Invalid');
        defaultQuery.page = page;
      } else if (key === 'rows') {
        const rows = query.rows ? parseInt(query.rows) : 1;
        if (isNaN(rows)) throw new BadRequestError('Query Rows Parse Invalid');
        defaultQuery.rows = rows;
      } else if (key === 'sort') {
        buildSortKey(defaultQuery.orderBy, query[key]);
      } else if (key.includes('lt') || key.includes('gt')) {
        buildRangedKey(defaultQuery.where, key, query[key]);
      } else if (key.includes('search')) {
        buildSearchKey(defaultQuery.where, key, query[key]);
      }
    }
  }

  return defaultQuery;
}

function buildSortKey(orderBy: any, sortKey: string) {
  if (
    !validSortKey.includes(
      sortKey[0] === '-' ? sortKey.substring(1, sortKey.length) : sortKey,
    )
  ) {
    throw new BadRequestError(
      `Invalid key for sort. Available sort key ${validSortKey.join(', ')}`,
    );
  }

  if (sortKey[0] === '-') {
    orderBy[`${sortKey.substring(1, sortKey.length)}`] = 'desc';
  } else {
    orderBy[`${sortKey}`] = 'asc';
  }
}

function isANDHaveTheKey(AND: any[], key: string) {
  for (let i = 0; i < AND.length; i++) {
    if (AND[i][key]) return i;
  }
  return -1;
}

function isValidDate(stringDate: string) {
  return !isNaN(Date.parse(stringDate));
}

function buildSearchKey(where: any, key: string, queryValue: string) {
  const searchKey = key.split('.')[1];

  if (!validSearchKey.includes(searchKey))
    throw new BadRequestError(
      `Invalid key for search. Available search key ${validSearchKey.join(', ')}`,
    );
  const keyIndex = isANDHaveTheKey(where.AND, searchKey);
  if (keyIndex !== -1) {
    where.AND[keyIndex][searchKey] = { contains: queryValue };
  } else {
    where.AND.push({
      [`${searchKey}`]: { contains: queryValue },
    });
  }
}

function buildRangedKey(where: any, key: string, queryValue: string) {
  const [rangedKey, comparison] = key.split('.');

  if (!validRangedKey.includes(rangedKey))
    throw new BadRequestError(
      `Invalid key for ranged. Available ranged key ${validRangedKey.join(', ')}`,
    );

  const keyIndex = isANDHaveTheKey(where.AND, rangedKey);
  if (isValidDate(queryValue)) {
    if (keyIndex !== -1) {
      where.AND[keyIndex][rangedKey][comparison] = new Date(queryValue);
    } else {
      where.AND.push({
        [`${rangedKey}`]: {
          [`${comparison}`]: new Date(queryValue),
        },
      });
    }
  }
}
