create an account on razorpay.com
signup on razorpay & complete KYC
To reach your Razorpay dashboard, here’s the simple path:

- Open your browser and go to 👉 https://dashboard.razorpay.com.
- Log in with the email/phone number you used during signup.
- Once inside, you’ll see the Dashboard Home with options like Payments, Orders, Settlements, and Settings.
- At the top‑right corner, you can toggle between Live Mode and Test Mode.
- Keep it on Test Mode while coding along Akshay’s series.
- # Under Settings → API Keys, you’ll find your Test Keys (which you already generated).

# created a UI for premium page

# create an APT for creating an order

# npm i razorpay

# https://razorpay.com/docs/payments/server-integration/nodejs/integration-steps/

initialized razorpay in utils
added my key and secret in .env file
created order on razorpay
created schema, model
created an API post(/payment/create)
saved the order in payments collection
made the API dynamic
=> add the <script src="https://checkout.razorpay.com/v1/checkout.js"></script> in frontend code base's root html file
and in the frontend click logic of making api u can add
const rzp = new window.Razorpay(options); //Razorpay comes from the script file added in root html file
rzp.open();
setup razorpay webhook on your live API (useless on localhost but ngrok makes it work but we dont really need it)
https://razorpay.com/docs/webhooks/validate-test/
for payment webhook api we dont need userAuth middleware as razorpay does not need login validation,
