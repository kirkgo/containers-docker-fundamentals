# Simple CRUD Application

This guide provides detailed instructions to create a complete CRUD application using Docker, Node.js, Express, and MongoDB with a visual interface.

## Step 1: Setting Up the Project Structure

First, create the project directory and file structure:

```bash
# Create main project directory
mkdir docker-crud
cd docker-crud

# Create necessary subdirectories
mkdir -p models public
```

## Step 2: Creating the Backend Files

### 2.1: Dockerfile

Create a `Dockerfile` in the root directory:

```bash
# In the docker-crud directory
touch Dockerfile
```

Add the following content to `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

### 2.2: package.json

Create a `package.json` file in the root directory:

```bash
# In the docker-crud directory
touch package.json
```

Add the following content to `package.json`:

```json
{
  "name": "docker-crud-app",
  "version": "1.0.0",
  "description": "A simple CRUD application using Docker",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "body-parser": "^1.20.2"
  }
}
```

### 2.3: Model Definition

Create an item model in `models/item.js`:

```bash
# In the docker-crud directory
touch models/item.js
```

Add the following content to `models/item.js`:

```javascript
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Item', itemSchema);
```

### 2.4: Server Configuration

Create a `server.js` file in the root directory:

```bash
# In the docker-crud directory
touch server.js
```

Add the following content to `server.js`:

```javascript
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const Item = require('./models/item');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/itemsdb';

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes

// Get all items
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific item
app.get('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new item
app.post('/api/items', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update an item
app.put('/api/items/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an item
app.delete('/api/items/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Step 3: Creating the Frontend Files

### 3.1: HTML Layout

Create an `index.html` file in the `public` directory:

```bash
# In the docker-crud directory
touch public/index.html
```

Add the following content to `public/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Item Manager - CRUD Application</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Item Manager</h1>
            <p>A Simple CRUD Application</p>
        </header>

        <section class="form-container">
            <h2 id="form-title">Add New Item</h2>
            <form id="item-form">
                <input type="hidden" id="item-id">
                <div class="form-group">
                    <label for="name">Name:</label>
                    <input type="text" id="name" required>
                </div>
                <div class="form-group">
                    <label for="description">Description:</label>
                    <textarea id="description"></textarea>
                </div>
                <div class="form-group">
                    <label for="price">Price:</label>
                    <input type="number" id="price" step="0.01" min="0" required>
                </div>
                <div class="form-buttons">
                    <button type="submit" id="save-btn">Save Item</button>
                    <button type="button" id="cancel-btn" class="hidden">Cancel</button>
                </div>
            </form>
        </section>

        <section class="list-container">
            <h2>Items List</h2>
            <div class="search-container">
                <input type="text" id="search" placeholder="Search items...">
            </div>
            <table id="items-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="items-list">
                    <!-- Items will be added here dynamically -->
                </tbody>
            </table>
            <div id="no-items" class="hidden">No items found.</div>
        </section>
    </div>

    <script src="script.js"></script>
</body>
</html>
```

### 3.2: CSS Styling

Create a `styles.css` file in the `public` directory:

```bash
# In the docker-crud directory
touch public/styles.css
```

Add the following content to `public/styles.css`:

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
    background-color: #f5f5f5;
    color: #333;
    line-height: 1.6;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

header {
    text-align: center;
    margin-bottom: 30px;
    padding: 20px;
    background-color: #4285f4;
    color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

header h1 {
    margin-bottom: 10px;
}

.form-container, .list-container {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 30px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
    margin-bottom: 20px;
    color: #4285f4;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
}

input, textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
}

textarea {
    height: 100px;
    resize: vertical;
}

button {
    padding: 10px 20px;
    background-color: #4285f4;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #3367d6;
}

.form-buttons {
    display: flex;
    gap: 10px;
}

#cancel-btn {
    background-color: #f44336;
}

#cancel-btn:hover {
    background-color: #d32f2f;
}

.search-container {
    margin-bottom: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

th {
    background-color: #f2f2f2;
    font-weight: 600;
}

tr:hover {
    background-color: #f9f9f9;
}

.action-btn {
    padding: 6px 12px;
    margin-right: 5px;
    font-size: 14px;
}

.edit-btn {
    background-color: #fbbc05;
}

.edit-btn:hover {
    background-color: #f9a825;
}

.delete-btn {
    background-color: #ea4335;
}

.delete-btn:hover {
    background-color: #d32f2f;
}

.hidden {
    display: none;
}

#no-items {
    text-align: center;
    padding: 20px;
    color: #757575;
}

@media (max-width: 768px) {
    .container {
        padding: 10px;
    }
    
    th, td {
        padding: 8px;
    }
    
    .action-btn {
        padding: 4px 8px;
        font-size: 12px;
    }
}
```

### 3.3: JavaScript Functionality

Create a `script.js` file in the `public` directory:

```bash
# In the docker-crud directory
touch public/script.js
```

Add the following content to `public/script.js`:

```javascript
document.addEventListener('DOMContentLoaded', function() {
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
    window.editItem = function(id) {
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

    window.deleteItem = function(id) {
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
```

## Step 4: Building and Running the Application with Docker

### 4.1: Create a Docker Network

```bash
# Create a Docker network for the containers to communicate
docker network create crud-network
```

### 4.2: Start the MongoDB Container

```bash
# Run MongoDB container
docker run -d --name mongodb --network crud-network -p 27017:27017 mongo:latest
```

### 4.3: Build the Application Image

```bash
# Build the application image
docker build -t crud-app .
```

### 4.4: Run the Application Container

```bash
# Run the application container
docker run -d --name crud-app --network crud-network -p 3000:3000 -e MONGODB_URI=mongodb://mongodb:27017/itemsdb crud-app
```

## Step 5: Testing the Application

### 5.1: Access the Web Interface

Open your browser and navigate to http://localhost:3000

### 5.2: Test API Endpoints

You can test the API endpoints using `curl` commands:

```bash
# Create a new item
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Item","description":"This is a test item","price":19.99}'

# Get all items
curl http://localhost:3000/api/items
```

## Step 6: Cleaning Up

When you're done with the application, you can clean up the Docker resources:

```bash
# Stop containers
docker stop crud-app mongodb

# Remove containers
docker rm crud-app mongodb

# Remove network
docker network rm crud-network

# Optional: Remove the image
docker rmi crud-app
```

## Troubleshooting

### MongoDB Connection Issues

If the application can't connect to MongoDB:

```bash
# Check if containers are running
docker ps

# Check container logs
docker logs crud-app
docker logs mongodb

# Verify the network connection
docker network inspect crud-network
```

### Port Conflicts

If port 3000 is already in use:

```bash
# Use a different port mapping
docker run -d --name crud-app --network crud-network -p 8080:3000 -e MONGODB_URI=mongodb://mongodb:27017/itemsdb crud-app
```

Then access the application at http://localhost:8080

## Summary

You've now created a complete CRUD application with:

1. A Node.js/Express backend
2. MongoDB database
3. HTML/CSS/JavaScript frontend
4. Docker containerization for easy deployment

The application allows you to create, read, update, and delete items through both a web interface and API endpoints.