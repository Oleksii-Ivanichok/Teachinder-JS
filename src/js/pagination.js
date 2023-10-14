import {renderStatistics} from "./domOperation";

export function paginationStatistic(tableUsers) {
  let state = {
    'querySet': tableUsers,
    'page': 1,
    'rows': 10,
  }
  let data = pagination(state.querySet, state.page, state.rows)
  console.log('data:', data);
  pageButtons();

  let elementsToRender = data.querySet;

  function pagination(querySet, page, rows) {
    let trimStart = (page - 1) * rows;
    let trimEnd = trimStart + rows;

    let trimmedData = querySet.slice(trimStart, trimEnd);

    let pages = Math.ceil(querySet.length / rows);

    return {
      'querySet': trimmedData,
      'pages': pages
    }
  }

  function pageButtons(pages) {

    // let statisticContainer = document.getElementById('statisticContainer');
    let paginationContainer = document.getElementById('paginationContainer');
    paginationContainer.innerHTML = '';

    for (let page = 1; page <= pages; page++) {
      const paginationElement = document.createElement("li");
      paginationElement.innerText = `${page}`;
      console.log(state.page);
      console.log(page);

      if (page === state.page) {
        paginationElement.classList.add("current__page");
      }
      if (page === pages) {
        paginationElement.innerText = `Last`;
      }
      paginationElement.addEventListener('click', () => {
        state.page = page;
        renderStatistics(elementsToRender);
        console.log(state.page);
      })

      paginationContainer.appendChild(paginationElement)
    }

  }

}

