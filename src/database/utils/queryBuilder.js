/**
 * Builds a WHERE clause from a conditions object.
 * Supports basic equality for now.
 * Can be extended for IN, LIKE, >, <, etc.
 *
 * @param {Object} conditions - e.g., { categoryId: 1, deletedAt: null }
 * @returns {Object} { sql: string, args: any[] }
 */
export function buildWhere(conditions) {
  if (!conditions || Object.keys(conditions).length === 0) {
    return { sql: '', args: [] };
  }

  const clauses = [];
  const args = [];

  for (const [key, value] of Object.entries(conditions)) {
    if (value === null) {
      clauses.push(`${key} IS NULL`);
    } else {
      clauses.push(`${key} = ?`);
      args.push(value);
    }
  }

  return {
    sql: `WHERE ${clauses.join(' AND ')}`,
    args,
  };
}

/**
 * Builds ORDER BY clause.
 *
 * @param {Object|String} orderBy - e.g., 'createdAt DESC' or { createdAt: 'DESC', name: 'ASC' }
 * @returns {string}
 */
export function buildOrderBy(orderBy) {
  if (!orderBy) return '';

  if (typeof orderBy === 'string') {
    return `ORDER BY ${orderBy}`;
  }

  if (typeof orderBy === 'object') {
    const clauses = Object.entries(orderBy).map(([key, direction]) => {
      const dir = direction.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      return `${key} ${dir}`;
    });
    if (clauses.length > 0) {
      return `ORDER BY ${clauses.join(', ')}`;
    }
  }

  return '';
}

/**
 * Builds a full SQL SELECT statement.
 *
 * @param {Object} options
 * @param {string} options.table
 * @param {string[]} [options.columns]
 * @param {Object} [options.where]
 * @param {Object|string} [options.orderBy]
 * @param {number} [options.limit]
 * @param {number} [options.offset]
 * @returns {Object} { sql, args }
 */
export function buildSelect({ table, columns = ['*'], where, orderBy, limit, offset }) {
  const cols = columns.join(', ');
  let sql = `SELECT ${cols} FROM ${table}`;
  const totalArgs = [];

  const whereClause = buildWhere(where);
  if (whereClause.sql) {
    sql += ` ${whereClause.sql}`;
    totalArgs.push(...whereClause.args);
  }

  const orderClause = buildOrderBy(orderBy);
  if (orderClause) {
    sql += ` ${orderClause}`;
  }

  if (limit !== undefined) {
    sql += ` LIMIT ?`;
    totalArgs.push(limit);

    if (offset !== undefined) {
      sql += ` OFFSET ?`;
      totalArgs.push(offset);
    }
  }

  return { sql, args: totalArgs };
}

/**
 * Builds an INSERT SQL statement.
 *
 * @param {string} table
 * @param {Object} data
 * @returns {Object} { sql, args }
 */
export function buildInsert(table, data) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(() => '?').join(', ');

  const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;

  return { sql, args: values };
}

/**
 * Builds an UPDATE SQL statement.
 *
 * @param {string} table
 * @param {Object} data
 * @param {Object} where
 * @returns {Object} { sql, args }
 */
export function buildUpdate(table, data, where) {
  const keys = Object.keys(data);
  const values = Object.values(data);

  const setClauses = keys.map(key => `${key} = ?`).join(', ');
  let sql = `UPDATE ${table} SET ${setClauses}`;

  const whereClause = buildWhere(where);
  if (whereClause.sql) {
    sql += ` ${whereClause.sql}`;
    values.push(...whereClause.args);
  }

  return { sql, args: values };
}

/**
 * Builds a DELETE SQL statement.
 *
 * @param {string} table
 * @param {Object} where
 * @returns {Object} { sql, args }
 */
export function buildDelete(table, where) {
  let sql = `DELETE FROM ${table}`;

  const whereClause = buildWhere(where);
  const args = [];

  if (whereClause.sql) {
    sql += ` ${whereClause.sql}`;
    args.push(...whereClause.args);
  }

  return { sql, args };
}
