import connection from "../database/pg";

export async function getapikey(api:string){
    const response = await connection.query(`SELECT * FROM companies WHERE "apiKey"=$1`,[api]);
    return response.rows[0]
}