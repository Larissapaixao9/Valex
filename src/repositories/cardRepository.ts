import { query } from "express";
import connection from "../database/pg";
import { verifyExpiredCard } from "../services/cardCreationService";

export async function findEmployees(id:number,typeofcard:string){
    let employee = await connection.query(`SELECT * FROM employees WHERE id=$1`,[id]);
    return employee.rowCount
}
export async function findDuplicateCardType(id:number,typeofcard:string) {
    let amountofCardsfromType = await connection.query(`SELECT * FROM cards WHERE "employeeId"=$1 AND type=$2`,[id,typeofcard]);
    return amountofCardsfromType;
}
export async function getEmployeeName(id:number) {
    let employeeName = await connection.query(`SELECT "fullName" FROM employees WHERE id=$1`,[id])
    return employeeName.rows[0];
}
export async function createCardforEmployee(id:number, employeeName:string, cardNumber:number, encriptedCvc:string, formatedDate:string,type:string){
    const responseofInsertion = await connection.query(
        `INSERT INTO cards ("employeeId", number, "cardholderName","securityCode",
        "expirationDate",type, "isVirtual","isBlocked") 
        VALUES ('${id}', '${cardNumber}','${employeeName}','${encriptedCvc}','${formatedDate}',
        '${type}','${false}','${true}')`)

    if(responseofInsertion){
        return true;
    }
    return false;
}

export async function findcvc(id:number) {
    const cardCvc = await connection.query(`SELECT "securityCode" FROM cards WHERE id=$1`,[id]);
    return cardCvc.rows[0]
}

export async function findCardByIdandCvc(id:number, cvc:any) {
    const isCard = await connection.query(`SELECT * FROM cards WHERE id=$1 AND "securityCode"=$2`,[id,cvc]);
    return isCard.rowCount;
}

export async function findExpirationCard(id:number, cvc:string) {
    const isCardExpiration = await connection.query(`SELECT "expirationDate" FROM cards WHERE id=$1 AND "securityCode"=$2`,[id,cvc]);
    return isCardExpiration.rows[0]
}
export async function verifyCardId(id:number){
    const row = await connection.query(`SELECT * FROM cards WHERE id=$1`,[id])
    return row.rowCount;
}
export async function getPassword(id:number){
    const password = await connection.query(`SELECT password FROM cards WHERE id=$1`,[id])
    return password.rows[0];
}
export async function unlockCard(id:number, password:string) {
    const setNewPassword = await connection.query(`UPDATE cards SET password=$1, "isBlocked"=$2 WHERE id=$3`,[password,false,id]);
    return setNewPassword
}
export async function getTransactions(id:number){
    const transactions = await connection.query(`SELECT payments.*,recharges.id AS recharges_id, recharges."cardId" AS recharges_cardid,recharges.timestamp AS recharges_timestamp,recharges.amount AS recharges_amount,businesses.name AS businesses_name FROM payments JOIN businesses ON payments."businessId"=businesses.id JOIN recharges ON payments."cardId"=payments."cardId" WHERE recharges."cardId"=$1`,[id])

    // const originalRentalsData = await connection.query(`SELECT rentals.*, customers.id AS customer_ids,customers.name as custumres_names, games.id as games_ids, games.name as games_names,categories.id as category_ids, categories.name as category_names  FROM rentals JOIN customers ON rentals."customerId"=customers.id JOIN games ON rentals."gameId"=games.id JOIN categories ON games."categoryId"=categories.id`)

    return transactions.rows
}
export async function isCardExpired(id:number){
    const isCardExpiration = await connection.query(`SELECT "expirationDate" FROM cards WHERE id=$1 `,[id]);
    return isCardExpiration.rows[0]
}

export async function getBlockedandUnblockedCard(id:number){
    const cardStatus = await connection.query(`SELECT "isBlocked" FROM cards WHERE id=$1 `,[id]);
    return cardStatus.rows[0];
}

export async function blockCardByid(id:number, password:any){
    const block = await connection.query(`UPDATE cards SET "isBlocked"=$1 WHERE id=$2 AND PASSWORD=$3`,[true,id,password]);

    return block;
}

export async function unlocktheCard(id:number,password:any) {
    const response = await connection.query(`UPDATE cards SET "isBlocked"=$1 WHERE id=$2 AND PASSWORD=$3`,[false,id,password])

    return response;
}
