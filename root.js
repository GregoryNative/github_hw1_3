(function() {
    const API_KEY = '78e944efc39282cef8d86b760fd4cdcf'; // API key from Slack chat
    const search = document.getElementById('search');
    const table = document.getElementById('table');
    const tableHead = document.getElementById('head');
    const tableBody = document.getElementById('body');
    const KEYS = ['index', 'id', 'title', 'original_language', 'popularity', 'vote_count', 'vote_average', 'release_date', 'adult'];

    let movies = [];
    let sortIndex = null;
    let lastArrowIs = null;
    let isSortReverse = false;
    const arrowUp = '↑', arrowDown = '↓';

    search.addEventListener('keyup', e => {
      if (e.target.value !== '') { findMovies(e.target.value, table); }
    });

    tableHead.addEventListener('click', e => {
      if (e.target.cellIndex === 0 || movies.length === 0) { return; }
      sort(e.target.cellIndex)
    });

    function findMovies(query) {
      fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${query}`)
        .then(response => response.json())
        .then(resp => renderMovies(resp.results, KEYS))
        .catch(alert)
    }

    function renderMovies(data, keys) {
      movies = data;
      const newTable = data.reduce((tableBody, item, index) => {
        const tr = document.createElement('tr');

        for(key of keys) {
          const td = document.createElement('td');
          td.textContent = (key === 'index') ? index : item[key];
          tr.appendChild(td);
        }
        tableBody.appendChild(tr);

        return tableBody;
      }, document.createElement('tbody'));
      table.removeChild(table.querySelector('tbody'));
      table.appendChild(newTable);
    }

    function sort(index) {
      renderArrow(sortIndex, index);
      if (sortIndex !== index) {
        sortIndex = index;
        sortMoviesByKey(KEYS[index]);
      } else {
        sortMoviesByKey(KEYS[index], isSortReverse);
      }
    }

    function sortMoviesByKey(key, reverse = false) {
      movies.sort((a, b) => {
        if (a[key] > b[key]) {
          return reverse ? -1 : 1;
        }
        if (a[key] < b[key]) {
          return reverse ? 1 : -1;
        }
        return 0;
      });
      isSortReverse = !reverse;
      renderMovies(movies, KEYS);
    }

    function renderArrow(lastIndex, currentIndex) {
      const arrow = document.createElement('span');
      if (lastIndex === currentIndex) {
          const lastArrow = tableHead.firstElementChild.children[lastIndex].querySelector('span');
          lastArrowIs = (lastArrowIs === arrowUp) ? arrowDown : arrowUp;
          lastArrow.textContent = lastArrowIs;
      } else if (lastArrowIs === null) {
          lastArrowIs = arrowUp;
          arrow.textContent = lastArrowIs;
          tableHead.firstElementChild.children[currentIndex].appendChild(arrow);
      } else {
          lastArrowIs = arrowUp;
          tableHead.firstElementChild.children[lastIndex].removeChild(tableHead.firstElementChild.children[lastIndex].querySelector('span'));
          arrow.textContent = lastArrowIs;
          tableHead.firstElementChild.children[currentIndex].appendChild(arrow);
      }
    }
})()
