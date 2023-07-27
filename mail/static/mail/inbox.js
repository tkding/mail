document.addEventListener('DOMContentLoaded', function() {
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');

  /** new content */
  // document.querySelector('#submit').disabled = true;
  // document.querySelector('#compose-body').onkeyup = () => {
  //   if (document.querySelector('#compose-body').value.length > 0){
  //       document.querySelector('#submit').disabled = false;
  //   } else {
  //       document.querySelector('#submit').disabled = true;
  //   }
    
  // }
  /** end  */

  // add event listener to the form submit
  document.querySelector('#compose-form').addEventListener('submit', function(event) {
    event.preventDefault();
    send_email();
  });
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

/*
You’ll likely want to make a GET request to /emails/<mailbox> to request the emails for a particular mailbox.
When a mailbox is visited, the application should first query the API for the latest emails in that mailbox.
When a mailbox is visited, the name of the mailbox should appear at the top of the page (this part is done for you).
Each email should then be rendered in its own box (e.g. as a <div> with a border) that displays who the email is from, what the subject line is, and the timestamp of the email.
If the email is unread, it should appear with a white background. If the email has been read, it should appear with a gray background.
*/
/*
// GET reqeust example:
  
    fetch('/emails/inbox')
    .then(response => response.json())
    .then(emails => {
        // Print emails
        console.log(emails);

        // ... do something else with emails ...
    });
  
  // creating eement example
  
    const element = document.createElement('div');
    element.innerHTML = 'This is the content of the div.';
    element.addEventListener('click', function() {
        console.log('This element has been clicked!')
    });
    document.querySelector('#container').append(element);
*/
function load_mailbox(mailbox) {
  console.log(`load mailbox: ${mailbox}`)

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // clear the exisitng content of the email-view
  document.querySelector('#emails-view').innerHTML = '';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  
  // make a GET request to retreive the emails for the selected mailbox
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      // create a div element to hold the emails in the mailbox
      const emailsDiv = document.createElement('div');
       
      emails.forEach(email => {
        const emailDiv = document.createElement('div');
        emailDiv.classList.add('email-box');

        // Set background color based on whether the email is read of unread
        emailDiv.style.backgroundColor = email.read ? 'gray' : 'white';
        
        // border
        emailDiv.style.border = '1px solid #ccc';
        emailDiv.style.padding = '10px';
        emailDiv.style.marginBottom = '10px';
        emailDiv.style.cursor = 'pointer';

        // Populate the email box with the require info
        emailDiv.innerHTML = `
          <p><strong>From:</strong> ${email.sender}</p>
          <p><strong>Subject:</strong> ${email.subject}</p>
          <p><strong>Timestamp:</strong> ${email.timestamp}</p>
        `;

        // add an event listner to view the full content of the email
        emailDiv.addEventListener('click', () => view_email(email.id, mailbox));

        // append the email box to the parent emailsDiv
        emailsDiv.appendChild(emailDiv);
      });

      document.querySelector('#emails-view').appendChild(emailsDiv);
    })
    .catch(error => {
      console.error('Error loading mailbox:', error);
    })
}

/*
You’ll likely want to make a POST request to /emails, passing in values for recipients, subject, and body.
Once the email has been sent, load the user’s sent mailbox.
*/
/*
  make a POST request to send the email
  // given method
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: 'baz@example.com',
          subject: 'Meeting time',
          body: 'How about we meet tomorrow at 3pm?'
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
    });
*/
function send_email() {
  console.log('send method called');
  // get the form data
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'), // inlcude CSRF token, !unnessary in this assignment
    },
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body,
      read: false,
    }),
  })
  .then(response => response.json())
  .then(result => {
    console.log(result); //  optional: to test
    load_mailbox('sent');
  })
  .catch((error) => {
    console.error('Error sending email:', error);
  });
}

