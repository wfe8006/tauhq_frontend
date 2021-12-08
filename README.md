# Lamden Block Explorer Frontend

### Running the project

Create a .env file with the custommizable content below in the project root directory:

```
API_SERVER=https://www.tauhq.com/api/v0
IMG_SERVER=https://www.tauhq.com
WEBSITE=<http://127.0.0.1 or www.yourwebsite.com>
SITE_NAME=
TAU_DONATION_ADDRESS=
META_KEYWORD="
META_DESCRIPTION=
META_SITE_NAME=
GTAG=<google tag manager id>
ADSENSE=<google adsense id>
TWITTER_PROFILE=<twitter handler>
```

Once you have created the project, install dependencies and run the project in development mode:

```bash
cd tauhq_frontend
npm install # or yarn
npm run dev
```

This will start the development server on [localhost:3000](http://localhost:3000). Open it and click around.
