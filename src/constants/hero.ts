import { initialDatabase } from "@/data/mock_database";
import type { Database } from "@/features/database/schemas/database";
import type { Edge, Node } from "@xyflow/react";

type Position = {
  x: number;
  y: number;
};

const HERO_TABLE_POSITIONS: Record<string, Position> = {
  users: { x: 620, y: 50 },
  posts: { x: 1000, y: 50 },
  comments: { x: 620, y: 250 },
  posts_comments: { x: 1000, y: 300 },
};


const getTablePosition = (tableName: string): Position =>
  HERO_TABLE_POSITIONS[tableName]

export const createHeroNodes = (database: Database = initialDatabase): Node[] =>
  database.tables.map((table) => ({
    id: table.name,
    type: "tableNode",
    position: getTablePosition(table.name),
    selected: table.isSelected,
    data: {
      name: table.name,
      fields: table.fields,
      alias: table.alias,
      headerColor: table.headerColor,
    },
  }));

export const createHeroEdges = (database: Database = initialDatabase): Edge[] =>
  database.refs.map(
    (ref) =>
      ({
        id: ref.name,
        source: ref.endpoints[0].tableName,
        sourceHandle: ref.endpoints[0].fieldName,
        target: ref.endpoints[1].tableName,
        targetHandle: ref.endpoints[1].fieldName,
        type: "refEdge",
        label: ref.name,
        data: {
          name: ref.name,
          endpoints: ref.endpoints,
          operator: ref.operator,
        },
        selected: ref.isSelected,
      }) as Edge,
  );

export const HERO_NODES = createHeroNodes();
export const HERO_EDGES = createHeroEdges();

export const DATABASES = [
  "MySQL",
  "PostgreSQL",
  "SQLite",
  "MariaDB",
  "SQL Server",
  "Oracle",
];
