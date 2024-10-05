import type { InferInsertModel, InferSelectModel } from "drizzle-orm"
import type { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core"

import type * as schema from "./schema"
import { type db } from "."

/**
 * Filters out any relation definitions from your schema
 */
type SchemaTableNames = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [TableOrRelationName in keyof typeof schema]: (typeof schema)[TableOrRelationName] extends SQLiteTableWithColumns<any>
    ? TableOrRelationName
    : never
}[keyof typeof schema]

export type SchemaTables = {
  [TableName in SchemaTableNames]: (typeof schema)[TableName]
}

type DBSelectTypeMap = {
  [TableName in SchemaTableNames]: InferSelectModel<(typeof schema)[TableName]>
}
/**
 * Get the SELECT type for a table given it's export name in the drizzle schema.
 */
export type Doc<TableName extends keyof DBSelectTypeMap> = DBSelectTypeMap[TableName]

type DBInsertTypeMap = {
  [TableName in SchemaTableNames]: InferInsertModel<(typeof schema)[TableName]>
}
/**
 * Get the INSERT type for a table given it's export name in the drizzle schema.
 */
export type DocInsert<TableName extends keyof DBInsertTypeMap> = DBInsertTypeMap[TableName]

export type DBOrTransation = Parameters<Parameters<typeof db.transaction>[0]>[0] | typeof db
