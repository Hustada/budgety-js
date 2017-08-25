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
	}

	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};


	var allExpenses = [];
	var allIncomes = [];

	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0 
		}
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
		expensesContainer: '.expenses__list'
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

				html = '<div class="item clearfix" id="income-%id&"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'exp') {
				element = DOMstrings.expensesContainer;

				html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}

			//Replace the placeholder text with some actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);

			//Insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
	};

	var updateBudget = function() {

		// 1. Calculate budget


		// 2. Return the budget

		// 3. Display the budget on the UI

	};

	var ctrlAddItem = function() {
		var input, newItem;

		// 1. Get the field input data
		input = UICtrl.getInput();

		// 2. Add the item to the budget controller
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);

		// 3. Add the new item to the user interface
		UICtrl.addListItem(newItem, input.type);

		// 4. Clear the fields using clear fields function
		UICtrl.clearFields();

		// 4. Calculate the budget
		updateBudget();

		// 5. Display the budget on the UI
	};

	return {
		init: function() {
			setupEventListeners();
		}
	};


})(budgetController, UIController);
	console.log('Application has Started')
controller.init();




