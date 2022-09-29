const TABLE_CONTAINER = '.main__content';
const DROPDOWN_MENU = '#currency';

const main = () => {
  // const currency = ['USD', 'EUR', 'AUD', 'CAD', 'CHF', 'NZD', 'BGN'];
  const currency = ['USD', 'EUR', 'AUD', 'CAD', 'CHF', 'NZD', 'BGN'].map(e => e.toLowerCase());
  populateDropDown(currency, '#currency');
  let result
  if(localStorage.time === new Date().toLocaleDateString()){
    result = JSON.parse(localStorage.getItem('data')) || {};
  }else{
    localStorage.removeItem('time')
    localStorage.removeItem('data')
    result = {}
  }
  
  const tableContainer = document.querySelector(TABLE_CONTAINER);
  tableContainer.innerHTML = '';
  
  document.querySelector(DROPDOWN_MENU).addEventListener('change', () => populateData(result));
  
  if(Object.keys(result).length === 0) {
    currency.forEach(cur1 => {
      currency.forEach(cur2 => {
        if (cur1 === cur2) return;
      
        fetchData(cur1, cur2).then(exchange => {
          if (!([cur1] in result)) {
            result[cur1] = {};
          }
          result[cur1][cur2] = exchange[cur2];
        
        }).then(() => {
        
          populateData(result);
          localStorage.setItem('data', JSON.stringify(result))
          localStorage.setItem('time', new Date().toLocaleDateString())
        });
      
      });
    });
  }else{
    populateData(result);
  }
  
};

// should find better name
const populateData = (result) => {
  const dropDown = document.querySelector(DROPDOWN_MENU);
  const tempValue = dropDown.options[dropDown.selectedIndex].value;
  populateColumns('.main__content', Object.values(result[tempValue]));
};
const populateDropDown = (arr, target) => {
  const element = document.querySelector(target);
  arr.forEach((currency) => {
    const option = document.createElement('option');
    option.value = currency;
    option.innerText = currency;
    element.appendChild(option);
  });
};
const fetchData = async (arg1, arg2) => {
  const response = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${arg1.toLowerCase()}/${arg2.toLowerCase()}.json`);
  const currency = await response.json();
  return (currency);
};

const populateColumns = (target, data) => {
  const container = document.querySelector(target);
  const column1 = data.filter(e => e < 1);
  const column2 = data.filter(e => (e >= 1 && e < 1.5));
  const column3 = data.filter(e => e >= 1.5);
  container.innerHTML = `
    <div class="vertical-align">
    <div class="table--row">
      ${createColumn(column1, '< 1')}
      ${createColumn(column2, '>1 && <1.5')}
      ${createColumn(column3, '>1.5')}
    </div>
    <div class="table--row">
      <div><h3>Count:${column1.length}</h3></div>
      <div><h3>Count:${column2.length}</h3></div>
      <div><h3>Count:${column3.length}</h3></div>
</div>
    <div>
    <p>Longest array meeting following conditions:</p>
      <ul>
        <li>for elements of the array should be considered only exchange rates for the currently selected currency (for example if USD is selected: USD-EUR, EUR-USD, USD-BGN, BGN-USD, etc.)</li>
        <li>the absolute difference between any two elements of the array is <= 0.5</li>
       </ul>
       <p style="color:black;font-weight: bold"> has size of: ${longestArray(data)}</p>
    </div>
    </div>
    
    `;
};

const createColumn = (arr, label) => {
  let template = `<div class="table--column"><h2>${label}</h2>`;
  template += arr.map(element => `<div>${element}</div>`).join('');
  template += '</div>';
  return template;
};

const longestArray = (arr) => {
  const result = new Set;
  for (let i = 0; i < arr.length; i++) {
    for (let k = 0; k < arr.length; k++) {
      if (i === k) continue;
      if (arr[i] + 0.5 < arr[k]) {
        result.add(arr[i]);
      }
    }
  }
  return result.size;
};


main();