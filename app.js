//Structure code with modules

//UI module
// Get input values
// Add the new item to the UI
// Update the UI

//Data Module
// Add the new item to our data structre
// calculate budget

//Controller Module
// Add event handler


// BUDGET CONTROLLER
var budgetController = (function() {

	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
        this.percentage = -1; // when something is not defined we -1
	}

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};


	var allExpenses = [];
	var allIncomes = [];

	var calculateTotal = function(type) {
		// set initial value
		var sum = 0;
		data.allItems[type].forEach(function(cur) {
			sum += cur.value;
		});
		data.totals[type] = sum;
		/*
		[200, 400, 100]
		sum = 0 + 200
		sum = 200 + 400
		summ = 600 + 100 = 700
		*/
	};

	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0 
		},
		budget: 0,
		percentage: -1
	};

	//changes

	return {
		addItem: function(type, des, val) {
			var newItem;

			ID = 0; //id is unique number to assign to each item

			// ID = last ID + 1

			// Create new ID
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}

			// Create new item based on 'inc' or 'exp' type
			if (type === 'exp') {
				newItem = new Expense(ID, des, val);
			} else if (type === 'inc') {
				newItem = new Income(ID, des, val);
			}

			// Push it into our data structure
			data.allItems[type].push(newItem); //push adds new element to array

			// Return the new element
			return newItem;

		},

		deleteItem: function(type, id) {
			var ids, index;
			// id = 6
			//data.allItems[type][id];
			//ids = [1 2 4 6 8]
			//index = 3

			//loop over all elements
			//map returns brand new array
			ids = data.allItems[type].map(function(current) {
				return current.id;
			});

			//index equals the id of the id we passed into the map method
			index = ids.indexOf(id);

			//only remove something if the index actually exists
			//use splice to delete element
			 // first argument is the position number at which we want to start deleting. Second argument is the number of elements we want to

			if (index !== -1) {
				data.allItems[type].splice(index, 1);
			}


		},

		calculateBudget: function() {

			// calculate total income and total expenses
			// call calculate total function

			calculateTotal('exp');
			calculateTotal('inc');

			// calculate the budget: income - expenses

			data.budget = data.totals.inc - data.totals.exp;

			// calculate the percentage of income that we spent
			// if totals.inc is greater than 0

			if(data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1; // 
			}

			// Expense = 100 and income 300, spent 33.3333% = 100/300 = 0.3333 * 100
			// use Math.round to round
		},


        calculatePercentages: function() {

            /*
            a=20
            b=10
            c=40
            a=20/100=20%
            b=10/100=10%
            c=40/100=40%
            */

            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage(); // get each element, return and store it
            });

            return allPerc;
        },

		getBudget: function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			};
		},

		testing: function() {
			console.log(data);
		}
	};

})();




// UI CONTROLLER
var UIController = (function() {

	var DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
	};

    var formatNumber = function(num, type) {
        var numSplit, int, dec, type;    
            /*
            + or - before number
            exactly 2 decimal points
            comma separating the thousands

            2310.4567 -> + 2,310.46
            2000 -> 2,000.00
            */

            //abs removes sign of number
            
            num = Math.abs(num);
            num = num.toFixed(2);

            //split number at decimal point
            numSplit = num.split('.');

            int = numSplit[0];
            // number is higher thand 1000
            if (int.length > 3) {
                //first argument is index # for start and second is how many characters we want
                int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
            }

            dec = numSplit[1];

            //if type is expenses then sign should be - else if income then plus sign
            return (type === 'exp'  ? '-' : '+') + ' ' + int + '.' + dec;

        };

         var nodeListForEach = function(list, callback) {
                //loop over our list and each our callback function gets called
                // pass current and index - list(position i and the index is i)
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };

	return {
		getInput: function() {
			return {
			type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
			description: document.querySelector(DOMstrings.inputDescription).value,
			//use parseFloat to convert string to integer
			value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			}
		},

		addListItem: function(obj, type) {
			var html;
			// Create HTML String with placeholder text
			if (type === 'inc') {
				element = DOMstrings.incomeContainer;

				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'exp') {
				element = DOMstrings.expensesContainer;

				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}

			//Replace the placeholder text with some actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

			//Insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},

		deleteListItem: function(selectorID) {

			var el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);

		},

		clearFields: function() {
			var fields, fieldsArr;

			// Like CSS selecting. Separate different selectors with comma and then join together
			fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

			// Call slice method using call method
			fieldsArr = Array.prototype.slice.call(fields);

			// can recieve three args. access to current value, index, and entire array

			fieldsArr.forEach(function(current, index, array) {
				// clear all fields
				current.value = "";
			});

			// return focus back to description field
			fieldsArr[0].focus();
		},

		displayBudget: function(obj) {
            var type;
            // If  budget is greater than zero then type is going to be inc else exp
            obj.budget > 0 ? type = 'inc' : type = 'exp';

			document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
			document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
			document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
			document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;

			if(obj.percentage > 0) {
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
			} else  { 
				document.querySelector(DOMstrings.percentageLabel).textContent = '---';
			}
		},

        displayPercentages: function(percentages) {

            // each element is called a node, use ALL because you have to change for all nodes
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            // when we Node list for each function
            nodeListForEach(fields, function(current, index) {
                //if zero
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }

            });

        },

        displayMonth: function() {
            var now, year, month;

            now = new Date();
            // ex. -> var christmas = new Date(2016, 12, 25);

            months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();

            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        changedType: function() {
            var fields

            fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);

            nodeListForEach(fields, function(cur) {
                //toggle adds class when type changes else removes class
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },


		getDOMstrings: function() {
			return DOMstrings;
		}
	};

})();





// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

	var setupEventListeners = function() {
		var DOM = UICtrl.getDOMstrings();

		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function(event) {
			if (event.KeyCode === 13 || event.which === 13) {
			 		ctrlAddItem();
			 }
		});

		// set event listener for parent container that contains all elements for exp and inc.
		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
	};



	var updateBudget = function() {

		// 1. Calculate budget
		budgetCtrl.calculateBudget();

		// 2. Return the budget
		var budget = budgetCtrl.getBudget();

		// 3. Display the budget on the UI
		UICtrl.displayBudget(budget);

	};

    var updatePercentages = function() {

         // 1. Calculate percentages

         budgetCtrl.calculatePercentages();


         // 2. Read percentages from the budget controller
         var percentages = budgetCtrl.getPercentages();

         // 3. Update the UI with the new percentages
         UICtrl.displayPercentages(percentages);
    }

	var ctrlAddItem = function() {
		var input, newItem;

		// 1. Get the field input data
		input = UICtrl.getInput();

		// Make sure fields are populated
		// input should not be empty the number should actually be a number(non NaN)
		if (input.description !== ""  && !isNaN(input.value)  && input.value > 0) {

			// 2. Add the item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			// 3. Add the new item to the user interface
			UICtrl.addListItem(newItem, input.type);

			// 4. Clear the fields using clear fields function
			UICtrl.clearFields();

			// 5. Calculate  and update the budget
			updateBudget();

            // 6. Calculate and update the percentages

            updatePercentages();
		}

	};

var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;

        console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemID) {
            
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            // 1. delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
            
            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);
            
            // 3. Update and show the new budget
            updateBudget();
            
            // 4. Calculate and update percentages
            updatePercentages();
        }
    };

	return {
		init: function() {
			console.log('Application has started');
			// set everything to zero on load
            UICtrl.displayMonth();
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
			setupEventListeners();
		}
	};


})(budgetController, UIController);
	
controller.init();




