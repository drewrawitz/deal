export function paginateResponse(
  data: any,
  total: number,
  page: number,
  limit: number
) {
  const lastPage = Math.ceil(total / limit);
  const nextPage = page + 1 > lastPage ? null : page + 1;
  const prevPage = page - 1 < 1 ? null : page - 1;

  return {
    data,
    count: total,
    current_page: page,
    next_page: nextPage,
    prev_page: prevPage,
    last_page: lastPage,
  };
}

export function getPercentage(single: number, total: number) {
  return (single / total) * 100;
}
