import type { Field, Table } from "@/types/database-diagram";

export const mockTables: Table[] = [
  {
    id: "table_users",
    name: "Users",
    alias: "User Info",
    note: "Stores basic user information",
    partials: [],
    fieldIds: ["field_user_id", "field_username", "field_email"],
    indexIds: [],
    schemaId: 1,
    groupId: null,
  },
  {
    id: "table_orders",
    name: "Orders",
    alias: null,
    note: "Stores order information",
    partials: [],
    fieldIds: ["field_order_id", "field_user_ref", "field_total"],
    indexIds: [],
    schemaId: 1,
    groupId: null,
  },
];

export const mockFields: Field[] = [
  // === Users Table ===
  {
    id: "field_user_id",
    name: "id",
    type: {
      schemaName: null,
      type_name: "INTEGER",
      args: null,
    },
    pk: true,
    not_null: true,
    unique: true,
    increment: true,
    note: "Primary key of user",
    tableId: "table_users",
    enumId: null,
  },
  {
    id: "field_username",
    name: "username",
    type: {
      schemaName: null,
      type_name: "VARCHAR",
      args: "50",
    },
    unique: true,
    not_null: true,
    note: "User's login name",
    tableId: "table_users",
    enumId: null,
  },
  {
    id: "field_email",
    name: "email",
    type: {
      schemaName: null,
      type_name: "VARCHAR",
      args: "100",
    },
    not_null: true,
    note: "User's email address",
    tableId: "table_users",
    enumId: null,
  },

  // === Orders Table ===
  {
    id: "field_order_id",
    name: "id",
    type: {
      schemaName: null,
      type_name: "INTEGER",
      args: null,
    },
    pk: true,
    not_null: true,
    increment: true,
    note: "Primary key of order",
    tableId: "table_orders",
    enumId: null,
  },
  {
    id: "field_user_ref",
    name: "user_id",
    type: {
      schemaName: null,
      type_name: "INTEGER",
      args: null,
    },
    note: "Reference to Users table",
    tableId: "table_orders",
    enumId: null,
  },
  {
    id: "field_total",
    name: "total_amount",
    type: {
      schemaName: null,
      type_name: "DECIMAL",
      args: "10,2",
    },
    note: "Total price of the order",
    tableId: "table_orders",
    enumId: null,
  },
];
