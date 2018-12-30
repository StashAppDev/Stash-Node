const { introspectSchema } = require("apollo-codegen");
const { generate } = require("graphql-code-generator");

const schemaInput = "./src/schema.graphql";
const jsonOutput = "./src/schema.json";
const dtsOutput = "./src/typings/graphql.d.ts";

function regen() {
  introspectSchema(schemaInput, jsonOutput)
    .then(async () => {
      await generate({
        out: dtsOutput,
        template: "typescript",
        schema: jsonOutput,
        skipDocuments: true,
        overwrite: true,
        config: "./gqlgen.json"
      });
    })
    .catch(err => {
      console.log(err);
    });
}

regen();