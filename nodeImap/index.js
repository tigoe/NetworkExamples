var Imap = require('imap');
var my = require('./accounts.js');
var totalCount = 0;

for (a in my.accounts) {
  var thisAccount = new Imap(my.accounts[a]);
  checkMail(thisAccount);
}


function checkMail(imap) {
  function openInbox(callback) {
    imap.openBox('INBOX', true, callback);
  }

  imap.once('ready', function() {
    openInbox(readMailbox);
  });

  function readMailbox(err, box) {
    if (err) throw err;

    var fetcher = imap.seq.fetch("1:" + box.messages.total, {
      bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
      struct: false,
      size: true
    });

    fetcher.on('message', function(msg, seqno) {
      msg.once('attributes', function(attrs) {
        totalCount += attrs.size;
      });
    });

    fetcher.on('error', function(err) {
      console.log('Fetch error: ' + err);
    });

    fetcher.on('end', function() {
      console.log("total mailbox size: " + totalCount);
      console.log('Done fetching all messages!');
      imap.closeBox(box);

      //TO DO: Error seems to be that I am not closing the mailbox before
      // ending the connection
      imap.end();
    });
  }

  imap.on('error', function(err) {
    console.log(err);
  });

  imap.on('end', function() {
    console.log('Connection ended');
  });

  imap.connect();
}
