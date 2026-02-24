import type { Database as CoreDatabase } from "@dbml/core";
import { ModelExporter, Parser } from "@dbml/core";
import type { Database } from "@/features/database/schemas/database";
import { databaseToDbml } from "./convert";

export class Exportor {
  database: CoreDatabase;

  private constructor(database: CoreDatabase) {
    this.database = database;
  }

  static fromDatabase(database: Database) {
    const parser = new Parser();
    const dbml = databaseToDbml(database);
    const core = parser.parse(dbml, "dbml");
    return new Exportor(core);
  }

  toDbml = () => {
    return ModelExporter.export(this.database.normalize(), "dbml");
  };

  toPsql = () => {
    return ModelExporter.export(this.database.normalize(), "postgres");
  };

  toMysql = () => {
    return ModelExporter.export(this.database.normalize(), "mysql");
  };

  toJson = () => {
    return ModelExporter.export(this.database.normalize(), "json");
  };
}
