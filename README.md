# Email Client Front-end

This is a front-end implementation for an email client that allows users to send and receive emails. The email client is a single-page application (SPA) built using JavaScript, HTML, and CSS.

[Watch the video demonstration](https://youtu.be/XJ-BdK-DZVk)

## Functionality:

1. **Send Mail**: Users can compose and send emails using a simple form. When the form is submitted, the email is sent using the provided recipients, subject, and body. Sent emails are stored in the user's Sent mailbox.

2. **Mailbox Navigation**: The application provides three mailboxes - Inbox, Sent, and Archive. Users can switch between these mailboxes to view their received emails, sent emails, and archived emails, respectively.

3. **Mail Viewing**: Users can click on an email in the Inbox to view its full content. The application displays the sender, recipients, subject, timestamp, and body of the selected email. When an email is viewed, it is marked as read.

4. **Archive and Unarchive**: Users can archive and unarchive emails in the Inbox. Archiving removes the email from the Inbox and places it in the Archive, while unarchiving moves it back to the Inbox.

5. **Reply to mails**: The application allows users to reply to received emails. Clicking the "Reply" button on an email takes the user to the compose page with the recipient, subject, and body fields pre-filled. The subject line is automatically set as "Re: original_subject" to indicate a reply.

## How to Use:

1. **Run the Django Project Locally**: To use the email client, you need to run the Django project on your local device. Follow these steps:

   - Download the distribution code and unzip it.
   - Open your terminal or command prompt and navigate to the `mail` directory using the `cd` command.
   - Install the required dependencies by running:
     ```
     pip install -r requirements.txt
     ```
   - After installation, set up the database by running the following commands:
     ```
     python manage.py makemigrations mail
     python manage.py migrate
     ```
   - Start the web server by running:
     ```
     python manage.py runserver
     ```
   - Open your web browser and go to `http://localhost:8000/` to access the email client.

2. Register for a new account using the "Register" link. You can choose any email address and password for this project.

3. Upon signing in, you'll be taken to the Inbox page where you can view received emails. Click on an email to read its content.

4. Use the navigation buttons to switch between Inbox, Sent, and Archive mailboxes.

5. To send an email, click the "Compose" button and fill in the recipient, subject, and body fields. Click "Send" to send the email.

6. To archive or unarchive an email in the Inbox, click the corresponding button next to the email.

7. To reply to an email, open the email and click the "Reply" button. Compose your reply and click "Send" to reply to the email.

Enjoy using the simple email client to manage your emails!




