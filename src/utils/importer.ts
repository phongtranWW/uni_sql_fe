import type { Database } from "@/features/project/schemas/database";
import type { Database as CoreDatabase } from "@dbml/core";
import { ModelExporter, Parser } from "@dbml/core";
import { dbmlToDatabase } from "./convert";

export class Importer {
  database: CoreDatabase;

  private constructor(database: CoreDatabase) {
    this.database = database;
  }

  static fromDbml(dbml: string) {
    const parser = new Parser();
    const core = parser.parse(dbml, "dbml");
    return new Importer(core);
  }

  static fromJson(json: string) {
    const parser = new Parser();
    const core = parser.parse(json, "json");
    return new Importer(core);
  }

  static fromPsql(psql: string) {
    const parser = new Parser();
    const core = parser.parse(psql, "postgres");
    return new Importer(core);
  }

  static fromMysql(mysql: string) {
    const parser = new Parser();
    const core = parser.parse(mysql, "mysql");
    return new Importer(core);
  }

  toDatabase(): Database {
    const dbml = ModelExporter.export(this.database.normalize(), "dbml");
    return dbmlToDatabase(dbml);
  }
}
