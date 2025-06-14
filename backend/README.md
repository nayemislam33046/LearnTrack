# Laravel Backend Setup

## Quick Start (All Commands Together)

```bash
# 1. Clone project and install dependencies
git clone [repository-url]
cd [project-directory]
composer install
cp .env.example .env
php artisan key:generate
 
you have to connect mysql in .env file 

# 2. Database setup (configure .env first!)
php artisan migrate
php artisan db:seed  # optional

# 3. Frontend assets (if needed)
npm install
npm run dev

# 4. Start development server
php artisan serve