# natours

## db

### `default`
```sh
docker exec -it natours_db_1 mongo -u root -p secret
```

### `natours`
```sh
docker exec -it natours_db_1 mongo -u admin -p secret natours
```