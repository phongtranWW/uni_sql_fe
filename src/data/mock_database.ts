import type { Database } from "@/features/database/schemas/database";
import type { Ref } from "@/features/database/schemas/ref";
import type { Table } from "@/features/database/schemas/table";
import { nanoid } from "nanoid";

const users: Table = {
  id: nanoid(6),
  name: "users",
  headerColor: "#3b82f6",
  alias: "u",
  fields: [
    {
      id: nanoid(6),
      name: "id",
      type: "bigint",
      unique: true,
      pk: true,
      not_null: true,
      increment: true,
    },
    {
      id: nanoid(6),
      name: "email",
      type: "varchar(255)",
      unique: true,
      pk: false,
      not_null: true,
      increment: false,
    },
    {
      id: nanoid(6),
      name: "password_hash",
      type: "varchar(255)",
      unique: false,
      pk: false,
      not_null: true,
      increment: false,
    },
  ],
};

const posts: Table = {
  id: nanoid(6),
  name: "posts",
  headerColor: "#10b981",
  alias: "p",
  fields: [
    {
      id: nanoid(6),
      name: "id",
      type: "bigint",
      unique: true,
      pk: true,
      not_null: true,
      increment: true,
    },
    {
      id: nanoid(6),
      name: "user_id",
      type: "bigint",
      unique: false,
      pk: false,
      not_null: true,
      increment: false,
    },
    {
      id: nanoid(6),
      name: "title",
      type: "varchar(255)",
      unique: false,
      pk: false,
      not_null: true,
      increment: false,
    },
    {
      id: nanoid(6),
      name: "content",
      type: "text",
      unique: false,
      pk: false,
      not_null: true,
      increment: false,
    },
  ],
};

const comments: Table = {
  id: nanoid(6),
  name: "comments",
  headerColor: "#f59e0b",
  alias: "c",
  fields: [
    {
      id: nanoid(6),
      name: "id",
      type: "bigint",
      unique: true,
      pk: true,
      not_null: true,
      increment: true,
    },
    {
      id: nanoid(6),
      name: "post_id",
      type: "bigint",
      unique: false,
      pk: false,
      not_null: true,
      increment: false,
    },
    {
      id: nanoid(6),
      name: "author_name",
      type: "varchar(255)",
      unique: false,
      pk: false,
      not_null: true,
      increment: false,
    },
    {
      id: nanoid(6),
      name: "content",
      type: "text",
      unique: false,
      pk: false,
      not_null: true,
      increment: false,
    },
  ],
};

const users_post: Ref = {
  id: nanoid(6),
  name: "users_posts",
  endpoints: [
    {
      id: nanoid(6),
      tableId: users.id,
      fieldId: users.fields[0].id,
      relation: "1",
    },
    {
      id: nanoid(6),
      tableId: posts.id,
      fieldId: posts.fields[1].id,
      relation: "*",
    },
  ],
};

const posts_comments: Ref = {
  id: nanoid(6),
  name: "posts_comments",
  endpoints: [
    {
      id: nanoid(6),
      tableId: posts.id,
      fieldId: posts.fields[0].id,
      relation: "1",
    },
    {
      id: nanoid(6),
      tableId: comments.id,
      fieldId: comments.fields[1].id,
      relation: "*",
    },
  ],
};

export const initialDatabase: Database = {
  tables: [users, posts, comments],
  refs: [users_post, posts_comments],
};
