// Storage Controller
const StorageCtrl = (function() {
	// Public methods
	return {
		storeItem: function(item) {
			let items;
			// Check if any items in localStorage
			if (localStorage.getItem('items') === null) {
				items = [];
				// Push new item
				items.push(item);
				// Set localStorage
				localStorage.setItem('items', JSON.stringify(items));
			} else {
				items = JSON.parse(localStorage.getItem('items'));

				// Push new item
				items.push(item);

				// Update localStorage
				localStorage.setItem('items', JSON.stringify(items));
			}
		},
		getItemsFromStorage: function() {
			let items;
			if (localStorage.getItem('items') === null) {
				items = [];
			} else {
				items = JSON.parse(localStorage.getItem('items'));
			}
			return items;
		},
		updateItemStorage: function(updatedItem) {
			let items = JSON.parse(localStorage.getItem('items'));

			items.forEach(function(item, index) {
				if (updatedItem.id === item.id) {
					items.splice(index, 1, updatedItem);
				}
			});
			localStorage.setItem('items', JSON.stringify(items));
		},
		deleteItemFromStorage: function(id) {
			let items = JSON.parse(localStorage.getItem('items'));

			items.forEach(function(item, index) {
				if (id === item.id) {
					items.splice(index, 1);
				}
			});
			localStorage.setItem('items', JSON.stringify(items));
		},
		clearItemsFromStorage: function() {
			localStorage.removeItem('items');
		},
	};
})();

// Item Controller
const ItemCtrl = (function() {
	// Item constructor
	const Item = function(id, name, calories) {
		this.id = id;
		this.name = name;
		this.calories = calories;
	};

	// Data Structure / State
	const data = {
		// items: [
		// 	// { id: 0, name: 'Steak Dinner', calories: 1200 },
		// 	// { id: 1, name: 'Cookie', calories: 300 },
		// 	// { id: 2, name: 'Eggs', calories: 400 },
		// ],
		items: StorageCtrl.getItemsFromStorage(),
		currentItem: null,
		totalCalories: 0,
	};

	// Public methods
	return {
		logData: function() {
			return data;
		},
		getItems: function() {
			return data.items;
		},
		getTotalCalories: function() {
			let total = 0;

			// Loop through items and add cals
			data.items.forEach(function(item) {
				total += item.calories;
			});

			// Set total calories in data structure
			data.totalCalories = total;

			// Return total
			return data.totalCalories;
		},
		addItem: function(name, calories) {
			// Create ID
			let ID;
			if (data.items.length > 0) {
				ID = data.items[data.items.length - 1].id + 1;
			} else {
				ID = 0;
			}

			// Calories to number
			calories = parseInt(calories);

			// Create new item
			newItem = new Item(ID, name, calories);

			data.items.push(newItem);

			return newItem;
		},
		getItemById: function(id) {
			let found = null;
			// Loop through items
			data.items.forEach(function(item) {
				if (item.id === id) {
					found = item;
				}
			});

			return found;
		},
		updateItem: function(name, calories) {
			// Calories to num
			calories = parseInt(calories);

			let found = null;
			data.items.forEach(function(item) {
				if (item.id === data.currentItem.id) {
					item.name = name;
					item.calories = calories;
					found = item;
				}
			});
			return found;
		},
		deleteItem: function(id) {
			// Get ids
			const ids = data.items.map(function(item) {
				return item.id;
			});

			// Get index
			const index = ids.indexOf(id);

			// Remove item
			data.items.splice(index, 1);
		},
		setCurrentItem: function(item) {
			data.currentItem = item;
		},
		getCurrentItem: function() {
			return data.currentItem;
		},
		clearAllItems: function() {
			data.items = [];
		},
	};
})();

