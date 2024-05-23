/**
 * 供原始查询使用的类型
 */
export interface TableEntity{
    table_name:string
    table_comment:string
    create_time:Date
    update_time:Date|null
}