# Project Name : LearnTrack Pro 

## Frontend SetUp 

### Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (version 20 or higher)

### 1. https://github.com/nayemislam33046/LearnTrack/tree/master/frontend

### 2. Install the application 
#### npm install 

### To Run The Application run the command 
#### npm run dev 


## Backend SetUp

### 1. Clone project and install dependencies
git clone https://github.com/nayemislam33046/LearnTrack/tree/master/backend
composer install
cp .env.example .env
php artisan key:generate
 
you have to connect mysql in .env file 

### 2. Database setup (configure .env first!)
php artisan migrate
php artisan db:seed  # optional

### 3. Frontend assets (if needed)
npm install
npm run dev

### 4. Start development server
php artisan serve
