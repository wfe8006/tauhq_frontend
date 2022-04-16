# Lamden Block Explorer Frontend

### Running the project

Create a .env file with the custommizable content below in the project root directory:

```
VITE_NODE_ENV=development
VITE_API_SERVER=https://www.tauhq.com/api/v0
VITE_IMG_SERVER=https://www.tauhq.com
VITE_WEBSITE=<http://127.0.0.1 or www.yourwebsite.com>
VITE_SITE_NAME=
VITE_TAU_DONATION_ADDRESS=
VITE_META_KEYWORD="
VITE_META_DESCRIPTION=
VITE_META_SITE_NAME=
VITE_GTAG=<google tag manager id>
VITE_ADSENSE=<google adsense id>
VITE_TWITTER_PROFILE=<twitter handler>
```

Once you have created the project, install dependencies and run the project in development mode:

```bash
cd tauhq_frontend
npm install # or yarn
npm run dev
```

This will start the development server on [localhost:3000](http://localhost:3000). Open it and click around.
