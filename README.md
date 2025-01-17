# Backend for NoLimit Technical Test

## Tech Stack

<ul>
  <li>Express</li>
  <li>Prisma ORM</li>
  <li>Mysql</li>
</ul>

## How To Run

Make new .env file base on <strong>.env.example</strong> and configure it. Make sure the database already exists.
Prerequisite have yarn
Install yarn globally

```
npm install -g yarn
```

Install Dependencies

```
yarn install
```

Run command below to migarate schema to database

```
npx prisma migrate deploy
```

## How to run Test

Run command below

```
npm run test
```

### In Dev Mode

<hr>
Prerequisite have Nodemon<br>
Install Nodemon globally

```
npm install -g nodemon

```

Then run

```
npm run dev
```

### In Prod Mode

<hr>

Build the project with

```
npm run build
```

Then run the project

```
npm run start
```

### In Docker

<hr>
Prerequisite have a <strong>docker</strong> <br>
Run cammand below

```
docker compose up -d
```
