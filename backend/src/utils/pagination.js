/**
 * Pagination Utility
 * Provides cursor-based and offset-based pagination helpers
 */

/**
 * Calculate pagination metadata
 */
const getPaginationMetadata = (
  page = 1,
  limit = 10,
  total
) => {
  const skip = (page - 1) * limit;
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    page: parseInt(page),
    limit: parseInt(limit),
    skip,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
};

/**
 * Format paginated response
 */
const formatPaginatedResponse = (
  data,
  page,
  limit,
  total
) => {
  const pagination = getPaginationMetadata(page, limit, total);

  return {
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: pagination.totalPages,
      hasNextPage: pagination.hasNextPage,
      hasPrevPage: pagination.hasPrevPage,
    },
  };
};

/**
 * Validate pagination parameters
 */
const validatePaginationParams = (page, limit) => {
  const validPage = Math.max(1, parseInt(page) || 1);
  const validLimit = Math.min(100, Math.max(1, parseInt(limit) || 10)); // Max 100 per page

  return { page: validPage, limit: validLimit };
};

/**
 * Cursor-based pagination (more efficient for large datasets)
 */
const getCursorPaginationMetadata = (
  items,
  cursor = null,
  limit = 10
) => {
  let startIndex = 0;

  if (cursor) {
    startIndex = items.findIndex((item) => item._id.toString() === cursor);
    if (startIndex === -1) startIndex = 0;
    else startIndex += 1; // Start after the cursor
  }

  const paginatedItems = items.slice(startIndex, startIndex + limit);
  const hasMore = startIndex + limit < items.length;
  const nextCursor = hasMore ? paginatedItems[paginatedItems.length - 1]?._id : null;

  return {
    data: paginatedItems,
    pagination: {
      cursor: nextCursor,
      hasMore,
      count: paginatedItems.length,
    },
  };
};

module.exports = {
  getPaginationMetadata,
  formatPaginatedResponse,
  validatePaginationParams,
  getCursorPaginationMetadata,
};
