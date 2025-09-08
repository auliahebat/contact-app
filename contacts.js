const fs = require("fs");
const readline = require("readline");
const chalk = require("chalk");
const validator = require("validator");
const { boolean } = require("yargs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

dirPath = "./data";

// Check if directory exists, if not create it
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

const filePath = "./data/contacts.json";

// Check if file exists, if not create it
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, "[]", "utf-8");
}

const dynamicQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

// Read existing contacts from contacs.json
const loadContacts = () => {
  const fileBuffer = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileBuffer);
};

const saveContact = (name, phone, email) => {
  //get input data
  const contact = { name, phone };
  email && (contact.email = email);

  const contacts = loadContacts();

  // Check for duplicate names
  const duplicateCheck = contacts.find((contact) => contact.name === name);
  if (duplicateCheck) {
    console.log(chalk.red("Contact name already exists!"));
    return false;
  }

  if (email && !validator.isEmail(email)) {
    console.log(chalk.red("Invalid email!"));
    return false;
  }

  if (!validator.isMobilePhone(phone, "id-ID")) {
    console.log(chalk.red("Invalid phone number!"));
    return false;
  }

  //push new contact
  contacts.push(contact);
  fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2));
  console.log(chalk.blue("Contact saved successfully!"));
};

const displayContacts = () => {
  const contacts = loadContacts();

  console.log(chalk.cyan("Contact list:"));
  contacts.forEach((contact, i) => {
    console.log(i + 1 + ". " + contact.name + " - " + contact.phone);
  });
};

const detailContact = (name) => {
  const contacts = loadContacts();
  const contact = contacts.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );

  if (!contact) {
    console.log(chalk.red("Invalid name!"));
    return;
  }
  console.log(
    chalk.cyan("Contact details:\n") +
      `Name: ${contact.name}\nPhone: ${contact.phone}\nEmail: ${contact.email}`
  );
};

const deleteContact = (name) => {
  const contacts = loadContacts();
  const newContacts = contacts.filter(
    (contact) => contact.name.toLowerCase() !== name.toLowerCase()
  );
  if(newContacts.length >= contacts.length) {
    console.log(chalk.red("Invalid name!"));
    return;
  }
  fs.writeFileSync(filePath, JSON.stringify(newContacts, null, 2));
  console.log(chalk.blue("Contact deleted successfully!"));
};

module.exports = {
  dynamicQuestion,
  saveContact,
  rl,
  loadContacts,
  displayContacts,
  detailContact,
  deleteContact,
};
