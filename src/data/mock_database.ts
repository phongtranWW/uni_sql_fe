import { TABLE_HEADER_COLORS } from "@/constants/table-header-colors";
import type { Database } from "@/features/project/states/database";
import { REF_OPERATOR, type Ref } from "@/features/project/states/ref";
import type { Table } from "@/features/project/states/table";

const users: Table = {
  name: "users",
  isSelected: false,
  headerColor: TABLE_HEADER_COLORS.BLUE,
  alias: "u",
  fields: [
    {
      name: "id",
      type: "bigint",
      unique: true,
      pk: true,
      not_null: true,
      increment: true,
    },
    {
      name: "email",
      type: "varchar(255)",
      unique: true,
      pk: false,
      not_null: true,
      increment: false,
    },
    {
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
  name: "posts",
  isSelected: false,
  headerColor: TABLE_HEADER_COLORS.EMERALD,
  alias: "p",
  fields: [
    {
      name: "id",
      type: "bigint",
      unique: true,
      pk: true,
      not_null: true,
      increment: true,
    },
    {
      name: "user_id",
      type: "bigint",
      unique: false,
      pk: false,
      not_null: true,
      increment: false,
    },
    {
      name: "title",
      type: "varchar(255)",
      unique: false,
      pk: false,
      not_null: true,
      increment: false,
    },
    {
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
  name: "comments",
  isSelected: false,
  headerColor: TABLE_HEADER_COLORS.ROSE,
  alias: "c",
  fields: [
    {
      name: "id",
      type: "bigint",
      unique: true,
      pk: true,
      not_null: true,
      increment: true,
    },
    {
      name: "post_id",
      type: "bigint",
      unique: false,
      pk: false,
      not_null: true,
      increment: false,
    },
    {
      name: "author_name",
      type: "varchar(255)",
      unique: false,
      pk: false,
      not_null: true,
      increment: false,
    },
    {
      name: "content",
      type: "text",
      unique: false,
      pk: false,
      not_null: true,
      increment: false,
    },
  ],
};

const posts_comments: Table = {
  name: "posts_comments",
  isSelected: false,
  headerColor: TABLE_HEADER_COLORS.VIOLET,
  alias: "pc",
  fields: [
    {
      name: "post_id",
      type: "bigint",
      unique: false,
      pk: true,
      not_null: true,
      increment: false,
    },
    {
      name: "comment_id",
      type: "bigint",
      unique: false,
      pk: true,
      not_null: true,
      increment: false,
    },
  ],
};

const fk_users_post: Ref = {
  isSelected: false,
  name: "users_posts",
  endpoints: [
    {
      tableName: users.name,
      fieldName: users.fields[0].name,
    },
    {
      tableName: posts.name,
      fieldName: posts.fields[1].name,
    },
  ],
  operator: REF_OPERATOR.ONE_TO_MANY,
};

const fk_post_comments: Ref = {
  name: "fk_post_comments",
  isSelected: false,
  endpoints: [
    {
      tableName: posts.name,
      fieldName: posts.fields[0].name,
    },
    {
      tableName: posts_comments.name,
      fieldName: posts_comments.fields[0].name,
    },
  ],
  operator: REF_OPERATOR.ONE_TO_MANY,
};

const fk_comment_posts: Ref = {
  name: "fk_comment_posts",
  isSelected: false,
  endpoints: [
    {
      tableName: comments.name,
      fieldName: comments.fields[0].name,
    },
    {
      tableName: posts_comments.name,
      fieldName: posts_comments.fields[1].name,
    },
  ],
  operator: REF_OPERATOR.ONE_TO_MANY,
};

export const initialDatabase: Database = {
  name: "Mock Database",
  tables: [users, posts, comments, posts_comments],
  refs: [fk_users_post, fk_post_comments, fk_comment_posts],
};
