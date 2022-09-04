import connection from "../database/pg";

export async function getRechargesbyCardbyid(id:number){
    const result = await connection.query(`SELECT * FROM recharges WHERE "cardId"=$1`,[id]);
    return result.rows;
}

export async function insertRecharge(id:number,value:number){
    const result = await connection.query(
        `INSERT INTO recharges ("cardId",amount) VALUES('${id}','${value}')`)
    
    return result
}