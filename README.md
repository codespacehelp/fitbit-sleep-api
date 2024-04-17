# fitbit-sleep-api

This provides a "as simple as possible" way of getting sleep data from your own Fitbit.

## Create an account and dev app

https://dev.fitbit.com/build/reference/web-api/developer-guide/getting-started/

- Use "personal" app type
- Use your personal fitbit profile URL (e.g. https://www.fitbit.com/user/YOUR_USER_ID) as the URL in all the fields.

## Set your client id and client secret

Once you have your app you should have access to your client id and client secret.

Create a `.env` file with the following content:

```
FITBIT_CLIENT_ID=your_fitbit_client_id
FITBIT_CLIENT_SECRET=your_fitbit_client_secret
```

## Node: install node dependencies

Make sure you have node.js. Then run:

```
npm install
```

## Generate an access token:

```
node generate-code.js
```

This produces an URL. Click the URL, allow access. 
You will be redirected to your profile page, with a URL containing the `code` parameter. Copy the whole URL into the terminal and press enter.

This will generate a new file called `.acess_code`.

## Get sleep data

Once the access code is generated, you can get sleep data by running:

```
node get-sleep.js 2024-02-27
```

This will generate a JSON file in the `sleep_data` folder with the sleep data for the date you specified.

## Get HRV data

Once the access code is generated, you can get HRV data by running:

```
node get-hrv.js 2024-02-27
```

This will generate a JSON file in the `hrv_data` folder with the sleep data for the date you specified.