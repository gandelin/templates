var CONTACTS_PERSISTENCE_KEY = 'contacts-storage';
var nextId = 1000;
var contacts = getContacts();
var contactsVisible = false;

$('#addNewItem').on('click', addNewContact);

var contactFormTemplate = Handlebars.compile($('#contactFormTemplate').html());
var contactsTableTemplate = Handlebars.compile($('#contactsTableTemplate').html());

$(document).ready(function() {
  if (contacts.length > 0) {
    updateContactTable();
    resetForm();
  }
  togglePageVisibility();
});

function updateContactTable() {
  var data = { contacts: contacts};
  var html = contactsTableTemplate(data);
  $('#contactsTableDiv').html(html);
  
  $('#contact-tbody').on('click', '.edit', editContact);
  $('#contact-tbody').on('click', '.delete', deleteContact);
}

function resetForm() {
  $('#name').val("");
  $('#phone').val("");
}

function togglePageVisibility() {
  if (contactsVisible) {
    // hide contacts, show form
    $("#contactFormDiv").removeClass('hide');
    $("#contactsTableDiv").addClass('hide');
  }
  else {
    // show contacts, hide form
    $("#contactsTableDiv").removeClass('hide');
    $("#contactFormDiv").addClass('hide');
  }
  contactsVisible = !contactsVisible;
}

function removeForm() {
  $('#contactFormDiv').empty();
}

function addNewContact() {
  createOrEditContact();
}

function editContact(e) {
  var ix = getContactIndex(e);
  if (ix >= 0) {
    createOrEditContact(contacts[ix]);
  }
}

function getContactIndex(e) {
  var btn = e.target;
  var tr = $(btn).closest( 'tr' );
  var id = tr.attr( 'data-id' );
  var i, len;

  for ( i = 0, len = contacts.length; i < len; ++i ) {
    if ( contacts[ i ].id === id ) {
      return i;
    }
  }
  return -1;
}

function deleteContact(e) {
  var ix = getContactIndex(e);
  if (ix >= 0) {
    contacts.splice(ix, 1);
    updateContactTable();
    saveContacts();
  }
}

function createOrEditContact(contact) {
  var data = { name: '', phone: ''};
  if (contact) {
    data = { name: contact.name,
             phone: contact.phone};
  }
  var html = contactFormTemplate(data);
  $('#contactFormDiv').html(html);
  
  $('#submitContact').one('click', createOrUpdateContact);
  $('#cancelContact').one('click', togglePageVisibility);
  
  togglePageVisibility();
  
  function createOrUpdateContact(evt) {
    evt.preventDefault();
    
    if (contact) {
      contact.name = $('#name').val();
      contact.phone = $('#phone').val();
    }
    else {
      // new contact
      var newContact = { id: (nextId++).toString(),
                       name: $('#name').val(),
                      phone: $('#phone').val()
      };
      contacts.push(newContact);
    }
    updateContactTable();
    saveContacts();
    togglePageVisibility();
  }
}

function getContacts() {
  var c = localStorage[CONTACTS_PERSISTENCE_KEY];
  if (c) {
    return JSON.parse(c);
  }
  else {
    return [];
  }
}

function saveContacts() {
  localStorage[CONTACTS_PERSISTENCE_KEY] = JSON.stringify(contacts);
}

