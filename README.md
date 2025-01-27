# Mercatino Libri Usati Digitale (MLUD)

![Lokalino Logo](documentation/assets/logo.png)

## Overview

MLUD is a web-based system developed to streamline the operations of the Lokalino summer book market, a marketplace for used schoolbooks. It replaces manual processes with a digital platform, reducing operator workload, minimizing errors, and promoting sustainability by cutting down paper usage.

The system is designed to serve three key user groups:

- **Providers**: Users who want to sell books at the market
- **Buyers**: Users who want to purchase books at the market
- **Operators**: Users who manage the market and oversee its operations

## Key Features

- Simplified Book Submission: Providers can easily add book details via an intuitive web form with ISBN-based autofill.
- Sales and Inventory Management: Operators handle transactions digitally, marking books as sold and tracking stock.
- Liquidation and Returns: Unsold books are tracked, and providers are notified about their return or proceeds.
- Responsive Design: Fully functional on desktop and mobile devices to accommodate all users.


## Architecture

The system is built using the following technologies:

- **Frontend**: React.js
- **Backend**: PHP (Please don't judge us)
- **Database**: MySQL

## Installation

1. Clone the repository

```bash
git clone https://github.com/pontig/lokalino_mlud.git
```

2. Install the dependencies

```bash
cd lokalino_mlud/frontend
yarn
```

3. Host the backend on a server with PHP and MySQL support

4. Configure the backend connection in the react app

5. Create the database and tables using the provided SQL files

6. Start the frontend

```bash
yarn start
```

## Structure 

The structure is very intuitive:

```
backend/
├── dao/
├── utils/
├── --php files--
frontend/
├── public/
├── src/
│   ├── pages/
│   ├── styles/
│   ├── types/
│   ├── App.js
│   └── index.js
```
