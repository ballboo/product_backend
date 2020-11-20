# <h1>How to start</h1> <br/>
```
$npm install
$npm start
```
## Examples 
- get all data table products use GET method
`http://localhost:8000/api/products/`
- get data by id input **id** is namber send data by params  <br/>
`http://localhost:8000/api/products/getproduct/1` <br/>
- add data by POST method use bodyparser send to data  
`http://localhost:8000/api/products` <br/>
*** Example use bodyparser send data
```
{
    "product_name": "testAdd_Arduino",
    "detail" : "arduino uno",
    "price": 100, 
    "group_id" :1
}
```
- edit data in table by PATCH method use body send to data  
`http://localhost:8000/api/products`<br/>
*** Example use bodyparser send data
```
{
    "product_name": "testEdit_Arduino",
    "detail" : "arduino uno",
    "price": 100, 
    "group_id" :1
}
```
- delete data in table by id **id** is number use DELETE method send data by params <br/>
`http://localhost:8000/api/products/delproduct/4` 
- get all datas and type products in table <br/>
`http://localhost:8000/api/products/groups`
- get data and select type product in table <br/>
`http://localhost:8000/api/products/groups/typegroup/ESP` <-- ESP is params type product