// UI Controller
const UICtrl = (function() {
	const UISelectors = {
		listItems: '#item-list li',
		itemList: '#item-list',
		addBtn: '.add-btn',
		updateBtn: '.update-btn',
		deleteBtn: '.delete-btn',
		backBtn: '.back-btn',
		clearBtn: '.clear-btn',
		itemNameInput: '#item-name',
		itemCaloriesInput: '#item-calories',
		totalCalories: '.total-calories',
	};

	// Public methods
	return {
		populateItemList: function(items) {
			let html = '';
			items.forEach(function(item) {
				html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`;
			});

			// Insert list items
			document.querySelector(UISelectors.itemList).innerHTML = html;
		},
		getItemInput: function() {
			return {
				name: document.querySelector(UISelectors.itemNameInput).value,
				calories: document.querySelector(UISelectors.itemCaloriesInput).value,
			};
		},
		hideList: function() {
			document.querySelector(UISelectors.itemList).style.display = 'none';
		},
		getSelectors: function() {
			return UISelectors;
		},
		clearInput: function() {
			document.querySelector(UISelectors.itemNameInput).value = '';
			document.querySelector(UISelectors.itemCaloriesInput).value = '';
		},
		addItemToForm: function() {
			document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
			document.querySelector(
				UISelectors.itemCaloriesInput
			).value = ItemCtrl.getCurrentItem().calories;
			UICtrl.showEditState();
		},
		showTotalCalories: function(totalCalories) {
			document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
		},
		addListItem: function(item) {
			// Show the list
			document.querySelector(UISelectors.itemList).style.display = 'block';
			// Create li element
			const li = document.createElement('li');
			// Add class
			li.className = 'collection-item';
			// Add id
			li.id = `item-${item.id}`;
			// Add HTML
			li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>`;
			// Insert item
			document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
		},
		updateListItem: function(item) {
			let listItems = document.querySelectorAll(UISelectors.listItems);

			// Turn node list into array
			listItems = Array.from(listItems);

			listItems.forEach(function(listItem) {
				const itemID = listItem.getAttribute('id');

				if (itemID === `item-${item.id}`) {
					document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${
						item.calories
					} calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
				}
			});
		},
		removeItems: function() {
			let listItems = document.querySelectorAll(UISelectors.listItems);

			// Turn node list into array
			listItems = Array.from(listItems);

			listItems.forEach(function(item) {
				item.remove();
			});
		},
		deleteListItem: function(id) {
			const itemID = `#item-${id}`;
			const item = document.querySelector(itemID);
			item.remove();
		},
		clearEditState: function() {
			UICtrl.clearInput();
			document.querySelector(UISelectors.updateBtn).style.display = 'none';
			document.querySelector(UISelectors.deleteBtn).style.display = 'none';
			document.querySelector(UISelectors.backBtn).style.display = 'none';
			document.querySelector(UISelectors.addBtn).style.display = 'inline';
		},
		showEditState: function() {
			document.querySelector(UISelectors.updateBtn).style.display = 'inline';
			document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
			document.querySelector(UISelectors.backBtn).style.display = 'inline';
			document.querySelector(UISelectors.addBtn).style.display = 'none';
		},
	};
})();

// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
	// Load event listeners
	const loadEventListeners = function() {
		// Get UI Selectors
		const UISelectors = UICtrl.getSelectors();

		// Add item event
		document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

		// Disable submit on enter
		document.addEventListener('keypress', function(e) {
			if (e.keyCode === 13 || e.which === 13) {
				e.preventDefault();
				return false;
			}
		});

		// Edit item click event
		document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

		// Update item event
		document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

		// Back button event
		document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

		// Delete item event
		document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

		// Clear items event
		document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
	};

	// Add item submit
	const itemAddSubmit = function(e) {
		e.preventDefault();
		// Get form input from UI Controller
		const input = UICtrl.getItemInput();

		// Check for name and calorie input
		if (input.name !== '' && input.calories !== '') {
			// Add item
			const newItem = ItemCtrl.addItem(input.name, input.calories);
			// Add item to UI list
			UICtrl.addListItem(newItem);

			// Get total calories
			const totalCalories = ItemCtrl.getTotalCalories();

			// Add total cals to UI
			UICtrl.showTotalCalories(totalCalories);

			// Store in localStorage
			StorageCtrl.storeItem(newItem);

			// Clear fields
			UICtrl.clearInput();
		}
	};

	// Edit item click
	const itemEditClick = function(e) {
		if (e.target.classList.contains('edit-item')) {
			// Get list item id (item-0, item-1...)
			const listId = e.target.parentNode.parentNode.id;

			// Break into an array
			const listIdArr = listId.split('-');

			// Get the actual id
			const id = parseInt(listIdArr[1]);

			// Get item
			const itemToEdit = ItemCtrl.getItemById(id);

			// Set current item
			ItemCtrl.setCurrentItem(itemToEdit);

			// Add item to form
			UICtrl.addItemToForm();
		}

		e.preventDefault();
	};

	// Item update submit
	const itemUpdateSubmit = function(e) {
		e.preventDefault();

		// Get item input
		const input = UICtrl.getItemInput();

		// Update item
		const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

		// Update UI
		UICtrl.updateListItem(updatedItem);

		// Get total calories
		const totalCalories = ItemCtrl.getTotalCalories();

		// Add total cals to UI
		UICtrl.showTotalCalories(totalCalories);

		// Update localStorage
		StorageCtrl.updateItemStorage(updatedItem);

		UICtrl.clearEditState();
	};

	// Delete button event
	const itemDeleteSubmit = function(e) {
		e.preventDefault();

		// Get current item
		const currentItem = ItemCtrl.getCurrentItem();

		// Delete from data structure
		ItemCtrl.deleteItem(currentItem.id);

		// Delete from UI
		UICtrl.deleteListItem(currentItem.id);

		// Get total calories
		const totalCalories = ItemCtrl.getTotalCalories();

		// Add total cals to UI
		UICtrl.showTotalCalories(totalCalories);

		// Delete from local storage
		StorageCtrl.deleteItemFromStorage(currentItem.id);

		UICtrl.clearEditState();
	};

	// Clear items event;
	const clearAllItemsClick = function() {
		// Delete all items from data structure
		ItemCtrl.clearAllItems();

		// Get total calories
		const totalCalories = ItemCtrl.getTotalCalories();

		// Add total cals to UI
		UICtrl.showTotalCalories(totalCalories);

		// Remove from UI
		UICtrl.removeItems();
		UICtrl.hideList();
		UICtrl.clearEditState();

		// Clear localStorage
		StorageCtrl.clearItemsFromStorage();
	};

	// Public methods
	return {
		init: function() {
			// Clear edit state / set initial state
			UICtrl.clearEditState();

			// Fetch items from data structure
			const items = ItemCtrl.getItems();

			// Check if any items
			if (items.length === 0) {
				UICtrl.hideList();
			} else {
				// Populate list with items
				UICtrl.populateItemList(items);
			}

			// Get total calories
			const totalCalories = ItemCtrl.getTotalCalories();

			// Add total cals to UI
			UICtrl.showTotalCalories(totalCalories);

			// Load event listeners
			loadEventListeners();
		},
	};
})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
App.init();
