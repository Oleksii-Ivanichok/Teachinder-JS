export function paginationStatistic(tableUsers){
  let state = {
    'querySet': tableUsers,
    'page': 1,
    'rows': 10,
  }
  let data = pagination(state.querySet, state.page, state.rows)
  console.log('data:', data);

  let myList = data.querySet
  function pagination(querySet, page, rows){
    let trimStart = (page - 1) * rows;
    let trimEnd = trimStart + rows;

    let trimmedData = querySet.slice(trimStart, trimEnd);

    let pages = Math.ceil(querySet.length / rows);

    return {
      'querySet': trimmedData,
      'pages': pages
    }
    function pageButtons(){
      let tableContent = document.getElementById()
    }

  }
}

