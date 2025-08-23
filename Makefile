run:
	npm start

dev:
	npx nodemon src/index.js

test:
	npm test

migrate:
	mysql -u $(DB_USER) -p$(DB_PASSWORD) -h $(DB_HOST) $(DB_NAME) < migrations/create_students_table.sql
