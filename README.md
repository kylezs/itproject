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