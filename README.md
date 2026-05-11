After the repository is cloned, run:
```bash
npm install
```

#Below are the versions of software used for this part:
Node.js: 18.20.2

npm: 10.5.0

npx: 10.5.0

nvm: 1.2.2

Mysql: 10.4.11-MariaDB

The application currently starts at http://localhost:5173/ and the relevant port (5173) is added in .env file in the backend for CLIENT_URL variable.
The backend runs at 8080 port (see PORT variable in the backend in the .env file), and the web application sends requests to this port (as defined in API variable in /src/services/api.js).

The initial configuring and seeding in the database is done with:
```bash
npx prisma generate
npx prisma db push
npm run prisma:seed
```