# IT PROJECT 2019 SEM 2
## Family Artefacts Register

### Stack:
* React.js
* Python/Django
* Postgres

## Dev Environment Setup:
### Backend
1. Clone/pull repo and enter it
2. Start a virtual environment. 
    `virtualenv -p python3 .venv`
    - This will create your python virtual environment.
    - To enter it: `source .venv/bin/activate`
    - To exit: `deactivate`
3.  `pip install requirements.txt`
4.  Setup postgres (version 11.4 - latest as of 15/8/19)
    1. `brew install postgres`
    2. Start the server (can use > pg_ctl … or download postgres.app - https://postgresapp.com/documentation/) I recommend the latter
    3. Follow this (after reading notes below): https://medium.com/agatha-codes/painless-postgresql-django-d4f03364989
        - You will have already done some steps from that guide
        - You will not need to run > python manage.py makemigrations as they are already in the repo
        - Some set-up in settings already done, you should only have to change the username and password to whatever you used


### Front end
1. Setup backend first
2. `cd front`
3. `npm install`
4. `npm start`

### Working With Multiple Settings Modules
## setting.py has been replaced by folder called settings which contain several setting file for different purpose.
1. move your .env file into folder named settings

## now python manage.py runserver won't work since setting.py is replaced by folder named settings
## you need to run the command below instead
## you can replace the last attribute of the command 'development' by, for example, 'production' depend on ## your purpose
2. python manage.py runserver --settings=mysite.settings.development