/*
You’ll likely want to make a GET request to /emails/<email_id> to request the email.
Your application should show the email’s sender, recipients, subject, timestamp, and body.
You’ll likely want to add an additional div to inbox.html (in addition to emails-view and compose-view) for displaying the email. Be sure to update your code to hide and show the right views when navigation options are clicked.
See the hint in the Hints section about how to add an event listener to an HTML element that you’ve added to the DOM.
Once the email has been clicked on, you should mark the email as read. Recall that you can send a PUT request to /emails/<email_id> to update whether an email is read or not.
*/
/*
example of GET request: 

fetch('/emails/100')
.then(response => response.json())
.then(email => {
    // Print email
    console.log(email);

    // ... do something else with email ...
});
*/
function view_email(emailId, mailbox){
  console.log(`view email: ${emailId}`);

  // show the email view and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // clear any existing content in the emails-view
  document.querySelector('#emails-view').innerHTML = '';

  // make a GET requeat to retrieve the email content
  fetch(`/emails/${emailId}`)
    .then(response => response.json())
    .then(email => {
      // create a div to hold the email content
      const emailDiv = document.createElement('div');

      // populate the dmail 
      emailDiv.innerHTML = `
        <p><strong>From:</strong> ${email.sender}</p>
        <p><strong>To:</strong> ${email.recipients.join(', ')}</p>
        <p><strong>Subject:</strong> ${email.subject}</p>
        <p><strong>Timestamp:</strong> ${email.timestamp}</p>
        <hr />
        <p>${email.body}</p>
      `;
      
      /*
      <button class="btn btn-sm btn-primary archive-btn">${email.archived? 'Unarchive' : 'Archive'}</button>
      <button class="btn btn-sm btn-primary reply-btn">Reply</button>
      */

      // check if the email is in the Inbox or Archived Inbox
      console.log(`test view_email: ${mailbox}`);
      if(mailbox === 'inbox' || mailbox === 'archive'){
        // create and show the archive/unarchive button
        const archive_button = document.createElement('button');
        archive_button.classList.add('btn', 'btn-sm', 'btn-primary', 'archive-btn');
        archive_button.textContent = email.archived? 'Unarchive' : 'Archive';
        emailDiv.appendChild(archive_button);

        // attach even listener to the archive and unarchive button
        archive_button.addEventListener('click', () => {
          if (email.archived) {
            unarchive_email(email.id);
          } else {
            archive_email(email.id);
          }
        });

        // Add padding to the archive button
        archive_button.style.padding = '5px 10px';
        archive_button.style.margin = '5px';
      }      
      
      // create and show the reply button
      const reply_button = document.createElement('button');
      reply_button.classList.add('btn', 'btn-sm', 'btn-primary', 'reply-btn');
      reply_button.textContent = 'Reply';
      emailDiv.appendChild(reply_button);

      // attach even listerner to the reply button
      // reply button === emailDiv.querySelector('.reply-btn')
      reply_button.addEventListener('click', () => reply_email(email));

      // add padding to the reply button
      reply_button.style.padding = '5px 10px';
      reply_button.style.margin = '5px';

      // mark the email as read by sending a PUT request
      if (!email.read){
        fetch(`/emails/${emailId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'applications/json',
            'X-CSRFToken': getCookie('csrftoken'), // unnessary for this project
          },
          body: JSON.stringify({
            read: true,
          }),
        }).catch(error => {
          console.error('Error marking email as read:', error);
        });
      }

      // append emailDiv to the emails-view
      document.querySelector("#emails-view").appendChild(emailDiv);
    })
    .catch(error => {
      console.error('Error viewing email:', error);
    });
}

/*
When viewing an Inbox email, the user should be presented with a button that lets them archive the email. When viewing an Archive email, the user should be presented with a button that lets them unarchive the email. This requirement does not apply to emails in the Sent mailbox.
Recall that you can send a PUT request to /emails/<email_id> to mark an email as archived or unarchived.
Once an email has been archived or unarchived, load the user’s inbox.
*/
function archive_email(emailId){
  // send a PUT request to mark the email as archived
  fetch(`/emails/${emailId}`, {
    method: 'PUT',
    headed: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'), // optional for this project
    }, 
    body: JSON.stringify({
      archived: true,
    }),
  })
    .then( () => {
      // Load ther user's inbox after archiving the email
      load_mailbox('inbox');
    })
    .catch((error) => {
      console.log.error('Error archiving email:', error);
    });
}

function unarchive_email(emailId){
  // send a PUT request to mark the email as unarchived
  fetch(`/emails/${emailId}`, {
    method: 'PUT', 
    header: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'), // optional
    },
    body: JSON.stringify({
      archived: false,
    }),
  })
    .then(() => {
      // load teh user's inbox after unarchiving the email
      load_mailbox('inbox');
    })
    .catch(error => {
      console.error('Error unarchiving email:', error);
    });
}

/*
When viewing an email, the user should be presented with a “Reply” button that lets them reply to the email.
When the user clicks the “Reply” button, they should be taken to the email composition form.
Pre-fill the composition form with the recipient field set to whoever sent the original email.
Pre-fill the subject line. If the original email had a subject line of foo, the new subject line should be Re: foo. (If the subject line already begins with Re: , no need to add it again.)
Pre-fill the body of the email with a line like "On Jan 1 2020, 12:00 AM foo@example.com wrote:" followed by the original text of the email.
*/
function reply_email(email){
  // Display the email composition view
  compose_email();

  // pre-fill the composition fields
  document.querySelector('#compose-recipients').value = email.sender;
  document.querySelector('#compose-subject').value = email.subject.startsWith('Re: ') ? email.subject : `Re: ${email.subject}`;
  document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote:\n${email.body}`;
}

// optional not neccessary for this project
// practice
function getCookie(name) {
  let cookieValue = null;
  if(document.cookie && document.cookie !== ''){
    const cookies = document.cookie.split(':');
    for(let i = 0; i < cookies.length; i++){
      const cookie = cookies[i].trim();

      // Does this cookie string begin with the name we want?
      if(cookie.substring(0, name.length+1) === name + '='){
        cookieValue = decodeURIComponent(cookie.substring(name.length+1));
        break;
      }
    }
  }
  return cookieValue;
}

