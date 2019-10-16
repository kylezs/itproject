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

## Working With Multiple Settings Modules
settings.py has been replaced by folder called settings which contain several setting file for different purpose.
1. move your `.env` file into folder named settings

Now `python manage.py runserver` won't work since settings.py is replaced by folder named settings.
You need to run the command below instead.

### For Development
1. `python manage.py runserver --settings=family_artefacts_register.settings.development`

### For Production (heroku)
2. `python manage.py runserver --settings=family_artefacts_register.settings.production`
HOWEVER, this will be set in the manage.py and wsgi.py as
`os.environ.setdefault("DJANGO_SETTINGS_MODULE",
                      "family_artefacts_register.settings.production")`
So that the heroku/python build can occur.

You can also change it in manage.py AND wsgi.py to development while developing so you don't have to type that each time.

## To note: Some differences between "production" and "development" and media files
The React "production" build, i.e. what is run on localhost:8000 (from an npm run build), in build folder, serves media
files from s3
The React "development" build i.e. npm start, serves media files from localhost:8000.
These can be configured in `front/constants.js`

# Deploying to heroku
Heroku always runs it's root url from the master branch. Thus deploying must be to the master branch.

Our environment setup, namely separating front end and back end means that some specific build processes have been implemented such that
the React SPA can be deployed with django, and not as a separate application. This reduces the need for cross server validations like csrf
between API calls. 

## How to Deploy
1. Be sure you know which branch you want to deploy. In 99% of cases this branch is master. For generalisability the branch you are deploying will be referred to as BRANCH.
2. Change the default settings in `manage.py` and `wsgi.py`
Do this according to the production settings. As above (settings for production).
3. Build the front end.
    
    1. Navigate to /front
    2. Run `npm run build` This will build the react app and put the build in back/build
4. Run `python manage.py collectstatic`

    This will put the static files on AWS.

5. Commit changes to local branch. No need to push to origin.

    
6. Push the branch to heroku. `--force` because fuck whatever else is in there. Am I right?
This needs to be run from the root directory (where back/ and front/ are located)

        git push heroku `git subtree split --prefix back/ BRANCH`:master --force

7. Open the app and have some fun adding artefacts to a register.