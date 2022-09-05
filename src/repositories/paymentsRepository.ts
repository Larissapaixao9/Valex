import connection from "../database/pg";

export async function getPaymentsAndBusinessNameBycardId(id:number) {
    const result = await connection.query(`SELECT  payments.*,
    businesses.name as "businessName"
    FROM payments 
    JOIN businesses ON businesses.id=payments."businessId"
    WHERE "cardId"=$1`,[id])

    return result.rows;
}

export async function getById(id:number){
    const result = await connection.query(`SELECT * FROM businesses WHERE id=$1`,[id]);
    return result.rows[0]
}

export async function getCardType(cardId:number){
    const result = await  connection.query(`SELECT type FROM cards WHERE id=$1`,[cardId]);
    return result.rows[0];
}

export async function getBusinessType(cardId:number){
    const result = await  connection.query(`SELECT type FROM businesses WHERE id=$1`,[cardId]);
    return result.rows[0];
}

export async function insertNewPayment(cardId:number,businessId:number,amount:number) {
   const result = await connection.query(
    `INSERT INTO payments ("cardId","businessId",amount) 
    VALUES('${cardId}','${businessId}','${amount}')`)

    return result;
}