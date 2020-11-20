const sqlite3 = require('sqlite3');
const express = require("express");
let router = express.Router();
let cors = require('cors');
let app = express();
let bodyParser = require('body-parser');
app.use(cors());

app.use('/api', bodyParser.json(), router);   //[use json]
app.use('/api', bodyParser.urlencoded({ extended: false }), router); 

const HTTP_PORT = 8000
app.listen(HTTP_PORT, () => {
    console.log("Server is listening on port " + HTTP_PORT);
});

const db = new sqlite3.Database('./data/products_database.db', (err) => {
    if (err) {
        console.error("Erro opening database " + err.message);
    } else {
        // db.run('CREATE TABLE products_groups( \
        //     group_id INTEGER PRIMARY KEY ,\
        //     group_name NVARCHAR(50)  NOT NULL,\
        // )', (err) => {
        //     if (err) {
        //         console.log("Table products already exists.");
        //     }
        //     let insert = 'INSERT INTO products_groups (group_id ,group_name) VALUES (?,?)';
        //     db.run(insert, [02,"Raspberry PI"]);
        //     db.run(insert, [01,"ESP"]);
            
        // });

        // db.run('CREATE TABLE products( \
        //     product_id INTEGER PRIMARY KEY NOT NULL,\
        //     group_id INTEGER NOT NULL ,\
        //     product_name NVARCHAR(50)  NOT NULL,\
        //     FOREIGN KEY (group_id) REFERENCES products_groups (group_id) ,\
        //     detail NVARCHAR(100),\
        //     price INTEGER\
        // )', (err) => {
        //     if (err) {
        //         console.log("Table products already exists.");
        //     }
        //     let insert = 'INSERT INTO products (group_id ,product_name, detail, price) VALUES (?,?,?,?)';
        //     db.run(insert, [02,"PiZero", "Raspberry Pi Zero", 200]);
        //     db.run(insert, [02,"RespberryPi4", "model B+", 200]);
        //     db.run(insert, [01,"ESP32", "Node ESP32", 250]);
        //     db.run(insert, [01,"ESP8266", "NodeMCU8266", 150]);
            
        // });
        
    }
});
// get data by id
router.get('/products/getproduct/:id', (req, res) => {
    db.get("SELECT * FROM product where product_id = ?", [req.params.id], (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.status(200).json(row);
    });
});
// get All data in table product 
router.get('/products', (req, res) => {
    db.all("SELECT * FROM product", [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.status(200).json({ rows });
    });
});
// get Product Category
router.get('/products/groups', (req, res) => {
    db.all("SELECT product_id, product_name, price, group_name FROM product INNER JOIN product_group ON product_group.group_id = product.group_id  ", [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.status(200).json({ rows });
    });
});
// get select Product Category
router.get('/products/groups/typegroup/:group_name', (req, res) => {
    db.all(`SELECT product_id, product_name, price FROM product INNER JOIN product_group ON product_group.group_id = product.group_id WHERE group_name LIKE ? `, [req.params.group_name], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        console.log(rows)
        res.status(200).json({ rows });
    });
});

// add product
router.post('/products/', (req, res) => {
    let reqBody = req.body;
    db.run('INSERT INTO product ( product_name, detail, price) VALUES (?,?,?)',
        [ reqBody.product_name, reqBody.detail, reqBody.price],
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": err.message })
                return;
            }
            res.status(201).json({
                "product_id": this.lastID
            })
        });
});
// edit product
router.patch('/products/', (req, res) => {
    let reqBody = req.body;
    db.run(`UPDATE product set group_id = ?, product_name = ?, detail = ?, price = ? WHERE product_id = ?`,
        [reqBody.group_id, reqBody.product_name, reqBody.detail, reqBody.price, reqBody.product_id],
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.status(200).json({ "updatedID" : this.changes });
        });
});
// delete product 
router.delete('/products/delproduct/{:id}', (req, res) => {
    db.run(`DELETE FROM product WHERE product_id = ?`,
        req.params.id,
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.status(200).json({ "deletedID": this.changes })
        });
});