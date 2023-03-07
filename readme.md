# jokopi

just basic rest api using express js (ES6)
In mvc but this view replaces json

<!-- 
## List

 - [Users](https://)
 - [Products](https://)
 - [History](https://)
 - [Promo](https://) -->

## API Reference

#### Get all users

```http
  GET /users/
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `limit` | `string` | Limit output data |
| `orderBy` | `string` | Order by column |
| `sort` | `string` | Ascending (asc) or decending (desc)|

#### Get all products

```http
  GET /products/
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `searchByName` | `string` | Search name |
| `limit` | `string` | Limit output data |
| `orderBy` | `string` | Order by column |
| `sort` | `string` | Ascending (asc) or decending (desc) |

#### Get all history

```http
  GET /history/
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `limit` | `string` | Limit output data |
| `orderBy` | `string` | Order by column |
| `sort` | `string` | Ascending (asc) or decending (desc) |

#### Get all promos data

```http
  GET /promo/
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `searchByName` | `string` | Search name |
| `limit` | `string` | Limit output data |
| `orderBy` | `string` | Order by column | 
| `sort` | `string` | Ascending (asc) or decending (desc) |


## Description method in routes
index() - List all with filter, search, and limit using query params



