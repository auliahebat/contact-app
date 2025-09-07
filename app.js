const yargs = require("yargs");
const contacts = require("./contacts");
const { rl } = require("./contacts");

yargs
  .command({
    command: "add",
    describe: "Adding new contact with args",
    builder: {
      name: {
        describe: "Full name",
        demandOption: true,
        type: "string",
      },
      phone: {
        describe: "Phone number",
        demandOption: true,
        type: "string",
      },
      email: {
        describe: "Email",
        demandOption: false,
        type: "string",
      },
    },
    handler(argv) {
      contacts.saveContact(argv.name, argv.phone, argv.email);
      rl.close();
    },
  })
  .demandCommand();

yargs
  .command({
    command: "add-contact",
    describe: "Adding new contact with interactive question",
    handler: async function handler() {
      const name = await contacts.dynamicQuestion("Enter name: ");
      const phone = await contacts.dynamicQuestion("Enter phone: ");
      const email = await contacts.dynamicQuestion("Enter email: ");

      contacts.saveContact(name, phone, email);
      rl.close();
    },
  })
  .demandCommand();

yargs
  .command({
    command: "list",
    describe: "List all contacts",
    handler() {
      contacts.displayContacts();
      rl.close();
    },
  })
  .demandCommand();

yargs
  .command({
    command: "detail",
    describe: "Detail a contact",
    builder: {
      name: {
        describe: "name",
        demandOption: true,
        type: "string",
      },
    },
    handler(argv) {
      contacts.detailContact(argv.name);
      rl.close();
    },
  })
  .demandCommand();

yargs.parse();
