document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const itemForm = document.getElementById('item-form');
    const formTitle = document.getElementById('form-title');
    const itemId = document.getElementById('item-id');
    const nameInput = document.getElementById('name');
    const descriptionInput = document.getElementById('description');
    const priceInput = document.getElementById('price');
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const itemsList = document.getElementById('items-list');
    const searchInput = document.getElementById('search');
    const noItemsDiv = document.getElementById('no-items');

    // Fetch all items on page load
    fetchItems();

    // Event Listeners
    itemForm.addEventListener('submit', saveItem);
    cancelBtn.addEventListener('click', resetForm);
    searchInput.addEventListener('input', filterItems);

    // Fetch All Items
    function fetchItems() {
        fetch('/api/items')
            .then(response => response.json())
            .then(items => {
                displayItems(items);
            })
            .catch(error => {
                console.error('Error fetching items:', error);
                alert('Failed to fetch items. Please try again.');
            });
    }

    // Display Items in Table
    function displayItems(items) {
        itemsList.innerHTML = '';

        if (items.length === 0) {
            noItemsDiv.classList.remove('hidden');
            return;
        }

        noItemsDiv.classList.add('hidden');

        items.forEach(item => {
            const row = document.createElement('tr');
            row.dataset.id = item._id;

            row.innerHTML = `
                <td>${escapeHtml(item.name)}</td>
                <td>${escapeHtml(item.description || '')}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editItem('${item._id}')">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteItem('${item._id}')">Delete</button>
                </td>
            `;

            itemsList.appendChild(row);
        });
    }

    // Save Item (Create or Update)
    function saveItem(e) {
        e.preventDefault();

        const item = {
            name: nameInput.value,
            description: descriptionInput.value,
            price: parseFloat(priceInput.value)
        };

        const id = itemId.value;
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/items/${id}` : '/api/items';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to save item');
                }
                return response.json();
            })
            .then(() => {
                resetForm();
                fetchItems();
                alert(id ? 'Item updated successfully!' : 'Item added successfully!');
            })
            .catch(error => {
                console.error('Error saving item:', error);
                alert('Failed to save item. Please try again.');
            });
    }

    // Reset Form
    function resetForm() {
        itemForm.reset();
        itemId.value = '';
        formTitle.textContent = 'Add New Item';
        saveBtn.textContent = 'Save Item';
        cancelBtn.classList.add('hidden');
    }

    // Filter Items
    function filterItems() {
        const searchTerm = searchInput.value.toLowerCase();
        const rows = itemsList.getElementsByTagName('tr');

        for (let i = 0; i < rows.length; i++) {
            const name = rows[i].getElementsByTagName('td')[0].textContent.toLowerCase();
            const description = rows[i].getElementsByTagName('td')[1].textContent.toLowerCase();

            if (name.includes(searchTerm) || description.includes(searchTerm)) {
                rows[i].style.display = '';
            } else {
                rows[i].style.display = 'none';
            }
        }
    }

    // Helper function to escape HTML
    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Make these functions global
    window.editItem = function (id) {
        fetch(`/api/items/${id}`)
            .then(response => response.json())
            .then(item => {
                itemId.value = item._id;
                nameInput.value = item.name;
                descriptionInput.value = item.description || '';
                priceInput.value = item.price;

                formTitle.textContent = 'Edit Item';
                saveBtn.textContent = 'Update Item';
                cancelBtn.classList.remove('hidden');

                // Scroll to form
                document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
            })
            .catch(error => {
                console.error('Error fetching item details:', error);
                alert('Failed to fetch item details. Please try again.');
            });
    };

    window.deleteItem = function (id) {
        if (confirm('Are you sure you want to delete this item?')) {
            fetch(`/api/items/${id}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to delete item');
                    }
                    return response.json();
                })
                .then(() => {
                    fetchItems();
                    alert('Item deleted successfully!');
                })
                .catch(error => {
                    console.error('Error deleting item:', error);
                    alert('Failed to delete item. Please try again.');
                });
        }
    };
});
