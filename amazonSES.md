-> signup for Amazon SES
-> google amazon SES
-> sign in to the console button make sure u r in mumbai region
-> on amazon console once u login search IAM and select
IAM -> under IAM resoucers -> Users -> 0 click on 0 -> click create user -> give a user name -> ses-user -> click next -> attach policies directly ->
In the policies search for amazonses -> select AmazonSESFullAccess ->
click next -> gives u summary -> click create user -> you will see the message
User created successfully
You can view and download the user’s password and email instructions for signing in to the AWS Management Console.

View user
->now go to aws console and search ses -> Amazon SES ->
Account dashboard -> you see this message
Your Amazon SES account is in the sandbox in Asia Pacific (Mumbai)
Follow the steps on the Get set up page to verify your email address and sending domain so that you can start sending email through Amazon SES and request production access for your account.
View Get set up page
=========================
Configurtion => create identity -> added few cnames to cloudflare around 3
waited for 10mins for erification to be successful
now goto getsetup page -> request production access -> transactional -> add an email here like support@namastedevtinder.com -> finish
===========================
goto AWS -> IAM -> Users -> ses-user -> security credentials -> create an access key -> select other -> skip tag name -> create access key
it gives u access key and secret access key -> save these access keys in .env file
=============================
Refer this documentation
===========================
https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_ses_code_examples.html
-> sendEmail
-> https://github.com/awsdocs/aws-doc-sdk-examples/tree/main/javascriptv3/example_code/ses#code-examples

inside that ->
javascriptv3/example_code/ses/src/ses_sendemail.js
here copy the file content from
https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascriptv3/example_code/ses/src/libs/sesClient.js
in sesClient.js
================
in backend prj workspace lets create a file under utils folder -> sesClient.js
npm i @aws-sdk/client-ses
