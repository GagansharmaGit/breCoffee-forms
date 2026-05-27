const { db } = require("@repo/database");
const { formSubmissionsTable } = require("@repo/database/models/form-submission");
async function main() {
  const subs = await db.select().from(formSubmissionsTable).limit(5);
  console.log(JSON.stringify(subs, null, 2));
}
main().catch(console.error);
